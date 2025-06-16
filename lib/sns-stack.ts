import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { StackBasicProps } from "../interfaces";
import { getCdkPropsCustomProps, getResourseNameWithPrefix } from "../util";

export interface SnsStackProps extends StackBasicProps {
  leaderEmail: string;
}

export class SnsStack extends cdk.Stack {
  public readonly petHappyTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: SnsStackProps) {
    super(scope, id, getCdkPropsCustomProps(props));

    this.petHappyTopic = new sns.Topic(this, "PetHappyTopic", {
      topicName: getResourseNameWithPrefix(`pet-happy-${props.env}`),
      displayName: "Pet Happy Adoption Notifications",
    });

    this.petHappyTopic.addSubscription(
      new subscriptions.EmailSubscription(props.leaderEmail)
    );

    // Outputs
    new cdk.CfnOutput(this, "PetHappyTopicArn", {
      value: this.petHappyTopic.topicArn,
      description: "ARN of the Pet Happy SNS Topic",
      exportName: `api-pet-foundation-${props.env}-pet-happy-topic-arn`
    });
  }
} 