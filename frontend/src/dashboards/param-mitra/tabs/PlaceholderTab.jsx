import Card from '../../shared/ui/Card.jsx';

export default function PlaceholderTab({ title = 'Duties & Meals Active' }) {
  return (
    <Card className="p-6 text-center text-xs text-slate-500 space-y-2">
      <h3 className="font-bold text-sm text-slate-900">{title}</h3>
      <p>Standing preference &amp; daily overrides managed in system.</p>
    </Card>
  );
}
