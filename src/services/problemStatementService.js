// Service for managing local storage problem statement state
const STORAGE_KEY = 'hackathon_problem_statements';

export const problemStatementService = {
  getStatements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading problem statements from localStorage:', e);
    }
    return [];
  },

  addStatement(newStatement) {
    const current = this.getStatements();
    const formatted = {
      id: newStatement.id || `PS-${Date.now().toString().slice(-4)}`,
      title: newStatement.title.trim(),
      category: newStatement.category?.trim() || 'General Tech',
      description: newStatement.description.trim(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updated = [formatted, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return formatted;
  },

  deleteStatement(id) {
    const current = this.getStatements();
    const updated = current.filter((ps) => ps.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
