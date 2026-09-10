import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardShell from '../shared/layout/DashboardShell.jsx';
import useVidyaMandirDashboard from './hooks/useVidyaMandirDashboard.js';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import DispatchDetailModal from './components/DispatchDetailModal.jsx';
import ChallanModal from './components/ChallanModal.jsx';
import LedgerTimelineModal from './components/LedgerTimelineModal.jsx';
import AddPersonModal from './components/AddPersonModal.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DispatchPage from './pages/DispatchPage.jsx';
import StockPage from './pages/StockPage.jsx';
import TravelPage from './pages/TravelPage.jsx';
import AccountingPage from './pages/AccountingPage.jsx';
import MastersPage from './pages/MastersPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import PeoplePage from './pages/PeoplePage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function VidyaMandirDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const vm = useVidyaMandirDashboard();

  const navigate = (tab) => {
    vm.navigate(tab);
    setMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) setMobileSidebarOpen(o => !o);
    else setSidebarOpen(o => !o);
  };

  const renderPage = () => {
    switch (vm.activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            stockError={vm.stockError}
            onDismissError={() => vm.setStockError('')}
            dispatches={vm.dispatches}
            onNavigate={navigate}
            onSelectDispatch={vm.setSelectedDispatch}
          />
        );
      case 'dispatch':
        return (
          <DispatchPage
            dispatches={vm.dispatches}
            onSelectDispatch={vm.setSelectedDispatch}
            onShowChallan={vm.setShowChallan}
          />
        );
      case 'stock':
        return <StockPage stockList={vm.stockList} onViewLedger={vm.setLedgerItem} />;
      case 'travel':
        return <TravelPage travels={vm.travels} />;
      case 'accounting':
        return <AccountingPage />;
      case 'masters':
        return <MastersPage />;
      case 'people':
        return (
          <PeoplePage
            people={vm.people}
            personFilterRole={vm.personFilterRole}
            personSearch={vm.personSearch}
            onFilterRoleChange={vm.setPersonFilterRole}
            onSearchChange={vm.setPersonSearch}
            onAddPerson={() => vm.setShowAddPersonModal(true)}
          />
        );
      case 'reports':
        return <ReportsPage />;
      case 'transfers':
        return <PlaceholderPage title="Transfers Management" />;
      case 'returns':
        return <PlaceholderPage title="Returns Management" />;
      case 'reimburse':
        return <PlaceholderPage title="Reimbursements" />;
      case 'settlement':
        return <PlaceholderPage title="Settlements" />;
      case 'events':
        return <PlaceholderPage title="Events Management" />;
      case 'archive':
        return <PlaceholderPage title="Archive & History" />;
      case 'settings':
        return <PlaceholderPage title="Settings" />;
      default:
        return (
          <DashboardPage
            stockError={vm.stockError}
            onDismissError={() => vm.setStockError('')}
            dispatches={vm.dispatches}
            onNavigate={navigate}
            onSelectDispatch={vm.setSelectedDispatch}
          />
        );
    }
  };

  const sidebarProps = {
    activeTab: vm.activeTab,
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
        bottomNav={<BottomNav activeTab={vm.activeTab} onNavigate={navigate} />}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
      >
        {renderPage()}
      </DashboardShell>

      <DispatchDetailModal
        dispatch={vm.selectedDispatch}
        onClose={() => vm.setSelectedDispatch(null)}
        onUpdate={vm.setSelectedDispatch}
        onPack={vm.handlePack}
        onShip={vm.handleShip}
        onShowChallan={vm.setShowChallan}
      />

      <ChallanModal challan={vm.showChallan} onClose={() => vm.setShowChallan(null)} />

      <LedgerTimelineModal item={vm.ledgerItem} onClose={() => vm.setLedgerItem(null)} />

      <AddPersonModal
        open={vm.showAddPersonModal}
        person={vm.newPerson}
        onChange={vm.setNewPerson}
        onClose={() => vm.setShowAddPersonModal(false)}
        onSubmit={vm.handleAddPerson}
      />
    </>
  );
}
