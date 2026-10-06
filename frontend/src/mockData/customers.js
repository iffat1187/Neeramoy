export const MOCK_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Hasan Mahmud',
    email: 'hasan@example.com',
    phone: '01711223344',
    status: 'Active',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Hasan+Mahmud&background=0d8275&color=fff',
    address: {
      address: 'House 42, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-1001', date: '2024-10-01', items: 3, total: 1250, paymentStatus: 'Paid', orderStatus: 'Delivered' },
      { id: 'ORD-1002', date: '2024-09-15', items: 1, total: 350, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Sadia Islam',
    email: 'sadia.islam@example.com',
    phone: '01922334455',
    status: 'Active',
    registrationDate: '2024-05-20',
    avatar: 'https://ui-avatars.com/api/?name=Sadia+Islam&background=0d8275&color=fff',
    address: {
      address: 'Flat 3B, House 12, Block C',
      city: 'Dhaka',
      area: 'Banani',
      postalCode: '1213'
    },
    orders: [
      { id: 'ORD-1010', date: '2024-10-05', items: 5, total: 3200, paymentStatus: 'Pending', orderStatus: 'Processing' }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Kamrul Hasan',
    email: 'kamrul@example.com',
    phone: '01833445566',
    status: 'Inactive',
    registrationDate: '2023-11-10',
    avatar: 'https://ui-avatars.com/api/?name=Kamrul+Hasan&background=ba1a1a&color=fff',
    address: {
      address: 'House 5, Road 2',
      city: 'Chittagong',
      area: 'Nasirabad',
      postalCode: '4000'
    },
    orders: []
  },
  {
    id: 'CUST-004',
    name: 'Nusrat Jahan',
    email: 'nusrat.j@example.com',
    phone: '01644556677',
    status: 'Active',
    registrationDate: '2024-09-01',
    avatar: 'https://ui-avatars.com/api/?name=Nusrat+Jahan&background=0d8275&color=fff',
    address: {
      address: 'House 20, Sector 4',
      city: 'Dhaka',
      area: 'Uttara',
      postalCode: '1230'
    },
    orders: [
      { id: 'ORD-1015', date: '2024-09-05', items: 2, total: 850, paymentStatus: 'Paid', orderStatus: 'Delivered' },
      { id: 'ORD-1022', date: '2024-09-20', items: 4, total: 1800, paymentStatus: 'Paid', orderStatus: 'Cancelled' },
      { id: 'ORD-1030', date: '2024-10-02', items: 1, total: 200, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
  {
    id: 'CUST-005',
    name: 'Rafiqul Islam',
    email: 'rafiqul@example.com',
    phone: '01555667788',
    status: 'Active',
    registrationDate: '2024-10-04',
    avatar: 'https://ui-avatars.com/api/?name=Rafiqul+Islam&background=0d8275&color=fff',
    address: null,
    orders: []
  }
];