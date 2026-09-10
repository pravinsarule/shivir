// import { useState, useEffect, useCallback } from 'react';
// import Swal from 'sweetalert2';
// import { API_BASE, EMPTY_CONTACT, EMPTY_BOOKING, EMPTY_CARD } from '../config.js';

// export function formatTime(secs) {
//   const m = Math.floor(secs / 60);
//   const s = secs % 60;
//   return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
// }

// export default function useParamMitraDashboard(user) {
//   const userId = user?.id || 1;

//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [contacts, setContacts] = useState([]);
//   const [contactSearch, setContactSearch] = useState('');
//   const [contactCategory, setContactCategory] = useState('All');
//   const [showAddContactModal, setShowAddContactModal] = useState(false);
//   const [newContact, setNewContact] = useState(EMPTY_CONTACT);

//   const [bookingStep, setBookingStep] = useState(1);
//   const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING);
//   const [holdInfo, setHoldInfo] = useState(null);
//   const [holdSecondsLeft, setHoldSecondsLeft] = useState(900);

//   const [followups, setFollowups] = useState([]);
//   const [showAddFollowupModal, setShowAddFollowupModal] = useState(false);

//   const [showCardModal, setShowCardModal] = useState(false);
//   const [cardForm, setCardForm] = useState(EMPTY_CARD);
//   const [payments, setPayments] = useState([]);
//   const [registrations, setRegistrations] = useState([]);
//   const [verifySearch, setVerifySearch] = useState('');
//   const [verifyResults, setVerifyResults] = useState([]);

//   const fetchDashboard = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/dashboard?paramMitraId=${userId}`);
//       const data = await res.json();
//       if (data.success) setDashboardData(data.dashboard);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   const fetchContacts = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/contacts?category=${contactCategory}&search=${contactSearch}`);
//       const data = await res.json();
//       if (data.success) setContacts(data.contacts);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [contactCategory, contactSearch]);

//   const fetchFollowups = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/followups?paramMitraId=${userId}`);
//       const data = await res.json();
//       if (data.success) setFollowups(data.followups);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [userId]);

//   const fetchPayments = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/payments/payment-links?paramMitraId=${userId}`);
//       const data = await res.json();
//       if (data.success) setPayments(data.payments);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [userId]);

//   const fetchRegistrations = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/registrations?paramMitraId=${userId}`);
//       const data = await res.json();
//       if (data.success) setRegistrations(data.registrations);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchDashboard();
//     fetchContacts();
//     fetchFollowups();
//     fetchPayments();
//     fetchRegistrations();
//   }, [fetchDashboard, fetchContacts, fetchFollowups, fetchPayments, fetchRegistrations]);

//   useEffect(() => {
//     fetchContacts();
//   }, [fetchContacts]);

//   useEffect(() => {
//     let timer;
//     if (bookingStep === 3 && holdSecondsLeft > 0) {
//       timer = setInterval(() => {
//         setHoldSecondsLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             Swal.fire('Hold Expired!', '15-Minute Soft Hold expired. All resources released.', 'warning');
//             setBookingStep(1);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [bookingStep, holdSecondsLeft]);

//   const handleAddContactSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/contacts`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...newContact, sourced_by_id: userId }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setContacts(prev => [data.contact, ...prev]);
//         setShowAddContactModal(false);
//         setNewContact(EMPTY_CONTACT);
//         fetchRegistrations();
//         Swal.fire({ icon: data.emailSent === false ? 'warning' : 'success', title: data.emailSent === false ? 'Card Created — Email Not Sent' : 'Invitation Card Sent!', html: data.registration ? `<p>${data.contact.name}'s token is <strong>${data.registration.token_number}</strong>.</p><p>${data.emailSent === false ? 'SMTP delivery failed. Configure SMTP, then resend the card from the Cards tab.' : `The invitation card was sent to ${data.contact.email}.`}</p>` : `${data.contact.name} added to foundation database.`, confirmButtonColor: '#f59e0b' });
//       } else {
//         Swal.fire({ icon: 'error', title: 'Error', text: data.message });
//       }
//     } catch {
//       Swal.fire('Error', 'Server error saving contact.', 'error');
//     }
//   };

//   const handleCheckAvailabilityAndHold = async () => {
//     if (!bookingForm.contact_id) {
//       Swal.fire('Select Contact', 'Please select a contact for the demo session.', 'info');
//       return;
//     }
//     try {
//       const availRes = await fetch(`${API_BASE}/availability/check`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bookingForm),
//       });
//       const availData = await availRes.json();
//       if (!availData.available) {
//         Swal.fire({ icon: 'error', title: 'Resource Conflict', text: availData.reason });
//         return;
//       }

//       const holdRes = await fetch(`${API_BASE}/bookings/hold`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...bookingForm, param_mitra_id: userId }),
//       });
//       const holdData = await holdRes.json();
//       if (holdData.success) {
//         setHoldInfo(holdData);
//         setHoldSecondsLeft(900);
//         setBookingStep(3);
//       }
//     } catch {
//       Swal.fire('Error', 'Unable to check availability.', 'error');
//     }
//   };

//   const handleConfirmBooking = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/bookings/confirm`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: holdInfo?.session?.id }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBookingStep(4);
//         fetchDashboard();
//         Swal.fire({ icon: 'success', title: 'Demo Booking Confirmed!', text: 'Free Demo Workshop is booked!', confirmButtonColor: '#f59e0b' });
//       }
//     } catch {
//       Swal.fire('Error', 'Failed to confirm booking.', 'error');
//     }
//   };

//   const handleCreatePaymentLink = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/payments/payment-links`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...cardForm, param_mitra_id: userId }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setShowCardModal(false);
//         setCardForm(EMPTY_CARD);
//         fetchDashboard();
//         fetchPayments();
//         Swal.fire({
//           icon: 'success',
//           title: 'Payment Link Sent!',
//           html: `<p>₹${Number(data.payment.amount).toFixed(2)} payment link has been sent.</p><p class="text-sm">The invitation card is sent automatically after payment.</p>`,
//           confirmButtonColor: '#f59e0b',
//         });
//       } else {
//         Swal.fire('Unable to send link', data.message || 'Please check the contact email and Easebuzz configuration.', 'error');
//       }
//     } catch {
//       Swal.fire('Error', 'Failed to create payment link.', 'error');
//     }
//   };

//   const handleVerifySearch = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/registrations/verify?search=${verifySearch}`);
//       const data = await res.json();
//       if (data.success) setVerifyResults(data.registrations);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleResendInvitation = async (registrationId) => {
//     try {
//       const res = await fetch(`${API_BASE}/registrations/${registrationId}/send-invitation`, { method: 'POST' });
//       const data = await res.json();
//       Swal.fire(data.success ? 'Invitation Sent' : 'Unable to Send', data.message, data.success ? 'success' : 'error');
//     } catch {
//       Swal.fire('Unable to Send', 'The server could not send the invitation email.', 'error');
//     }
//   };

//   const startDemoBooking = (contactId) => {
//     setBookingForm(prev => ({ ...prev, contact_id: contactId || '' }));
//     setActiveTab('demo');
//     setBookingStep(1);
//   };

//   const openIssueCard = (contact) => {
//     setCardForm(prev => ({
//       ...prev,
//       contact_id: contact?.id || '',
//       registered_name: contact?.name || '',
//     }));
//     setShowCardModal(true);
//   };

//   return {
//     activeTab, setActiveTab,
//     dashboardData, loading,
//     contacts, contactSearch, setContactSearch, contactCategory, setContactCategory,
//     showAddContactModal, setShowAddContactModal, newContact, setNewContact,
//     bookingStep, setBookingStep, bookingForm, setBookingForm,
//     holdSecondsLeft, followups, showAddFollowupModal, setShowAddFollowupModal,
//     showCardModal, setShowCardModal, cardForm, setCardForm,
//     payments, fetchPayments, registrations, fetchRegistrations,
//     verifySearch, setVerifySearch, verifyResults,
//     handleAddContactSubmit, handleCheckAvailabilityAndHold, handleConfirmBooking,
//     handleCreatePaymentLink, handleVerifySearch, handleResendInvitation,
//     startDemoBooking, openIssueCard,
//   };
// }


import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { API_BASE, EMPTY_CONTACT, EMPTY_BOOKING, EMPTY_CARD } from '../config.js';

export function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function useParamMitraDashboard(user) {
  const userId = user?.id || 1;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [contactCategory, setContactCategory] = useState('All');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState(EMPTY_CONTACT);

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING);
  const [holdInfo, setHoldInfo] = useState(null);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(900);

  const [followups, setFollowups] = useState([]);
  const [showAddFollowupModal, setShowAddFollowupModal] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState(EMPTY_CARD);
  const [payments, setPayments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [verifySearch, setVerifySearch] = useState('');
  const [verifyResults, setVerifyResults] = useState([]);

  /**
   * Fetch dashboard data
   */
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/dashboard?paramMitraId=${userId}`
      );

      const data = await res.json();

      if (data.success) {
        setDashboardData(data.dashboard);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetch contacts
   */
  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/contacts?category=${encodeURIComponent(
          contactCategory
        )}&search=${encodeURIComponent(contactSearch)}`
      );

      const data = await res.json();

      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error('Contacts fetch error:', err);
    }
  }, [contactCategory, contactSearch]);

  /**
   * Fetch follow-ups
   */
  const fetchFollowups = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/followups?paramMitraId=${userId}`
      );

      const data = await res.json();

      if (data.success) {
        setFollowups(data.followups);
      }
    } catch (err) {
      console.error('Followups fetch error:', err);
    }
  }, [userId]);

  /**
   * Fetch payments
   */
  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/payments/payment-links?paramMitraId=${userId}`
      );

      const data = await res.json();

      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Payments fetch error:', err);
    }
  }, [userId]);

  /**
   * Fetch registrations / generated cards
   */
  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/registrations?paramMitraId=${userId}`
      );

      const data = await res.json();

      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Registrations fetch error:', err);
    }
  }, [userId]);

  /**
   * Initial data loading
   */
  useEffect(() => {
    fetchDashboard();
    fetchContacts();
    fetchFollowups();
    fetchPayments();
    fetchRegistrations();
  }, [
    fetchDashboard,
    fetchContacts,
    fetchFollowups,
    fetchPayments,
    fetchRegistrations,
  ]);

  /**
   * Refresh contacts when search/category changes
   */
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /**
   * 15-minute booking hold timer
   */
  useEffect(() => {
    let timer;

    if (bookingStep === 3 && holdSecondsLeft > 0) {
      timer = setInterval(() => {
        setHoldSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);

            Swal.fire(
              'Hold Expired!',
              '15-Minute Soft Hold expired. All resources released.',
              'warning'
            );

            setBookingStep(1);

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [bookingStep, holdSecondsLeft]);

  /**
   * Add contact
   */
  const handleAddContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newContact,
          sourced_by_id: userId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setContacts((prev) => [data.contact, ...prev]);

        setShowAddContactModal(false);
        setNewContact(EMPTY_CONTACT);

        await fetchRegistrations();
        await fetchDashboard();

        Swal.fire({
          icon: data.emailSent === false ? 'warning' : 'success',
          title:
            data.emailSent === false
              ? 'Card Created — Email Not Sent'
              : 'Invitation Card Sent!',
          html: data.registration
            ? `
              <p>
                ${data.contact.name}'s token is
                <strong>${data.registration.token_number}</strong>.
              </p>
              <p>
                ${
                  data.emailSent === false
                    ? 'SMTP delivery failed. Configure SMTP, then resend the card from the Cards tab.'
                    : `The invitation card was sent to ${data.contact.email}.`
                }
              </p>
            `
            : `${data.contact.name} added to foundation database.`,
          confirmButtonColor: '#f59e0b',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
        });
      }
    } catch (error) {
      console.error('Add contact error:', error);

      Swal.fire(
        'Error',
        'Server error saving contact.',
        'error'
      );
    }
  };

  /**
   * Check availability and create booking hold
   */
  const handleCheckAvailabilityAndHold = async () => {
    if (!bookingForm.contact_id) {
      Swal.fire(
        'Select Contact',
        'Please select a contact for the demo session.',
        'info'
      );

      return;
    }

    try {
      const availRes = await fetch(
        `${API_BASE}/availability/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingForm),
        }
      );

      const availData = await availRes.json();

      if (!availData.available) {
        Swal.fire({
          icon: 'error',
          title: 'Resource Conflict',
          text: availData.reason,
        });

        return;
      }

      const holdRes = await fetch(
        `${API_BASE}/bookings/hold`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...bookingForm,
            param_mitra_id: userId,
          }),
        }
      );

      const holdData = await holdRes.json();

      if (holdData.success) {
        setHoldInfo(holdData);
        setHoldSecondsLeft(900);
        setBookingStep(3);
      }
    } catch (error) {
      console.error('Availability error:', error);

      Swal.fire(
        'Error',
        'Unable to check availability.',
        'error'
      );
    }
  };

  /**
   * Confirm booking
   */
  const handleConfirmBooking = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/bookings/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: holdInfo?.session?.id,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setBookingStep(4);

        await fetchDashboard();

        Swal.fire({
          icon: 'success',
          title: 'Demo Booking Confirmed!',
          text: 'Free Demo Workshop is booked!',
          confirmButtonColor: '#f59e0b',
        });
      }
    } catch (error) {
      console.error('Confirm booking error:', error);

      Swal.fire(
        'Error',
        'Failed to confirm booking.',
        'error'
      );
    }
  };

  /**
   * Create Easebuzz payment link
   */
  const handleCreatePaymentLink = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_BASE}/payments/payment-links`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cardForm,
            param_mitra_id: userId,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setShowCardModal(false);
        setCardForm(EMPTY_CARD);

        await fetchDashboard();
        await fetchPayments();

        Swal.fire({
          icon: 'success',
          title: 'Payment Link Sent!',
          html: `
            <p>
              ₹${Number(data.payment.amount).toFixed(2)}
              payment link has been sent.
            </p>
            <p>
              The invitation card is sent automatically after payment.
            </p>
          `,
          confirmButtonColor: '#f59e0b',
        });
      } else {
        Swal.fire(
          'Unable to send link',
          data.message ||
            'Please check the contact email and Easebuzz configuration.',
          'error'
        );
      }
    } catch (error) {
      console.error('Create payment link error:', error);

      Swal.fire(
        'Error',
        'Failed to create payment link.',
        'error'
      );
    }
  };

  /**
   * Verify registration
   */
  const handleVerifySearch = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_BASE}/registrations/verify?search=${encodeURIComponent(
          verifySearch
        )}`
      );

      const data = await res.json();

      if (data.success) {
        setVerifyResults(data.registrations);
      } else {
        setVerifyResults([]);
      }
    } catch (err) {
      console.error('Verify registration error:', err);
    }
  };

  /**
   * Resend invitation card email
   */
  const handleResendInvitation = async (registrationId) => {
    try {
      const res = await fetch(
        `${API_BASE}/registrations/${registrationId}/send-invitation`,
        {
          method: 'POST',
        }
      );

      const data = await res.json();

      Swal.fire(
        data.success ? 'Invitation Sent' : 'Unable to Send',
        data.message,
        data.success ? 'success' : 'error'
      );
    } catch (error) {
      console.error('Resend invitation error:', error);

      Swal.fire(
        'Unable to Send',
        'The server could not send the invitation email.',
        'error'
      );
    }
  };

  /**
   * DELETE GENERATED INVITATION CARD
   *
   * Calls:
   * DELETE /registrations/:registrationId
   *
   * Backend deletes the registration/card and restores
   * the card-book balance.
   */
  const handleDeleteRegistration = async (registrationId) => {
    const registration = registrations.find(
      (item) => item.id === registrationId
    );

    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Delete Invitation Card?',
      html: `
        <p>
          This will permanently delete the generated invitation card.
        </p>

        ${
          registration
            ? `
              <p>
                <strong>Person:</strong>
                ${registration.registered_name || registration.contact_name || 'N/A'}
              </p>

              <p>
                <strong>Token:</strong>
                ${registration.token_number || 'N/A'}
              </p>

              <p>
                <strong>Card:</strong>
                ${registration.card_number || 'N/A'}
              </p>
            `
            : ''
        }

        <p style="color:#dc2626;font-size:13px;margin-top:15px;">
          This action cannot be undone.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Card',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title: 'Deleting Card...',
        text: 'Please wait while the invitation card is deleted.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch(
        `${API_BASE}/registrations/${registrationId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to delete invitation card.'
        );
      }

      /**
       * Refresh all affected data.
       */
      await Promise.all([
        fetchRegistrations(),
        fetchDashboard(),
        fetchPayments(),
      ]);

      Swal.fire({
        icon: 'success',
        title: 'Card Deleted',
        text:
          data.message ||
          'Invitation card deleted successfully.',
        confirmButtonColor: '#f59e0b',
      });
    } catch (error) {
      console.error(
        'Delete registration/card error:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Unable to Delete Card',
        text:
          error.message ||
          'The server could not delete the invitation card.',
        confirmButtonColor: '#f59e0b',
      });
    }
  };

  /**
   * Start demo booking for a contact
   */
  const startDemoBooking = (contactId) => {
    setBookingForm((prev) => ({
      ...prev,
      contact_id: contactId || '',
    }));

    setActiveTab('demo');
    setBookingStep(1);
  };

  /**
   * Open issue-card/payment modal
   */
  const openIssueCard = (contact) => {
    setCardForm((prev) => ({
      ...prev,
      contact_id: contact?.id || '',
      registered_name: contact?.name || '',
    }));

    setShowCardModal(true);
  };

  return {
    activeTab,
    setActiveTab,

    dashboardData,
    loading,

    contacts,
    contactSearch,
    setContactSearch,
    contactCategory,
    setContactCategory,

    showAddContactModal,
    setShowAddContactModal,

    newContact,
    setNewContact,

    bookingStep,
    setBookingStep,

    bookingForm,
    setBookingForm,

    holdSecondsLeft,

    followups,

    showAddFollowupModal,
    setShowAddFollowupModal,

    showCardModal,
    setShowCardModal,

    cardForm,
    setCardForm,

    payments,
    fetchPayments,

    registrations,
    fetchRegistrations,

    verifySearch,
    setVerifySearch,

    verifyResults,

    handleAddContactSubmit,
    handleCheckAvailabilityAndHold,
    handleConfirmBooking,
    handleCreatePaymentLink,
    handleVerifySearch,
    handleResendInvitation,
    handleDeleteRegistration,

    startDemoBooking,
    openIssueCard,
  };
}
