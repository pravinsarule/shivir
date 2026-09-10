// import { CreditCard, ExternalLink, Mail, Users } from 'lucide-react';
// import PageHeader from '../../shared/ui/PageHeader.jsx';
// import KpiCard from '../../shared/ui/KpiCard.jsx';
// import Card from '../../shared/ui/Card.jsx';
// import Badge from '../../shared/ui/Badge.jsx';

// export default function CardsTab({ contacts = [], registrations = [], onResendInvitation, onAddPerson }) {
//   const complimentary = registrations.filter(item => item.payment_mode === 'Complimentary');
//   return (
//     <div className="space-y-5">
//       <PageHeader title="Invitation Cards" subtitle="Add an interested person, then send a demo payment link and invitation card." action={<button onClick={onAddPerson} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"><Users className="h-4 w-4" /> Add person &amp; send card</button>} />
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <KpiCard title="Interested people" value={contacts.length} color="border-slate-500" icon={Users} />
//         <KpiCard title="Cards created" value={registrations.length} color="border-emerald-500" icon={CreditCard} />
//         <KpiCard title="Email invitations" value={complimentary.length} color="border-blue-500" icon={Mail} />
//         <KpiCard title="Payment required" value="Disabled" color="border-amber-500" icon={CreditCard} />
//       </div>
//       <Card className="overflow-hidden">
//         <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-bold text-sm text-slate-900">Issued cards</h3></div>
//         <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-5 py-3 text-left">Person</th><th className="px-5 py-3 text-left">Mobile</th><th className="px-5 py-3 text-left">Token</th><th className="px-5 py-3 text-left">Card</th><th className="px-5 py-3 text-left">Invitation</th></tr></thead><tbody className="divide-y divide-slate-100">{registrations.map(item => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{item.registered_name || item.contact_name}</p><p className="text-xs text-slate-500">{item.email}</p></td><td className="px-5 py-4 text-xs text-slate-600">{item.mobile}</td><td className="px-5 py-4 font-mono font-bold text-amber-700">{item.token_number}</td><td className="px-5 py-4"><Badge label={item.card_type} variant="success" /></td><td className="px-5 py-4"><div className="flex gap-3"><a href={`/invitation/${encodeURIComponent(item.token_number)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"><ExternalLink className="h-3.5 w-3.5" /> Open card</a><button onClick={() => onResendInvitation?.(item.id)} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"><Mail className="h-3.5 w-3.5" /> Resend</button></div></td></tr>)}{!registrations.length && <tr><td colSpan="5" className="px-5 py-14 text-center text-sm text-slate-500">Add an interested person to create their first invitation card.</td></tr>}</tbody></table></div>
//       </Card>
//     </div>
//   );
// }


import {
  CreditCard,
  ExternalLink,
  Mail,
  Trash2,
  Users,
} from 'lucide-react';

import PageHeader from '../../shared/ui/PageHeader.jsx';
import KpiCard from '../../shared/ui/KpiCard.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';

export default function CardsTab({
  contacts = [],
  registrations = [],
  onResendInvitation,
  onDeleteRegistration,
  onAddPerson,
}) {
  const complimentary = registrations.filter(
    (item) => item.payment_mode === 'Complimentary'
  );

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <PageHeader
        title="Invitation Cards"
        subtitle="Add an interested person, then send a demo payment link and invitation card."
        action={
          <button
            onClick={onAddPerson}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-amber-500
              px-4
              py-2
              text-xs
              font-bold
              text-slate-950
              transition
              hover:bg-amber-400
              active:scale-95
            "
          >
            <Users className="h-4 w-4" />
            Add person &amp; send card
          </button>
        }
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

        <KpiCard
          title="Interested people"
          value={contacts.length}
          color="border-slate-500"
          icon={Users}
        />

        <KpiCard
          title="Cards created"
          value={registrations.length}
          color="border-emerald-500"
          icon={CreditCard}
        />

        <KpiCard
          title="Email invitations"
          value={complimentary.length}
          color="border-blue-500"
          icon={Mail}
        />

        <KpiCard
          title="Payment required"
          value="Disabled"
          color="border-amber-500"
          icon={CreditCard}
        />

      </div>

      {/* ISSUED CARDS */}
      <Card className="overflow-hidden">

        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-sm font-bold text-slate-900">
            Issued cards
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            View, resend or delete generated invitation cards.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-sm">

            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">

              <tr>
                <th className="px-5 py-3 text-left">
                  Person
                </th>

                <th className="px-5 py-3 text-left">
                  Mobile
                </th>

                <th className="px-5 py-3 text-left">
                  Token
                </th>

                <th className="px-5 py-3 text-left">
                  Card
                </th>

                <th className="px-5 py-3 text-left">
                  Payment
                </th>

                <th className="px-5 py-3 text-left">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {registrations.map((item) => (

                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* PERSON */}
                  <td className="px-5 py-4">

                    <p className="font-semibold text-slate-900">
                      {item.registered_name ||
                        item.contact_name ||
                        'Unknown'}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.email || 'No email'}
                    </p>

                  </td>

                  {/* MOBILE */}
                  <td className="px-5 py-4 text-xs text-slate-600">
                    {item.mobile || '—'}
                  </td>

                  {/* TOKEN */}
                  <td className="px-5 py-4 font-mono font-bold text-amber-700">
                    {item.token_number || '—'}
                  </td>

                  {/* CARD */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">

                      <Badge
                        label={item.card_type || 'Entry Card'}
                        variant="success"
                      />

                      {item.card_number && (
                        <p className="text-[11px] text-slate-500">
                          {item.card_number}
                        </p>
                      )}

                    </div>
                  </td>

                  {/* PAYMENT */}
                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        ${
                          item.payment_mode === 'Complimentary'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.payment_status === 'Paid'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                        }
                      `}
                    >
                      {item.payment_mode === 'Complimentary'
                        ? 'Complimentary'
                        : item.payment_status || item.payment_mode || 'Pending'}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">

                    <div className="flex flex-wrap items-center gap-3">

                      {/* OPEN CARD */}
                      <a
                        href={`/invitation/${encodeURIComponent(
                          item.token_number
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-1
                          text-xs
                          font-bold
                          text-emerald-700
                          hover:underline
                        "
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open card
                      </a>

                      {/* RESEND EMAIL */}
                      <button
                        type="button"
                        onClick={() =>
                          onResendInvitation?.(item.id)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1
                          text-xs
                          font-bold
                          text-blue-700
                          hover:underline
                        "
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Resend
                      </button>

                      {/* DELETE CARD */}
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteRegistration?.(item.id)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-lg
                          px-2
                          py-1
                          text-xs
                          font-bold
                          text-red-600
                          transition
                          hover:bg-red-50
                          hover:text-red-700
                        "
                        title="Delete invitation card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {/* EMPTY STATE */}
              {!registrations.length && (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      px-5
                      py-14
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >

                    <div className="flex flex-col items-center">

                      <CreditCard className="mb-3 h-10 w-10 text-slate-300" />

                      <p className="font-medium text-slate-600">
                        No invitation cards created yet.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add an interested person to create their
                        first invitation card.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  );
}
