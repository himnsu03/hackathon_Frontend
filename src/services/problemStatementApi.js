import { httpClient } from './httpClient';
import { problemStatementService } from './problemStatementService';

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') return val.split('\n').map((s) => s.trim()).filter(Boolean);
  return [];
};

export const problemStatementApi = {
  /**
   * Fetch active problem statements from backend GET /api/problem-statements
   */
  async getProblemStatements() {
    try {
      const response = await httpClient.get('/problem-statements');
      const data = response.data?.content || response.data?.items || response.data;
      if (Array.isArray(data)) {
        return data.map((item) => ({
          dbId: item.dbId || item.db_id || item.id,
          id: item.id || item.code || item.referenceCode || `PS-${item.title?.slice(0, 5)}`,
          title: item.title || item.name || 'Untitled Problem Statement',
          category: item.category || item.track || 'General Tech',
          description: item.description || item.challengeDetails || item.content || '',
          requirements: parseList(item.requirements || item.rules),
          deliverables: parseList(item.deliverables),
          useCases: parseList(item.useCases || item.use_cases),
          rules: item.rules || '',
          active: item.active !== false,
          createdAt: item.createdAt || item.createdDate || new Date().toISOString().split('T')[0],
        }));
      }
    } catch (err) {
      console.warn('[problemStatementApi] getProblemStatements error:', err.message);
    }
    return problemStatementService.getStatements();
  },
};
