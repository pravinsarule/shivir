export function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs border-collapse min-w-[640px]">
        {children}
      </table>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 whitespace-nowrap">
      {children}
    </th>
  );
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-3 text-slate-800 border-b border-slate-100 ${className}`}>
      {children}
    </td>
  );
}
