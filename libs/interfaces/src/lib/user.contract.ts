export interface UserContract {
  id: number;
  email?: string;
  filterableEmail?: string;
  password: string;
  phoneNumber?: string;
  filterablePhoneNumber?: string;
}
