import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardShell from '../shared/layout/DashboardShell.jsx';
import useParamMitraDashboard from './hooks/useParamMitraDashboard.js';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import AddContactModal from './components/AddContactModal.jsx';
import IssueCardModal from './components/IssueCardModal.jsx';
import DashboardTab from './tabs/DashboardTab.jsx';
import ContactsTab from './tabs/ContactsTab.jsx';
import InterestedPeopleTab from './tabs/InterestedPeopleTab.jsx';
import DemoTab from './tabs/DemoTab.jsx';
import FollowupsTab from './tabs/FollowupsTab.jsx';
import CardsTab from './tabs/CardsTab.jsx';
import ShivirTab from './tabs/ShivirTab.jsx';
import PlaceholderTab from './tabs/PlaceholderTab.jsx';

export default function ParamMitraDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const dash = useParamMitraDashboard(user);

  const navigate = (tab) => {
    dash.setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) setMobileSidebarOpen(o => !o);
    else setSidebarOpen(o => !o);
  };

  const renderTab = () => {
    switch (dash.activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            dashboardData={dash.dashboardData}
            onAddContact={() => dash.setShowAddContactModal(true)}
            onCreateDemo={() => { navigate('demo'); dash.setBookingStep(1); }}
            onNavigate={navigate}
          />
        );
        case 'contacts':
          return (
            <ContactsTab
              contacts={dash.contacts}
              contactCategory={dash.contactCategory}
              contactSearch={dash.contactSearch}
              onCategoryChange={dash.setContactCategory}
              onSearchChange={dash.setContactSearch}
              onAddContact={() => dash.setShowAddContactModal(true)}
            />
          );
      case 'demo':
        return (
          <DemoTab
            bookingStep={dash.bookingStep}
            setBookingStep={dash.setBookingStep}
            bookingForm={dash.bookingForm}
            setBookingForm={dash.setBookingForm}
            contacts={dash.contacts}
            holdSecondsLeft={dash.holdSecondsLeft}
            onCheckAvailability={dash.handleCheckAvailabilityAndHold}
            onConfirmBooking={dash.handleConfirmBooking}
            onReturnDashboard={() => { navigate('dashboard'); dash.setBookingStep(1); }}
          />
        );
      case 'followups':
        return (
          <FollowupsTab
            followups={dash.followups}
            onAddFollowup={() => dash.setShowAddFollowupModal(true)}
          />
        );
      case 'cards':
        return <CardsTab contacts={dash.contacts} registrations={dash.registrations} onResendInvitation={dash.handleResendInvitation} onAddPerson={() => dash.setShowAddContactModal(true)} />;
      case 'shivir':
        return (
          <ShivirTab
            verifySearch={dash.verifySearch}
            verifyResults={dash.verifyResults}
            onSearchChange={dash.setVerifySearch}
            onVerify={dash.handleVerifySearch}
          />
        );
      case 'duties':
      case 'meals':
        return <PlaceholderTab />;
      default:
        return null;
    }
  };

  const sidebarProps = {
    collapsed: !sidebarOpen,
    activeTab: dash.activeTab,
    onNavigate: navigate,
    user,
    onLogout: logout,
    onExpand: () => setSidebarOpen(true),
    onCollapse: () => setSidebarOpen(false),
  };

  return (
    <>
      <DashboardShell
        header={<TopHeader user={user} onToggleSidebar={toggleSidebar} onLogout={logout} />}
        sidebar={{
          desktop: (
            <aside className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 transition-all duration-200 h-full overflow-hidden ${sidebarOpen ? 'w-72' : 'w-[60px]'}`}>
              <Sidebar {...sidebarProps} collapsed={!sidebarOpen} />
            </aside>
          ),
          mobile: <Sidebar {...sidebarProps} collapsed={false} />,
        }}
        bottomNav={<BottomNav activeTab={dash.activeTab} onNavigate={navigate} />}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
      >
        {renderTab()}
      </DashboardShell>

      <AddContactModal
        open={dash.showAddContactModal}
        contact={dash.newContact}
        onChange={dash.setNewContact}
        onClose={() => dash.setShowAddContactModal(false)}
        onSubmit={dash.handleAddContactSubmit}
      />

      <IssueCardModal
        open={dash.showCardModal}
        cardForm={dash.cardForm}
        contacts={dash.contacts}
        onChange={dash.setCardForm}
        onClose={() => dash.setShowCardModal(false)}
        onSubmit={dash.handleCreatePaymentLink}
      />
    </>
  );
}
