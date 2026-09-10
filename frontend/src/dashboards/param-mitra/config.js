export const API_BASE = 'https://backend-729310986605.asia-south1.run.app/api/param-mitra';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'contacts', label: 'Contacts Directory', icon: 'Users' },
  { id: 'demo', label: 'Book Demo Workshop', icon: 'Calendar' },
  { id: 'followups', label: 'Follow-up Center', icon: 'Clock' },
  { id: 'cards', label: 'My Cards & Inventory', icon: 'CreditCard' },
  { id: 'shivir', label: 'Shivir Verification', icon: 'ShieldCheck' },
  { id: 'duties', label: 'Duties & Responsibilities', icon: 'CheckSquare' },
  { id: 'meals', label: 'My Meal Plan', icon: 'Utensils' },
];

export const MOBILE_NAV = [
  { id: 'dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { id: 'contacts', label: 'Contacts', icon: 'Users' },
  { id: 'demo', label: 'Demo', icon: 'Calendar' },
  { id: 'followups', label: 'Followups', icon: 'Clock' },
  { id: 'cards', label: 'Cards', icon: 'CreditCard' },
];

export const EMPTY_CONTACT = {
  name: '', mobile: '', email: '', area: 'Delhi', category: 'Warm',
  designation: '', samaj: '', social_group: '', relationship_note: '',
};

export const EMPTY_BOOKING = {
  contact_id: '', session_type: 'Standard 45-Min Demo',
  session_date: new Date().toISOString().slice(0, 10),
  start_time: '10:00', end_time: '11:00', expected_crowd: 50,
  location: 'Community Center, colony road', area_type: 'Across Delhi',
  travel_buffer_minutes: 90, requires_reiki: false, requires_vehicle_4w: false,
};

export const EMPTY_CARD = {
  contact_id: '', card_type: 'Entry Card', card_number: '',
  amount: 500, registered_name: '',
};
