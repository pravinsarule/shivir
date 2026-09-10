export const API_PEOPLE = 'https://backend-729310986605.asia-south1.run.app/api/people';

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', section: null },
  { section: 'Operations' },
  { id: 'dispatch', label: 'Dispatch', icon: 'PackageCheck' },
  { id: 'stock', label: 'Stock Ledger', icon: 'Boxes' },
  { id: 'transfers', label: 'Transfers', icon: 'ArrowRightLeft' },
  { id: 'returns', label: 'Returns', icon: 'RotateCcw' },
  { section: 'Travel & Tickets' },
  { id: 'travel', label: 'Travel', icon: 'Plane' },
  { section: 'Accounting' },
  { id: 'accounting', label: 'HO Accounting', icon: 'CircleDollarSign' },
  { id: 'reimburse', label: 'Reimbursements', icon: 'Receipt' },
  { id: 'settlement', label: 'Settlements', icon: 'Wallet' },
  { section: 'Foundation' },
  { id: 'masters', label: 'Item Masters', icon: 'Building2' },
  { id: 'people', label: 'People', icon: 'Users' },
  { id: 'events', label: 'Events', icon: 'Calendar' },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
  { section: 'Analytics' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
  { section: 'System' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

export const MOBILE_NAV = [
  { id: 'dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { id: 'dispatch', label: 'Dispatch', icon: 'PackageCheck' },
  { id: 'stock', label: 'Stock', icon: 'Boxes' },
  { id: 'travel', label: 'Travel', icon: 'Plane' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
];

export const DISPATCHES_INIT = [
  { id: 'DISP-101', event: 'Annual Shiksha Camp 2026', city: 'Delhi', type: 'Stationery & Badges', reqStatus: 'Finalised', itemCount: 4, packingStatus: 'Pending', deliveryStatus: 'Not Shipped', expectedDelivery: '2026-09-15', priority: 'High', receiver1: 'Ramesh Kumar · +91 9876543210', receiver2: 'Suresh Sharma · +91 9876543211', address: 'Community Center, Sec-12, Delhi', items: [{ name: 'Entry Cards', req: 5000, sent: 5000, stock: 3200, unit: 'Pcs', baggage: 'Bag-A' }, { name: 'Student Badges', req: 1200, sent: 1200, stock: 1500, unit: 'Pcs', baggage: 'Bag-B' }] },
  { id: 'DISP-102', event: 'Health Shibir Jamnagar', city: 'Jamnagar', type: 'Medical & Sound', reqStatus: 'Draft', itemCount: 2, packingStatus: 'Blocked', deliveryStatus: 'Pending Finalisation', expectedDelivery: '2026-09-20', priority: 'Medium', receiver1: 'Karan Patel · +91 9123456789', receiver2: 'Vijay Shah · +91 9898989898', address: 'Town Hall, Jamnagar', items: [{ name: 'Sound Systems', req: 2, sent: 2, stock: 5, unit: 'Set', baggage: 'Box-1' }] },
  { id: 'DISP-103', event: 'Udyam Craft Fair', city: 'Surat', type: 'Exhibition Banners', reqStatus: 'Finalised', itemCount: 5, packingStatus: 'Completed', deliveryStatus: 'In Transit', expectedDelivery: '2026-09-10', priority: 'Urgent', receiver1: 'Meera Ben · +91 9900990099', receiver2: 'Pooja Joshi · +91 9700970097', address: 'Shivalik Complex, Surat', items: [{ name: 'Printing Banners', req: 20, sent: 20, stock: 40, unit: 'Rolls', baggage: 'Box-A' }] },
];

export const STOCK_INIT = [
  { id: 'STK-01', name: 'Entry Cards', category: 'General Material', opening: 5000, purchases: 2000, dispatched: 3000, returned: 500, transferred: 1000, lost: 0, damaged: 0, currentBalance: 3500, expectedReturn: 800, timeline: [{ date: '2026-09-01', type: 'Opening', qty: 5000, note: 'Initial balance' }, { date: '2026-09-02', type: 'Purchase', qty: 2000, note: 'Invoice #4401' }, { date: '2026-09-04', type: 'Dispatch', qty: -3000, note: 'Delhi Event' }, { date: '2026-09-06', type: 'Returned', qty: 500, note: 'Delhi Return' }, { date: '2026-09-07', type: 'Transferred', qty: -1000, note: 'Jamnagar Transfer' }] },
  { id: 'STK-02', name: 'Shibir Foundation Books', category: 'General Material', opening: 1000, purchases: 500, dispatched: 800, returned: 100, transferred: 0, lost: 0, damaged: 0, currentBalance: 800, expectedReturn: 100, timeline: [{ date: '2026-09-01', type: 'Opening', qty: 1000, note: 'Opening Stock' }, { date: '2026-09-03', type: 'Purchase', qty: 500, note: 'Vendor Press' }] },
  { id: 'STK-03', name: 'Sound System Pro', category: 'AV Equipment', opening: 10, purchases: 0, dispatched: 6, returned: 1, transferred: 0, lost: 0, damaged: 0, currentBalance: 5, expectedReturn: 2, timeline: [{ date: '2026-09-01', type: 'Opening', qty: 10, note: 'HQ Stock' }] },
];

export const TRAVELS_INIT = [
  { id: 'TRV-801', event: 'Delhi Shiksha Camp', traveller: 'Arjun Deshmukh', direction: 'Onward', from: 'Pune', to: 'Delhi', travelDate: '2026-09-12', pnr: 'PNR89712', bookingAmount: 4500, refundAmount: 0, onwardSplit: true, status: 'Confirmed' },
  { id: 'TRV-802', event: 'Surat Craft Fair', traveller: 'Meera Joshi', direction: 'Return', from: 'Surat', to: 'Pune', travelDate: '2026-09-16', pnr: 'MISSING', bookingAmount: 1800, refundAmount: 300, onwardSplit: false, status: 'PNR Missing' },
];

export const PEOPLE_INIT = [
  { id: 'P-101', name: 'Rajesh Sharma', email: 'rajesh.sharma@shibir.org', phone: '+91 9876543210', role: 'Param Mitra', city: 'Delhi', status: 'Active' },
  { id: 'P-102', name: 'Ananya Patel', email: 'ananya.p@shibir.org', phone: '+91 9898989898', role: 'Crew', city: 'Surat', status: 'Active' },
  { id: 'P-103', name: 'Vikramaditya Rao', email: 'vikram.rao@shibir.org', phone: '+91 9123456789', role: 'Crew', city: 'Jamnagar', status: 'Active' },
  { id: 'P-104', name: 'Sanjay Verma', email: 'sanjay.v@shibir.org', phone: '+91 9765432109', role: 'Param Mitra', city: 'Delhi', status: 'Active' },
  { id: 'P-105', name: 'Priya Sundaram', email: 'priya.s@shibir.org', phone: '+91 9988776655', role: 'Field Volunteer', city: 'Pune', status: 'Active' },
];

export const EMPTY_PERSON = { name: '', email: '', phone: '', role: 'Param Mitra', city: 'Delhi' };
