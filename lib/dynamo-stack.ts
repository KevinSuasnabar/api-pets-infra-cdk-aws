import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { StackBasicProps } from "../interfaces";
import { getCdkPropsCustomProps, getResourseNameWithPrefix } from "../util";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DynamoStack extends cdk.Stack {
  public readonly petsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackBasicProps) {
    super(scope, id, getCdkPropsCustomProps(props));

    this.petsTable = new dynamodb.Table(this, "PetsTable", {
      tableName: getResourseNameWithPrefix(`pets-${props?.env}`),
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Outputs
    new cdk.CfnOutput(this, "PetsTableName", {
      value: this.petsTable.tableName,
      description: "Name of the Pets DynamoDB Table",
      exportName: `api-pet-foundation-${props?.env}-pets-table-name`
    });

    new cdk.CfnOutput(this, "PetsTableArn", {
      value: this.petsTable.tableArn,
      description: "ARN of the Pets DynamoDB Table",
      exportName: `api-pet-foundation-${props?.env}-pets-table-arn`
    });
  }
}
