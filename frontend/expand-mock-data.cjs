const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Generate 50 medicines
function expandMedicines() {
  const filePath = path.join(srcDir, 'mockData', 'medicines.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const manufacturers = ['Beximco Pharmaceuticals', 'Square Pharmaceuticals', 'The ACME Laboratories', 'ACI Limited', 'Roche Diabetes Care'];
  const categories = ['fever', 'gastric', 'respiratory', 'hygiene', 'devices', 'vitamins', 'pain'];
  
  const newMeds = [];
  for (let i = 7; i <= 60; i++) {
    const med = `{
    id: 'm${i}',
    name: 'MockMed ${i}',
    genericName: 'Generic Component ${i}',
    manufacturer: '${manufacturers[i % manufacturers.length]}',
    isOtc: ${i % 2 === 0},
    form: '${i % 3 === 0 ? 'Tablet' : 'Capsule'}',
    packSize: '10',
    price: ${10 + (i * 2)},
    originalPrice: ${15 + (i * 2)},
    discount: 5,
    unit: 'Strip',
    rating: 4.${i % 9},
    category: '${categories[i % categories.length]}',
    inStock: ${i % 5 !== 0},
    description: 'Mock description for MockMed ${i}',
    indications: ['Indication A', 'Indication B'],
    howToUse: 'Take 1 daily.',
    safetyInfo: 'Consult your doctor.',
    image: 'https://via.placeholder.com/150.png?text=Med+${i}'
  }`;
    newMeds.push(med);
  }
  
  // Find the closing bracket of MOCK_MEDICINES array
  content = content.replace(/\];\s*$/, ',\n' + newMeds.join(',\n') + '\n];\n');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Expanded medicines.js to 60 items');
}

// Generate 45 customers
function expandCustomers() {
  const filePath = path.join(srcDir, 'mockData', 'customers.js');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const newCust = [];
  for (let i = 6; i <= 50; i++) {
    const cust = `{
    id: 'CUST-00${i}',
    name: 'Test Customer ${i}',
    email: 'customer${i}@example.com',
    phone: '017112233${String(i).padStart(2, '0')}',
    status: '${i % 4 === 0 ? 'Inactive' : 'Active'}',
    registrationDate: '2024-0${1 + (i % 9)}-15',
    avatar: 'https://ui-avatars.com/api/?name=Test+Customer+${i}&background=0d8275&color=fff',
    address: {
      address: 'House ${i}, Road 7/A',
      city: 'Dhaka',
      area: 'Dhanmondi',
      postalCode: '1209'
    },
    orders: [
      { id: 'ORD-20${i}', date: '2024-10-01', items: 2, total: ${500 + i * 10}, paymentStatus: 'Paid', orderStatus: 'Delivered' }
    ]
  }`;
    newCust.push(cust);
  }
  
  content = content.replace(/\];\s*$/, ',\n' + newCust.join(',\n') + '\n];\n');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Expanded customers.js to 50 items');
}

// Generate 40 orders
function expandOrders() {
  const filePath = path.join(srcDir, 'context', 'OrderContext.jsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const newOrders = [];
  for (let i = 1; i <= 40; i++) {
    const order = `{
      id: 'ORD-56${String(i).padStart(2, '0')}',
      orderId: 'ORD-56${String(i).padStart(2, '0')}',
      createdAt: new Date(Date.now() - ${i * 8640000}).toISOString(),
      status: '${['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][i % 6]}',
      paymentMethod: '${i % 2 === 0 ? 'bKash' : 'Cash on Delivery'}',
      paymentStatus: '${i % 2 === 0 ? 'Paid' : 'Pending'}',
      deliveryMethod: 'Standard',
      customer: {
        name: 'Customer ${i}',
        phone: '0188822233${i % 10}',
        address: 'Dhaka'
      },
      items: [
        { id: 'm${(i % 5) + 1}', name: 'MockMed ${(i % 5) + 1}', price: 50, quantity: 2, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 100,
      deliveryFee: 50,
      discount: 0,
      total: 150
    }`;
    newOrders.push(order);
  }
  
  const regex = /(const \[orders, setOrders\] = useState\(\[\s*)([\s\S]*?)(\s*\]\);)/;
  content = content.replace(regex, (match, p1, p2, p3) => {
    return p1 + p2 + ',\n' + newOrders.join(',\n') + p3;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Expanded OrderContext.jsx to 40+ items');
}

// Generate 35 prescriptions
function expandPrescriptions() {
  const filePath = path.join(srcDir, 'context', 'PrescriptionContext.jsx');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const newRx = [];
  for (let i = 1; i <= 35; i++) {
    const statusArr = ['Pending', 'Approved', 'Rejected'];
    const rx = `{
      id: 'RX-90${String(i).padStart(2, '0')}',
      title: 'Prescription ${i}',
      uploadDate: new Date(Date.now() - ${i * 3600000}).toISOString(),
      status: '${statusArr[i % 3].toUpperCase()}',
      fileName: 'doc_${i}.${i % 2 === 0 ? 'pdf' : 'jpg'}',
      type: '${i % 2 === 0 ? 'pdf' : 'image'}',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+${i}',
      customerName: 'Customer ${i}',
      phone: '0199988877${i % 10}'
    }`;
    newRx.push(rx);
  }
  
  const regex = /(const \[prescriptions, setPrescriptions\] = useState\(\[\s*)([\s\S]*?)(\s*\]\);)/;
  content = content.replace(regex, (match, p1, p2, p3) => {
    return p1 + p2 + ',\n' + newRx.join(',\n') + p3;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Expanded PrescriptionContext.jsx to 35+ items');
}

function run() {
  expandMedicines();
  expandCustomers();
  expandOrders();
  expandPrescriptions();
}

run();
