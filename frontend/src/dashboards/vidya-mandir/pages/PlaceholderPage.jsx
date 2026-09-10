import { Settings } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';

export default function PlaceholderPage({ title }) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} />
      <Card className="p-16 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Settings className="h-7 w-7 text-slate-400" />
        </div>
        <p className="font-semibold text-slate-700">Module Under Construction</p>
        <p className="text-sm text-slate-400 max-w-xs">This section will be implemented in the next phase. Core layout and navigation are ready.</p>
      </Card>
    </div>
  );
}
