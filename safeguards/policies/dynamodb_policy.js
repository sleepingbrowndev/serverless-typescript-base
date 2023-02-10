module.exports = function ddb_policy(policy, service, options) {
  const template =
    service.compiled['cloudformation-template-update-stack.json'];

  const BILLING_MODE = 'PROVISIONED';
  const MAX_READ_CAPACITIES = 5;
  const MAX_WRITE_CAPACITIES = 5;

  if (template.Resources) {
    Object.entries(template.Resources).forEach(([name, resource]) => {
      if (resource.Type === 'AWS::DynamoDB::Table') {
        const billing_mode = resource.Properties.BillingMode;
        const tags = resource.Properties.Tags;
        const read_capacities =
          resource.Properties.ProvisionedThroughput.ReadCapacityUnits;
        const write_capacities =
          resource.Properties.ProvisionedThroughput.WriteCapacityUnits;

        if (billing_mode != BILLING_MODE) {
          policy.fail(`Only Provisioned billing mode allowed`);
          return;
        }

        if (read_capacities > MAX_READ_CAPACITIES) {
          policy.fail(`Max read capacity units allowed is 5`);
          return;
        }

        if (write_capacities > MAX_WRITE_CAPACITIES) {
          policy.fail(`Max write capacity units allowed is 5`);
          return;
        }

        if (!tags.length > 0) {
          policy.fail(`Resource must be tagged`);
          return;
        }

        policy.approve();
      }
    });
  }
};
