import * as XLSX from 'xlsx';

/**
 * Reusable utility to export filtered JSON data to an Excel (.xlsx) spreadsheet file directly in the browser.
 *
 * @param {Array} data - Array of formatted objects to export
 * @param {String} fileName - Desired output file name (e.g. 'synopsis_submissions_shortlisted.xlsx')
 * @param {String} sheetName - Title of the worksheet tab
 */
export const exportToExcel = (data, fileName = 'export.xlsx', sheetName = 'Submissions') => {
  if (!data || data.length === 0) {
    return false;
  }

  // Create worksheet from json data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-calculate column widths
  const objectKeys = Object.keys(data[0] || {});
  const colWidths = objectKeys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map((row) => String(row[key] || '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
  });
  worksheet['!cols'] = colWidths;

  // Create workbook & append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Trigger browser download
  XLSX.writeFile(workbook, fileName);
  return true;
};
