import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sns from "aws-cdk-lib/aws-sns";
import { StackBasicProps } from "../interfaces";
import { getCdkPropsCustomProps, getResourseNameWithPrefix } from "../util";

export interface IamStackProps extends StackBasicProps {
  petsTable: dynamodb.Table;
  petHappyTopic: sns.Topic;
}

export class IamStack extends cdk.Stack {
  public readonly lambdaRole: iam.Role;

  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, getCdkPropsCustomProps(props));

    // Create Lambda role
    this.lambdaRole = new iam.Role(this, "PetsLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: getResourseNameWithPrefix(`pets-lambda-role-${props.env}`),
      description: "Role for Pet Foundation Lambda functions",
    });

    // Add DynamoDB permissions
    props.petsTable.grantReadWriteData(this.lambdaRole);

    // Add SNS permissions
    this.lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sns:Publish"],
        resources: [props.petHappyTopic.topicArn],
      })
    );

    // Add CloudWatch Logs permissions
    this.lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
    );

    // Outputs
    new cdk.CfnOutput(this, "PetsLambdaRoleArn", {
      value: this.lambdaRole.roleArn,
      description: "ARN of the Pets Lambda Role",
      exportName: `api-pet-foundation-${props.env}-pets-lambda-role-arn`
    });
  }
} 