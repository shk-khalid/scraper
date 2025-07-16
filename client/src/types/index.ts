export interface FormData {
  customerId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  shippingAddress: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  shippingCountry: string;
}

export interface TransactionInformation {
  transactionId: string;
  currencyCode: string;
}

export interface StoreInformation {
  storeName: string;
  storeId: string;
}

export interface ContractInformation {
  contractId: string;
  status: string;
  planId?: string;
  dateUpdated: string;       
  purchasePrice: string;      
  planCategory: string;
  transactionDate: string;    
  dateRefunded: string;      
  dateCanceled: string;  
  planTransactionId?: string;
}

export interface ShipmentItem {
  name: string;
  productRefId: string;
  listPrice: string;
  quantity: number;
}

export interface Shipment {
  title: string;              // e.g. "SHIPMENT 1"
  shippingProvider: string;
  trackingId: string;
  shippingStatus: string;
  shipmentId: string;
  items: ShipmentItem[];
}

export interface Product {
  name: string;
  productRefId: string;
  listPrice: string;
  quantity: number;
}

export interface ContractDetails {
  formData: FormData;
  transactionInfo: TransactionInformation;
  storeInfo: StoreInformation;
  contractInfo: ContractInformation;
  shipments: Shipment[];
  unassignedProducts: Product[];
}



// Product
export interface Product {
  id: string;              
  product_id: number;      
  name: string;
  price: number;
  displayOffered: boolean;
  category: string;
  imageUrl: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  imageUrl: string;
  description: string;
  variants: string[];
  mfgLengthLabor: string;
  mfgLengthLaborValue: string;
  brand: string;
  barcode: string;
  gtin: string;
  upc: string;
  asin: string;
  status: string;
  displayOffer: boolean;
}

// Claim 

export interface ClaimDetails {
  claimId: string
  contractId: string
  product: string
  type: string
  status: 'Approved' | 'Denied' | 'In Review' | 'Fulfilled'
  customerInfo: CustomerInfo
  claimInfo: ClaimInfo
  productInfo: ProductInfo
  serviceOrderInfo: ServiceOrderInfo
}

export interface CustomerInfo {
  fullName: string
  phone: string
  email: string
  address: string
}

export interface ClaimInfo {
  type: string
  statusDetail: string
  incidentDescription: string
  fraudulentActivity?: string
  storeName: string
  poNumber: string
  storeId: string
  coverageYears: string
  coverageTerm: string
}

export interface ProductInfo {
  name: string
  manufacturer: string
  modelNumber?: string
  serialNumber: string
}

export interface ServiceOrderInfo {
  serviceOrderId: string
  serviceType: string
  status: string
  assignee: string
  remainingCoverage: string
  productListPrice: string
  defectiveShippingStatus?: string
  defectiveCarrier?: string
  trackingNumber?: string
}
