import React from 'react';
import { cn } from '../../utils/cn';

export const Table = ({ children, className }) => (
  <div className={cn("w-full overflow-x-auto rounded-xl border border-slate-200 bg-white", className)}>
    <table className="w-full border-collapse text-left text-sm">
      {children}
    </table>
  </div>
);

export const THead = ({ children, className }) => (
  <thead className={cn("bg-slate-50/50", className)}>
    {children}
  </thead>
);

export const TBody = ({ children, className }) => (
  <tbody className={cn("divide-y divide-slate-100", className)}>
    {children}
  </tbody>
);

export const TH = ({ children, className }) => (
  <th className={cn("px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500", className)}>
    {children}
  </th>
);

export const TR = ({ children, className }) => (
  <tr className={cn("transition-colors hover:bg-slate-50/30", className)}>
    {children}
  </tr>
);

export const TD = ({ children, className }) => (
  <td className={cn("px-6 py-4 text-slate-600", className)}>
    {children}
  </td>
);
