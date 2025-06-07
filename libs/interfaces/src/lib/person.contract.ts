export interface PersonContract {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  document: string;
}

export interface PersonLegalContract extends PersonContract {
  companyRealName: string;
}

export interface PersonNaturalContract extends PersonContract {
  birthDate: Date;
}
