import { PublicProblemStatementService } from '../sdk';
import { problemStatementService } from './problemStatementService';
import { httpClient } from './httpClient';

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') return val.split('\n').map((s) => s.trim()).filter(Boolean);
  return [];
};

const mapItem = (item) => ({
  dbId: item.dbId || item.db_id || item.id,
  id: item.id || item.code || item.referenceCode || item.problemId || `PS-${item.title?.slice(0, 5)}`,
  title: item.title || item.name || 'Untitled Problem Statement',
  category: item.category || item.track || 'General Tech',
  description: item.description || item.challengeDetails || item.content || '',
  requirements: parseList(item.requirements || item.rules),
  deliverables: parseList(item.deliverables),
  useCases: parseList(item.useCases || item.use_cases),
  rules: item.rules || '',
  active: item.active !== false,
  createdAt: item.createdAt || item.createdDate || new Date().toISOString().split('T')[0],
});

export const problemStatementApi = {
  /**
   * Fetch active problem statements from backend via SDK or direct endpoints
   */
  async getProblemStatements() {
    try {
      const data = await PublicProblemStatementService.getPublicProblemStatements();
      const list = data?.content || data?.items || data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapItem);
      }
    } catch (err) {
      console.warn('[problemStatementApi] SDK fetch error:', err.message);
    }

    try {
      const res = await httpClient.get('/api/public/problem-statements');
      const list = res.data?.content || res.data?.items || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapItem);
      }
    } catch { /* fallback */ }

    try {
      const res = await httpClient.get('/api/problem-statements');
      const list = res.data?.content || res.data?.items || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapItem);
      }
    } catch { /* fallback */ }

    return problemStatementService.getStatements();
  },
};
