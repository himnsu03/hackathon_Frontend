import { httpClient } from './httpClient';
import { authApi } from './authApi';
import { candidateApi } from './candidateApi';
import { synopsisApi } from './synopsisApi';
import { hackathonApi } from './hackathonApi';
import { adminApi } from './adminApi';
import { resultsApi } from './resultsApi';

export { httpClient, authApi, candidateApi, synopsisApi, hackathonApi, adminApi, resultsApi };

export const sdkClient = {
  httpClient,
  auth: authApi,
  candidate: candidateApi,
  synopsis: synopsisApi,
  hackathon: hackathonApi,
  admin: adminApi,
  results: resultsApi,
};

export default sdkClient;
