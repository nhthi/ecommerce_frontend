export interface PickupAddress {
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface BusinessDetails {
  businessName: string;
}

export interface Seller {
  id?: number;
  mobile: string;
  otp: string;
  gstin: string;
  pickupAddress: PickupAddress;
  businessDetails: BusinessDetails;
  bankDetails: BankDetails;
  sellerName: string;
  email: string;
  password: string;
  accountStatus?: string;
  avatar?: string;
}

export interface SellerReport {
  id: number;
  seller: Seller;
  totalEarnings: number;
  totalSales: number;
  totalRefunds: number;
  totalTax: number;
  netEarnings: number;
  totalOrders: number;
  cancelledOrders: number;
  totalTransactions: number;
}
