module.exports = async function lambda_policy(policy, service, options) {
  const template =
    service.compiled['cloudformation-template-update-stack.json'];

  const MAX_CONCURRENT_EXECUTIONS = 10;

  if (template.Resources) {
    await Object.entries(template.Resources).forEach(([name, resource]) => {
      if (resource.Type === 'AWS::Lambda::Function') {
        const tags = resource.Properties.Tags;
        const concurrentExecutionLimit =
          resource.Properties.ReservedConcurrentExecutions;

        if (!concurrentExecutionLimit) {
          policy.fail('Please set a concurrency limit.');
          return;
        }

        if (concurrentExecutionLimit > MAX_CONCURRENT_EXECUTIONS) {
          policy.fail('Exceeded max concurrency limit');
          return;
        }

        if (!tags?.length > 0) {
          policy.fail('Resource must be tagged!');
          return;
        }

        policy.approve();
      }
    });
  }
};
