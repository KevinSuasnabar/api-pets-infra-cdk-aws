import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { StackBasicProps } from "../interfaces";
import { getCdkPropsCustomProps, getResourseNameWithPrefix } from "../util";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DynamoStack extends cdk.Stack {
  public readonly petsTable: dynamodb.Table;
  public readonly lambdaRole: iam.Role;

  constructor(scope: Construct, id: string, props?: StackBasicProps) {
    super(scope, id, getCdkPropsCustomProps(props));

    this.petsTable = new dynamodb.Table(this, "PetsTable", {
      tableName: getResourseNameWithPrefix(`pets-${props?.env}`),
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    this.lambdaRole = new iam.Role(this, "PetsLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: getResourseNameWithPrefix(`pets-lambda-role-${props?.env}`),
    });

    this.petsTable.grantReadWriteData(this.lambdaRole);

    this.lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
    );

    new cdk.CfnOutput(this, "PetsTableName", {
      value: this.petsTable.tableName,
    });

    new cdk.CfnOutput(this, "PetsTableArn", {
      value: this.petsTable.tableArn,
    });

    new cdk.CfnOutput(this, "PetsLambdaRoleArn", {
      value: this.lambdaRole.roleArn,
    });
  }
}
