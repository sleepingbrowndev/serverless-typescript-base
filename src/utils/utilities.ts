import { Logger } from '@aws-lambda-powertools/logger';
// import { Metrics } from '@aws-lambda-powertools/metrics';
// import { Tracer } from '@aws-lambda-powertools/tracer';

// Set up the globals
const SERVICE_NAME = process.env.POWERTOOLS_SERVICE_NAME ?? "todoService";
const LOG_LEVEL = process.env.LOG_LEVEL ?? "INFO";
// const SERVICE_NAMESPACE = process.env.SERVICE_NAMESPACE ?? "test_namespace";

const logger = new Logger({ logLevel: LOG_LEVEL, serviceName: SERVICE_NAME });
// const metrics = new Metrics({ namespace: SERVICE_NAMESPACE, serviceName: SERVICE_NAME });
// const tracer = new Tracer({ serviceName: SERVICE_NAME });

export {
    logger,
    // metrics,
    // tracer
};