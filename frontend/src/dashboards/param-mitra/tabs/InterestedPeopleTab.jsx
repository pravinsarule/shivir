import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';

export default function InterestedPeopleTab({
  interestedPeople = [],
  onAddInterestedPerson,
}) {
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    area: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      area: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.area.trim()
    ) {
      alert('Please fill all required fields.');
      return;
    }

    if (onAddInterestedPerson) {
      onAddInterestedPerson({
        name: form.name.trim(),
        email: form.email.trim(),
        area: form.area.trim(),
      });
    }

    resetForm();
    setShowModal(false);
  };

  const filteredPeople = interestedPeople.filter((person) => {

    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      person.name?.toLowerCase().includes(searchValue) ||
      person.email?.toLowerCase().includes(searchValue) ||
      person.area?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <PageHeader
        title="Interested People"
        subtitle="People interested in attending foundation sessions"
        action={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Interested Person
          </button>
        }
      />

      {/* Search */}
      <Card className="p-4">

        <div className="relative w-full sm:w-80">

          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />

          <input
            type="text"
            placeholder="Search name, email, area..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-amber-400"
          />

        </div>

      </Card>

      {/* Table */}
      <Card className="overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Name
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Email
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Area
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredPeople.length > 0 ? (

                filteredPeople.map((person) => (

                  <tr
                    key={person.id}
                    className="hover:bg-slate-50 transition"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                          {person.name
                            ? person.name.charAt(0).toUpperCase()
                            : '?'}
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-900">
                            {person.name}
                          </p>

                          <p className="text-[11px] text-emerald-600">
                            Interested in Session
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-xs text-slate-600">
                      {person.email}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-600">
                      {person.area}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="px-5 py-14 text-center"
                  >

                    <p className="text-sm font-semibold text-slate-500">
                      No interested people found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      People interested in sessions will appear here.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">

          <p className="text-xs text-slate-500">
            Total Interested People:{' '}
            <span className="font-bold text-slate-700">
              {filteredPeople.length}
            </span>
          </p>

        </div>

      </Card>

      {/* Add Interested Person Modal */}
      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Add Interested Person
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Add a person interested in a session
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              {/* Name */}
              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                  required
                />

              </div>

              {/* Email */}
              <div className="mt-4">

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                  required
                />

              </div>

              {/* Area */}
              <div className="mt-4">

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Area *
                </label>

                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                  required
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-lg"
                >
                  Add Person
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
