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
,
{
    id: 'CUST-006',
    name: 'Test Customer 6',
    email: 'customer6@example.com',
    phone: '01711223306',
    status: 'Active',
    registrationDate: '2024-07-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+6&background=0d8275&color=fff',
    address: {
      address: 'House 6, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-206', date: '2024-10-01', items: 2, total: 560, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-007',
    name: 'Test Customer 7',
    email: 'customer7@example.com',
    phone: '01711223307',
    status: 'Active',
    registrationDate: '2024-08-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+7&background=0d8275&color=fff',
    address: {
      address: 'House 7, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-207', date: '2024-10-01', items: 2, total: 570, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-008',
    name: 'Test Customer 8',
    email: 'customer8@example.com',
    phone: '01711223308',
    status: 'Inactive',
    registrationDate: '2024-09-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+8&background=0d8275&color=fff',
    address: {
      address: 'House 8, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-208', date: '2024-10-01', items: 2, total: 580, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-009',
    name: 'Test Customer 9',
    email: 'customer9@example.com',
    phone: '01711223309',
    status: 'Active',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+9&background=0d8275&color=fff',
    address: {
      address: 'House 9, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-209', date: '2024-10-01', items: 2, total: 590, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0010',
    name: 'Test Customer 10',
    email: 'customer10@example.com',
    phone: '01711223310',
    status: 'Active',
    registrationDate: '2024-02-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+10&background=0d8275&color=fff',
    address: {
      address: 'House 10, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2010', date: '2024-10-01', items: 2, total: 600, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0011',
    name: 'Test Customer 11',
    email: 'customer11@example.com',
    phone: '01711223311',
    status: 'Active',
    registrationDate: '2024-03-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+11&background=0d8275&color=fff',
    address: {
      address: 'House 11, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2011', date: '2024-10-01', items: 2, total: 610, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0012',
    name: 'Test Customer 12',
    email: 'customer12@example.com',
    phone: '01711223312',
    status: 'Inactive',
    registrationDate: '2024-04-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+12&background=0d8275&color=fff',
    address: {
      address: 'House 12, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2012', date: '2024-10-01', items: 2, total: 620, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0013',
    name: 'Test Customer 13',
    email: 'customer13@example.com',
    phone: '01711223313',
    status: 'Active',
    registrationDate: '2024-05-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+13&background=0d8275&color=fff',
    address: {
      address: 'House 13, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2013', date: '2024-10-01', items: 2, total: 630, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0014',
    name: 'Test Customer 14',
    email: 'customer14@example.com',
    phone: '01711223314',
    status: 'Active',
    registrationDate: '2024-06-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+14&background=0d8275&color=fff',
    address: {
      address: 'House 14, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2014', date: '2024-10-01', items: 2, total: 640, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0015',
    name: 'Test Customer 15',
    email: 'customer15@example.com',
    phone: '01711223315',
    status: 'Active',
    registrationDate: '2024-07-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+15&background=0d8275&color=fff',
    address: {
      address: 'House 15, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2015', date: '2024-10-01', items: 2, total: 650, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0016',
    name: 'Test Customer 16',
    email: 'customer16@example.com',
    phone: '01711223316',
    status: 'Inactive',
    registrationDate: '2024-08-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+16&background=0d8275&color=fff',
    address: {
      address: 'House 16, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2016', date: '2024-10-01', items: 2, total: 660, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0017',
    name: 'Test Customer 17',
    email: 'customer17@example.com',
    phone: '01711223317',
    status: 'Active',
    registrationDate: '2024-09-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+17&background=0d8275&color=fff',
    address: {
      address: 'House 17, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2017', date: '2024-10-01', items: 2, total: 670, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0018',
    name: 'Test Customer 18',
    email: 'customer18@example.com',
    phone: '01711223318',
    status: 'Active',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+18&background=0d8275&color=fff',
    address: {
      address: 'House 18, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2018', date: '2024-10-01', items: 2, total: 680, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0019',
    name: 'Test Customer 19',
    email: 'customer19@example.com',
    phone: '01711223319',
    status: 'Active',
    registrationDate: '2024-02-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+19&background=0d8275&color=fff',
    address: {
      address: 'House 19, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2019', date: '2024-10-01', items: 2, total: 690, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0020',
    name: 'Test Customer 20',
    email: 'customer20@example.com',
    phone: '01711223320',
    status: 'Inactive',
    registrationDate: '2024-03-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+20&background=0d8275&color=fff',
    address: {
      address: 'House 20, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2020', date: '2024-10-01', items: 2, total: 700, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0021',
    name: 'Test Customer 21',
    email: 'customer21@example.com',
    phone: '01711223321',
    status: 'Active',
    registrationDate: '2024-04-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+21&background=0d8275&color=fff',
    address: {
      address: 'House 21, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2021', date: '2024-10-01', items: 2, total: 710, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0022',
    name: 'Test Customer 22',
    email: 'customer22@example.com',
    phone: '01711223322',
    status: 'Active',
    registrationDate: '2024-05-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+22&background=0d8275&color=fff',
    address: {
      address: 'House 22, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2022', date: '2024-10-01', items: 2, total: 720, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0023',
    name: 'Test Customer 23',
    email: 'customer23@example.com',
    phone: '01711223323',
    status: 'Active',
    registrationDate: '2024-06-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+23&background=0d8275&color=fff',
    address: {
      address: 'House 23, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2023', date: '2024-10-01', items: 2, total: 730, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0024',
    name: 'Test Customer 24',
    email: 'customer24@example.com',
    phone: '01711223324',
    status: 'Inactive',
    registrationDate: '2024-07-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+24&background=0d8275&color=fff',
    address: {
      address: 'House 24, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2024', date: '2024-10-01', items: 2, total: 740, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0025',
    name: 'Test Customer 25',
    email: 'customer25@example.com',
    phone: '01711223325',
    status: 'Active',
    registrationDate: '2024-08-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+25&background=0d8275&color=fff',
    address: {
      address: 'House 25, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2025', date: '2024-10-01', items: 2, total: 750, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0026',
    name: 'Test Customer 26',
    email: 'customer26@example.com',
    phone: '01711223326',
    status: 'Active',
    registrationDate: '2024-09-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+26&background=0d8275&color=fff',
    address: {
      address: 'House 26, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2026', date: '2024-10-01', items: 2, total: 760, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0027',
    name: 'Test Customer 27',
    email: 'customer27@example.com',
    phone: '01711223327',
    status: 'Active',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+27&background=0d8275&color=fff',
    address: {
      address: 'House 27, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2027', date: '2024-10-01', items: 2, total: 770, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0028',
    name: 'Test Customer 28',
    email: 'customer28@example.com',
    phone: '01711223328',
    status: 'Inactive',
    registrationDate: '2024-02-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+28&background=0d8275&color=fff',
    address: {
      address: 'House 28, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2028', date: '2024-10-01', items: 2, total: 780, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0029',
    name: 'Test Customer 29',
    email: 'customer29@example.com',
    phone: '01711223329',
    status: 'Active',
    registrationDate: '2024-03-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+29&background=0d8275&color=fff',
    address: {
      address: 'House 29, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2029', date: '2024-10-01', items: 2, total: 790, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0030',
    name: 'Test Customer 30',
    email: 'customer30@example.com',
    phone: '01711223330',
    status: 'Active',
    registrationDate: '2024-04-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+30&background=0d8275&color=fff',
    address: {
      address: 'House 30, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2030', date: '2024-10-01', items: 2, total: 800, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0031',
    name: 'Test Customer 31',
    email: 'customer31@example.com',
    phone: '01711223331',
    status: 'Active',
    registrationDate: '2024-05-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+31&background=0d8275&color=fff',
    address: {
      address: 'House 31, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2031', date: '2024-10-01', items: 2, total: 810, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0032',
    name: 'Test Customer 32',
    email: 'customer32@example.com',
    phone: '01711223332',
    status: 'Inactive',
    registrationDate: '2024-06-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+32&background=0d8275&color=fff',
    address: {
      address: 'House 32, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2032', date: '2024-10-01', items: 2, total: 820, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0033',
    name: 'Test Customer 33',
    email: 'customer33@example.com',
    phone: '01711223333',
    status: 'Active',
    registrationDate: '2024-07-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+33&background=0d8275&color=fff',
    address: {
      address: 'House 33, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2033', date: '2024-10-01', items: 2, total: 830, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0034',
    name: 'Test Customer 34',
    email: 'customer34@example.com',
    phone: '01711223334',
    status: 'Active',
    registrationDate: '2024-08-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+34&background=0d8275&color=fff',
    address: {
      address: 'House 34, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2034', date: '2024-10-01', items: 2, total: 840, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0035',
    name: 'Test Customer 35',
    email: 'customer35@example.com',
    phone: '01711223335',
    status: 'Active',
    registrationDate: '2024-09-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+35&background=0d8275&color=fff',
    address: {
      address: 'House 35, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2035', date: '2024-10-01', items: 2, total: 850, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0036',
    name: 'Test Customer 36',
    email: 'customer36@example.com',
    phone: '01711223336',
    status: 'Inactive',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+36&background=0d8275&color=fff',
    address: {
      address: 'House 36, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2036', date: '2024-10-01', items: 2, total: 860, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0037',
    name: 'Test Customer 37',
    email: 'customer37@example.com',
    phone: '01711223337',
    status: 'Active',
    registrationDate: '2024-02-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+37&background=0d8275&color=fff',
    address: {
      address: 'House 37, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2037', date: '2024-10-01', items: 2, total: 870, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0038',
    name: 'Test Customer 38',
    email: 'customer38@example.com',
    phone: '01711223338',
    status: 'Active',
    registrationDate: '2024-03-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+38&background=0d8275&color=fff',
    address: {
      address: 'House 38, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2038', date: '2024-10-01', items: 2, total: 880, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0039',
    name: 'Test Customer 39',
    email: 'customer39@example.com',
    phone: '01711223339',
    status: 'Active',
    registrationDate: '2024-04-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+39&background=0d8275&color=fff',
    address: {
      address: 'House 39, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2039', date: '2024-10-01', items: 2, total: 890, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0040',
    name: 'Test Customer 40',
    email: 'customer40@example.com',
    phone: '01711223340',
    status: 'Inactive',
    registrationDate: '2024-05-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+40&background=0d8275&color=fff',
    address: {
      address: 'House 40, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2040', date: '2024-10-01', items: 2, total: 900, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0041',
    name: 'Test Customer 41',
    email: 'customer41@example.com',
    phone: '01711223341',
    status: 'Active',
    registrationDate: '2024-06-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+41&background=0d8275&color=fff',
    address: {
      address: 'House 41, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2041', date: '2024-10-01', items: 2, total: 910, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0042',
    name: 'Test Customer 42',
    email: 'customer42@example.com',
    phone: '01711223342',
    status: 'Active',
    registrationDate: '2024-07-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+42&background=0d8275&color=fff',
    address: {
      address: 'House 42, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2042', date: '2024-10-01', items: 2, total: 920, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0043',
    name: 'Test Customer 43',
    email: 'customer43@example.com',
    phone: '01711223343',
    status: 'Active',
    registrationDate: '2024-08-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+43&background=0d8275&color=fff',
    address: {
      address: 'House 43, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2043', date: '2024-10-01', items: 2, total: 930, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0044',
    name: 'Test Customer 44',
    email: 'customer44@example.com',
    phone: '01711223344',
    status: 'Inactive',
    registrationDate: '2024-09-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+44&background=0d8275&color=fff',
    address: {
      address: 'House 44, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2044', date: '2024-10-01', items: 2, total: 940, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0045',
    name: 'Test Customer 45',
    email: 'customer45@example.com',
    phone: '01711223345',
    status: 'Active',
    registrationDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+45&background=0d8275&color=fff',
    address: {
      address: 'House 45, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2045', date: '2024-10-01', items: 2, total: 950, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0046',
    name: 'Test Customer 46',
    email: 'customer46@example.com',
    phone: '01711223346',
    status: 'Active',
    registrationDate: '2024-02-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+46&background=0d8275&color=fff',
    address: {
      address: 'House 46, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2046', date: '2024-10-01', items: 2, total: 960, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0047',
    name: 'Test Customer 47',
    email: 'customer47@example.com',
    phone: '01711223347',
    status: 'Active',
    registrationDate: '2024-03-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+47&background=0d8275&color=fff',
    address: {
      address: 'House 47, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2047', date: '2024-10-01', items: 2, total: 970, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0048',
    name: 'Test Customer 48',
    email: 'customer48@example.com',
    phone: '01711223348',
    status: 'Inactive',
    registrationDate: '2024-04-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+48&background=0d8275&color=fff',
    address: {
      address: 'House 48, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2048', date: '2024-10-01', items: 2, total: 980, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0049',
    name: 'Test Customer 49',
    email: 'customer49@example.com',
    phone: '01711223349',
    status: 'Active',
    registrationDate: '2024-05-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+49&background=0d8275&color=fff',
    address: {
      address: 'House 49, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2049', date: '2024-10-01', items: 2, total: 990, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  },
{
    id: 'CUST-0050',
    name: 'Test Customer 50',
    email: 'customer50@example.com',
    phone: '01711223350',
    status: 'Active',
    registrationDate: '2024-06-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+50&background=0d8275&color=fff',
    address: {
      address: 'House 50, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-2050', date: '2024-10-01', items: 2, total: 1000, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  }
];
