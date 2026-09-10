// import { Plus, Search, Filter } from 'lucide-react';
// import PageHeader from '../../shared/ui/PageHeader.jsx';
// import Card from '../../shared/ui/Card.jsx';
// import Badge from '../../shared/ui/Badge.jsx';

// export default function ContactsTab({
//   contacts,
//   contactCategory,
//   contactSearch,
//   onCategoryChange,
//   onSearchChange,
//   onAddContact,
//   onBookDemo,
//   onIssueCard,
// }) {
//   return (
//     <div className="space-y-5">
//       <PageHeader
//         title="Foundation Contacts"
//         subtitle="Foundation-owned contacts directory (duplicate mobile protection)"
//         action={
//           <button
//             onClick={onAddContact}
//             className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
//           >
//             <Plus className="h-4 w-4" /> Add Contact
//           </button>
//         }
//       />

//       <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           <Filter className="h-4 w-4 text-slate-400" />
//           <span className="text-xs font-semibold text-slate-600">Category:</span>
//           <select
//             value={contactCategory}
//             onChange={e => onCategoryChange(e.target.value)}
//             className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 text-slate-700 outline-none"
//           >
//             <option value="All">All Categories</option>
//             <option value="Elite">Elite</option>
//             <option value="Active">Active</option>
//             <option value="Warm">Warm</option>
//           </select>
//         </div>
//         <div className="relative w-full sm:w-64">
//           <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
//           <input
//             type="text"
//             placeholder="Search name, mobile..."
//             value={contactSearch}
//             onChange={e => onSearchChange(e.target.value)}
//             className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 outline-none"
//           />
//         </div>
//       </Card>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {contacts.map(c => (
//           <Card key={c.id} className="p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition">
//             <div>
//               <div className="flex items-center justify-between">
//                 <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
//                 <Badge label={c.category} variant="warning" />
//               </div>
//               <p className="text-xs text-slate-500 mt-1">📱 {c.mobile}</p>
//               <p className="text-xs text-slate-500">📍 Area: {c.area || 'Delhi'}</p>
//             </div>
//             <div className="pt-2 border-t border-slate-100 flex gap-2">
//               <button
//                 onClick={() => onBookDemo(c.id)}
//                 className="flex-1 bg-amber-500 text-slate-950 text-xs font-bold py-1.5 rounded-lg hover:bg-amber-600 transition"
//               >
//                 Book Demo
//               </button>
//               <button
//                 onClick={() => onIssueCard(c)}
//                 className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition"
//               >
//                 Issue Card
//               </button>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }



import { Plus, Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';

export default function ContactsTab({
  contacts = [],
  contactCategory = 'All',
  contactSearch = '',
  onCategoryChange,
  onSearchChange,
  onAddContact,
}) {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    area: '',
    category: '',
    designation: '',
    socialGroup: '',
    relationshipNote: '',
    interactionHistory: '',
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
      mobile: '',
      area: '',
      category: '',
      designation: '',
      socialGroup: '',
      relationshipNote: '',
      interactionHistory: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.mobile.trim() ||
      !form.area.trim() ||
      !form.category ||
      !form.designation.trim() ||
      !form.socialGroup.trim() ||
      !form.relationshipNote.trim() ||
      !form.interactionHistory.trim()
    ) {
      alert('Please fill all required fields.');
      return;
    }

    if (onAddContact) {
      onAddContact({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        area: form.area.trim(),
        category: form.category,
        designation: form.designation.trim(),
        socialGroup: form.socialGroup.trim(),
        relationshipNote: form.relationshipNote.trim(),
        interactionHistory: form.interactionHistory.trim(),
      });
    }

    resetForm();
    setShowModal(false);
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <PageHeader
        title="Foundation Contacts"
        subtitle="Contacts added and managed by Param Mitra"
        action={
          <button
            type="button"
            onClick={() => onAddContact?.()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        }
      />

      {/* Filters */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">

        <div className="flex items-center gap-2 w-full sm:w-auto">

          <Filter className="h-4 w-4 text-slate-400" />

          <span className="text-xs font-semibold text-slate-600">
            Category:
          </span>

          <select
            value={contactCategory}
            onChange={(event) => {
              if (onCategoryChange) {
                onCategoryChange(event.target.value);
              }
            }}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 text-slate-700 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Elite">Elite</option>
            <option value="Active">Active</option>
            <option value="Warm">Warm</option>
          </select>

        </div>

        <div className="relative w-full sm:w-72">

          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />

          <input
            type="text"
            placeholder="Search name, mobile..."
            value={contactSearch}
            onChange={(event) => {
              if (onSearchChange) {
                onSearchChange(event.target.value);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-amber-400"
          />

        </div>

      </Card>

      {/* Table */}
      <Card className="overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Name
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Mobile
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Area
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Designation
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Samaj / Social Group
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Relationship Note
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                  Interaction History
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {contacts.length > 0 ? (

                contacts.map((contact) => (

                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Name */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-9 w-9 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                          {contact.name
                            ? contact.name.charAt(0).toUpperCase()
                            : '?'}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {contact.name}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Contact #{contact.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Mobile */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {contact.mobile}
                    </td>

                    {/* Area */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {contact.area}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <Badge
                        label={contact.category}
                        variant="warning"
                      />
                    </td>

                    {/* Designation */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {contact.designation}
                    </td>

                    {/* Social Group */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {contact.socialGroup}
                    </td>

                    {/* Relationship */}
                    <td className="px-5 py-4 text-xs text-slate-600 max-w-[220px]">
                      <p
                        className="truncate"
                        title={contact.relationshipNote}
                      >
                        {contact.relationshipNote}
                      </p>
                    </td>

                    {/* Interaction */}
                    <td className="px-5 py-4 text-xs text-slate-600 max-w-[250px]">
                      <p
                        className="truncate"
                        title={contact.interactionHistory}
                      >
                        {contact.interactionHistory}
                      </p>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center"
                  >

                    <p className="text-sm font-semibold text-slate-500">
                      No contacts found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Click "Add Contact" to add your first contact.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">

          <p className="text-xs text-slate-500">
            Total Contacts:{' '}
            <span className="font-bold text-slate-700">
              {contacts.length}
            </span>
          </p>

        </div>

      </Card>

      {/* Add Contact Modal */}
      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Contact
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Add a foundation contact
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
              className="p-6 overflow-y-auto max-h-[75vh]"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    maxLength="10"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Area */}
                <div>
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

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Elite">Elite</option>
                    <option value="Active">Active</option>
                    <option value="Warm">Warm</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Designation *
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Social Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Samaj / Social Group *
                  </label>

                  <input
                    type="text"
                    name="socialGroup"
                    value={form.socialGroup}
                    onChange={handleChange}
                    placeholder="Enter Samaj / Social Group"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                    required
                  />
                </div>

              </div>

              {/* Relationship Note */}
              <div className="mt-4">

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Relationship Note *
                </label>

                <textarea
                  name="relationshipNote"
                  value={form.relationshipNote}
                  onChange={handleChange}
                  placeholder="Enter relationship details"
                  rows="3"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 resize-none"
                  required
                />

              </div>

              {/* Interaction History */}
              <div className="mt-4">

                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Interaction History *
                </label>

                <textarea
                  name="interactionHistory"
                  value={form.interactionHistory}
                  onChange={handleChange}
                  placeholder="Enter previous interaction details"
                  rows="4"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 resize-none"
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
                  Add Contact
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
