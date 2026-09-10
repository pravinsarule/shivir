import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  API_PEOPLE, DISPATCHES_INIT, STOCK_INIT, TRAVELS_INIT,
  PEOPLE_INIT, EMPTY_PERSON,
} from '../constants.js';

export default function useVidyaMandirDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stockError, setStockError] = useState('');

  const [dispatches, setDispatches] = useState(DISPATCHES_INIT);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [showChallan, setShowChallan] = useState(null);

  const [stockList, setStockList] = useState(STOCK_INIT);
  const [ledgerItem, setLedgerItem] = useState(null);

  const [travels] = useState(TRAVELS_INIT);

  const [people, setPeople] = useState(PEOPLE_INIT);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [personFilterRole, setPersonFilterRole] = useState('All');
  const [personSearch, setPersonSearch] = useState('');
  const [newPerson, setNewPerson] = useState(EMPTY_PERSON);

  const navigate = useCallback((id) => setActiveTab(id), []);

  const handlePack = (id) => {
    setDispatches(prev => prev.map(d => {
      if (d.id !== id) return d;
      if (d.reqStatus !== 'Finalised') {
        alert('Business Rule: Cannot pack until Event Head marks requirement as Finalised!');
        return d;
      }
      return { ...d, packingStatus: 'Completed' };
    }));
  };

  const handleShip = (disp) => {
    for (const item of disp.items) {
      const s = stockList.find(x => x.name === item.name);
      if (s && s.currentBalance - (item.sent || item.req) < 0) {
        setStockError(`Dispatch BLOCKED: "${item.name}" current stock (${s.currentBalance}) < required (${item.sent || item.req}). Stock cannot go negative.`);
        return;
      }
    }
    setStockError('');
    setDispatches(prev => prev.map(d => d.id === disp.id ? { ...d, deliveryStatus: 'In Transit' } : d));
    disp.items.forEach(item => {
      const qty = item.sent || item.req;
      setStockList(prev => prev.map(s => s.name !== item.name ? s : {
        ...s,
        dispatched: s.dispatched + qty,
        currentBalance: s.currentBalance - qty,
        timeline: [...s.timeline, { date: new Date().toISOString().slice(0, 10), type: 'Dispatch', qty: -qty, note: `Shipped to ${disp.event}` }],
      }));
    });
    setSelectedDispatch(null);
  };

  const fetchPeople = useCallback(async () => {
    try {
      const res = await fetch(API_PEOPLE);
      const data = await res.json();
      if (data.success && data.people?.length > 0) setPeople(data.people);
    } catch (err) {
      console.warn('Backend API connection pending, using local state:', err.message);
    }
  }, []);

  useEffect(() => { fetchPeople(); }, [fetchPeople]);

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.email) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const res = await fetch(API_PEOPLE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson),
      });
      const data = await res.json();

      if (data.success && data.person) {
        setPeople(prev => [data.person, ...prev]);
        setShowAddPersonModal(false);
        setNewPerson(EMPTY_PERSON);
        Swal.fire({
          icon: 'success',
          title: 'Person Added & Email Sent!',
          html: `
            <div style="text-align: left; font-size: 13px; color: #334155; line-height: 1.6;">
              <p><strong>Name:</strong> ${data.person.name}</p>
              <p><strong>Role:</strong> <span style="color: #7c3aed; font-weight: bold;">${data.person.role}</span></p>
              <p><strong>City:</strong> ${data.person.city}</p>
              <hr style="margin: 12px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="color: #059669; font-weight: 600;">📧 Setup email dispatched to ${data.person.email}</p>
              <p style="margin-top: 10px; font-size: 11px; color: #64748b; word-break: break-all; background: #f8fafc; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <strong>Password Link:</strong><br />
                <a href="${data.setupLink}" target="_blank" style="color: #2563eb;">${data.setupLink}</a>
              </p>
            </div>
          `,
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'Great, Done!',
          customClass: { popup: 'rounded-2xl shadow-2xl' },
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Failed to Create', text: data.message || 'Unable to add person.', confirmButtonColor: '#ef4444' });
      }
    } catch (err) {
      console.error('Error creating person:', err);
      const created = {
        id: `P-${100 + people.length + 1}`,
        ...newPerson,
        phone: newPerson.phone || '+91 9800000000',
        status: 'Active',
      };
      setPeople(prev => [created, ...prev]);
      setShowAddPersonModal(false);
      setNewPerson(EMPTY_PERSON);
    }
  };

  return {
    activeTab, navigate,
    stockError, setStockError,
    dispatches, selectedDispatch, setSelectedDispatch,
    showChallan, setShowChallan,
    stockList, ledgerItem, setLedgerItem,
    travels,
    people, showAddPersonModal, setShowAddPersonModal,
    personFilterRole, setPersonFilterRole,
    personSearch, setPersonSearch,
    newPerson, setNewPerson,
    handlePack, handleShip, handleAddPerson,
  };
}
