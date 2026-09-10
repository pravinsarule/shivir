export default function DashboardShell({
  header,
  sidebar,
  bottomNav,
  mobileSidebarOpen,
  onCloseMobileSidebar,
  children,
}) {
  return (
    <div
      className="h-screen overflow-hidden bg-slate-50 flex flex-col text-slate-800"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {header}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {sidebar.desktop}

        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onCloseMobileSidebar}
            />
            <div className="fixed left-0 top-14 bottom-0 w-64 bg-slate-900 z-50 md:hidden overflow-y-auto">
              {sidebar.mobile}
            </div>
          </>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {bottomNav}
    </div>
  );
}
