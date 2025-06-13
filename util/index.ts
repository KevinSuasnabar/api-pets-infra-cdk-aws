export function getCdkPropsCustomProps(props: any) {
  return {
    env: {
      account: props.account,
      region: props.region,
    },
    stackName: props.name,
  };
}

export function getResourseNameWithPrefix(resourseName: string) {
  return `api-pet-foundation-${resourseName}`;
}
