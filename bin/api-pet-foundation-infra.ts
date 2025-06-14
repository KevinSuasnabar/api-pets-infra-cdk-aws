#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DynamoStack } from "../lib/dynamo-stack";
import { ApiGatewayStack } from "../lib/api-gateway-stack";

const app = new cdk.App();

const appName = "api-pet-foundation";
const env = app.node.tryGetContext("env");

if (["dev", "prod"].indexOf(env) === -1) {
  throw new Error("Invalid environment");
}

const sharedProps = {
  env: env,
  account: "",
  region: "us-east-1",
};

// Stack de DynamoDB
const dynamoStack = new DynamoStack(app, "DynamoStack", {
  ...sharedProps,
  name: `${appName}-dynamo-${env}`,
});

// Stack de API Gateway
new ApiGatewayStack(app, "ApiGatewayStack", {
  ...sharedProps,
  name: `${appName}-api-${env}`,
});
