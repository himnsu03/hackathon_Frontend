import { httpClient } from './httpClient';
import { authApi } from './authApi';
import { candidateApi } from './candidateApi';
import { synopsisApi } from './synopsisApi';
import { hackathonApi } from './hackathonApi';
import { adminApi } from './adminApi';
import { resultsApi } from './resultsApi';
import { evaluatorApi } from './evaluatorApi';
import { problemStatementApi } from './problemStatementApi';

// Re-export generated OpenAPI Client SDK modules
import * as openapiSdk from '../sdk';

export { httpClient, authApi, candidateApi, synopsisApi, hackathonApi, adminApi, resultsApi, evaluatorApi, problemStatementApi, openapiSdk };

export const sdkClient = {
  httpClient,
  auth: authApi,
  candidate: candidateApi,
  synopsis: synopsisApi,
  hackathon: hackathonApi,
  admin: adminApi,
  results: resultsApi,
  evaluator: evaluatorApi,
  problemStatement: problemStatementApi,
  openapi: openapiSdk,
};

export default sdkClient;
