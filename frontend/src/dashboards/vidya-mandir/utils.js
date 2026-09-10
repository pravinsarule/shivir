export const reqVariant = s => s === 'Finalised' ? 'success' : s === 'Draft' ? 'neutral' : 'warning';
export const packVariant = s => s === 'Completed' ? 'info' : s === 'Blocked' ? 'danger' : 'warning';
export const delivVariant = s => s === 'In Transit' ? 'purple' : s === 'Not Shipped' ? 'neutral' : 'warning';

export const roleBadgeVariant = role => {
  if (role === 'Param Mitra') return 'purple';
  if (role === 'Crew') return 'info';
  if (role === 'Vidya Mandir') return 'warning';
  return 'success';
};
