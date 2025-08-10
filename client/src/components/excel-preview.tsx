interface ExcelPreviewProps {
  data: string[][];
}

export function ExcelPreview({ data }: ExcelPreviewProps) {
  if (!data || data.length === 0) return null;

  const headers = data[0] || [];
  const rows = data.slice(1);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Data Preview</h3>
      <div className="bg-slate-50 rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-slate-400 px-3 py-2 text-left font-semibold text-slate-700"
                >
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-100">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-slate-300 px-3 py-2"
                  >
                    {cell || ''}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length > 10 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="border border-slate-300 px-3 py-2 text-center text-slate-500 italic"
                >
                  ... and {rows.length - 10} more rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
