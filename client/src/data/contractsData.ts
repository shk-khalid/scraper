export interface Contract {
  type: string;
  transactionId: string;
  transDate: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  contractId: string;
  price: number;
  status: 'Fulfilled' | 'Canceled' | 'Pending';
}

export const contractsData: Contract[] = [
  {
    type: 'Product',
    transactionId: 'PRTRGAS-00764-5123-46-00-3446578392',
    transDate: '02 May 2024',
    customerName: 'Aarav Sharma',
    customerEmail: 'aaravsharma@gmail.com',
    productName: 'Smart Speaker',
    contractId: '1234567-TRN-4312-9344-72548842e3e2',
    price: 14500,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '345674GAS-23456-5678-24-35-9087665432',
    transDate: '15 Apr 2024',
    customerName: 'Meera Desai',
    customerEmail: 'meeradesai@gmail.com',
    productName: 'Air Purifier',
    contractId: '1234567-TRN-4312-9344-82548842e3e2',
    price: 18999,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '567834-01234-5123-55-00-2345678901',
    transDate: '10 Mar 2024',
    customerName: 'Rohan Verma',
    customerEmail: 'rohanverma@gmail.com',
    productName: 'Wireless Earbuds',
    contractId: '1234567-TRN-4312-9344-92548842e3e2',
    price: 7999,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '765902-01234-5123-99-00-7654321098',
    transDate: '22 Feb 2024',
    customerName: 'Ananya Gupta',
    customerEmail: 'ananyagupta@gmail.com',
    productName: 'Smartwatch',
    contractId: '1234567-TRN-4312-9344-02548842e3e2',
    price: 15000,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '602789-09876-5432-88-00-3456789012',
    transDate: '09 May 2024',
    customerName: 'Kabir Nair',
    customerEmail: 'kabirnair@gmail.com',
    productName: 'Fitness Tracker',
    contractId: '1234567-TRN-4312-9344-12548842e3e2',
    price: 4950,
    status: 'Canceled'
  },
  {
    type: 'Product',
    transactionId: '432567-09876-1234-77-00-6789012345',
    transDate: '17 Apr 2024',
    customerName: 'Isha Reddy',
    customerEmail: 'ishareddy@gmail.com',
    productName: 'Bluetooth Speaker',
    contractId: '1234567-TRN-4312-9344-22548842e3e2',
    price: 9500,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '602789-09876-1234-66-00-9012345678',
    transDate: '27 Mar 2024',
    customerName: 'Yash Mehta',
    customerEmail: 'yashmehta@gmail.com',
    productName: 'Action Camera',
    contractId: '1234567-TRN-4312-9344-32548842e3e2',
    price: 22000,
    status: 'Fulfilled'
  },
  {
    type: 'Product',
    transactionId: '602789-09876-9012-55-00-2345678901',
    transDate: '12 Jan 2024',
    customerName: 'Priya Menon',
    customerEmail: 'priyamenon@gmail.com',
    productName: 'Electric Kettle',
    contractId: '1234567-TRN-4312-9344-42548842e3e2',
    price: 3500,
    status: 'Canceled'
  },
  {
    type: 'Product',
    transactionId: '602789-09876-9012-99-00-5678901234',
    transDate: '05 Feb 2024',
    customerName: 'Devansh Joshi',
    customerEmail: 'devanshjoshi@gmail.com',
    productName: 'Laptop Stand',
    contractId: '1234567-TRN-4312-9344-52548842e3e2',
    price: 2099,
    status: 'Fulfilled'
  }
];