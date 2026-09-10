import { Plus, Search, Filter } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';
import { TableWrap, Th, Td } from '../../shared/ui/Table.jsx';
import { roleBadgeVariant } from '../utils.js';

export default function PeoplePage({
  people, personFilterRole, personSearch,
  onFilterRoleChange, onSearchChange, onAddPerson,
}) {
  const filteredPeople = people.filter(p => {
    const matchesRole = personFilterRole === 'All' || p.role === personFilterRole;
    const matchesSearch = p.name.toLowerCase().includes(personSearch.toLowerCase())
      || p.email.toLowerCase().includes(personSearch.toLowerCase())
      || p.city.toLowerCase().includes(personSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="People & Volunteers Management"
        subtitle="Manage foundation members, Param Mitra, Crew, Programme Leads, and volunteers across all cities."
        action={
          <button onClick={onAddPerson} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition">
            <Plus className="h-4 w-4" /> Add Person
          </button>
        }
      />

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Role:</span>
          <select
            value={personFilterRole}
            onChange={e => onFilterRoleChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 text-slate-700 outline-none focus:border-amber-500 font-medium"
          >
            <option value="All">All Roles</option>
            <option value="Param Mitra">Param Mitra</option>
            <option value="Crew">Crew</option>
            <option value="Programme Lead">Programme Lead</option>
            <option value="Field Volunteer">Field Volunteer</option>
            <option value="Vidya Mandir">Vidya Mandir</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={personSearch}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg outline-none focus:border-amber-500"
          />
        </div>
      </Card>

      <TableWrap>
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <Th>ID</Th><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Role</Th><Th>City</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredPeople.map(p => (
            <tr key={p.id} className="hover:bg-slate-50/80 transition">
              <Td className="font-mono text-slate-400 font-medium">{p.id}</Td>
              <Td className="font-semibold text-slate-900">{p.name}</Td>
              <Td className="text-slate-500">{p.email}</Td>
              <Td className="text-slate-600 font-mono text-[11px]">{p.phone}</Td>
              <Td><Badge label={p.role} variant={roleBadgeVariant(p.role)} /></Td>
              <Td className="font-medium text-slate-700">{p.city}</Td>
              <Td><Badge label={p.status} variant="success" /></Td>
            </tr>
          ))}
          {filteredPeople.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">No matching people found.</td>
            </tr>
          )}
        </tbody>
      </TableWrap>
    </div>
  );
}
