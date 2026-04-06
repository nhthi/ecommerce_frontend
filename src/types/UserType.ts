export interface Address {
  id?: number;
  receiverName: string;
  phoneNumber: string;
  streetDetail: string;
  ward: string;
  district: string;
  province: string;
  note: string;
  default?: boolean;
  active?: boolean;
}

export enum UserRole {
  ROLE_CUSTOMER = "ROLE_CUSTOMER",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_SELLER = "ROLE_SELLER",
  ROLE_STAFF = "ROLE_STAFF",
}
export interface User {
  id?: number;
  password: string;
  email: string;
  fullName?: string;
  role?: UserRole;
  mobile?: string;
  addresses?: Address[];
  birthday?: string;
  avatar?: string;
  gender?: string;
  status?: string;
}
