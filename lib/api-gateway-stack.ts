import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { StackBasicProps } from "../interfaces";
import { getCdkPropsCustomProps, getResourseNameWithPrefix } from "../util";

export interface ApiGatewayStackProps extends StackBasicProps {}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigateway.HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, getCdkPropsCustomProps(props));

    // Crear el HTTP API
    this.api = new apigateway.HttpApi(this, "HttpApi", {
      apiName: getResourseNameWithPrefix(`api-${props.env}`),
      description: "HTTP API for Pet Foundation API",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [
          apigateway.CorsHttpMethod.GET,
          apigateway.CorsHttpMethod.POST,
          apigateway.CorsHttpMethod.PUT,
          apigateway.CorsHttpMethod.DELETE,
          apigateway.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
        maxAge: cdk.Duration.days(1),
      },
    });

    // Outputs
    new cdk.CfnOutput(this, "ApiGatewayId", {
      value: this.api.httpApiId,
      description: "ID del HTTP API Gateway",
      exportName: `api-pet-foundation-${props.env}-api-id`
    });

    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: this.api.url ?? "URL no disponible",
      description: "URL del HTTP API Gateway",
    });
  }

  // Método para agregar una Lambda al HTTP API
  public addLambdaIntegration(
    path: string,
    httpMethod: string,
    lambdaFunction: lambda.IFunction
  ): void {
    const integration = new integrations.HttpLambdaIntegration(
      `${path}-${httpMethod}-integration`,
      lambdaFunction
    );

    this.api.addRoutes({
      path,
      methods: [apigateway.HttpMethod[httpMethod as keyof typeof apigateway.HttpMethod]],
      integration,
    });
  }
} 