import React from 'react';

import { ArrowLeft } from 'lucide-react';

const StudyViewer = ({ title, data, onBack }) => {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-text-muted">No data available.</div>;
  }

  // Extract all unique keys from the first few items to form columns
  const allKeys = new Set();
  const maxItemsToCheck = Math.min(data.length, 10);
  for (let i = 0; i < maxItemsToCheck; i++) {
    Object.keys(data[i]).forEach(key => allKeys.add(key));
  }
  
  // Exclude 'id' or internal keys if needed, but we can just show all
  const columns = Array.from(allKeys).filter(key => key !== 'id' && !key.startsWith('__EMPTY'));

  // Some tables like articles-and-more have '__EMPTY' keys for columns, let's just use all keys if they contain useful data.
  // Actually, for articles-and-more, the first row contains the real headers sometimes. Let's just render whatever keys are present.
  const actualColumns = Array.from(allKeys);

  return (
    <div className="animate-fade-in p-4 pb-12 w-full max-w-6xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-text-muted hover:text-text rounded-full shadow-sm border border-border transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
      )}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-2">
          {title}
        </h1>
        <p className="text-text-muted">Review your study material</p>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              {actualColumns.map((col, idx) => (
                <th key={idx} className="p-3 md:p-4 font-bold text-text text-sm md:text-base whitespace-nowrap">
                  {col.startsWith('__EMPTY') ? '' : col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                {actualColumns.map((col, colIdx) => {
                  let cellData = row[col];
                  if (typeof cellData === 'object') {
                      cellData = JSON.stringify(cellData);
                  }
                  return (
                    <td key={colIdx} className="p-3 md:p-4 text-text/90 text-sm md:text-base">
                      {cellData}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudyViewer;
