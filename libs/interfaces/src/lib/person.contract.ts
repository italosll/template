export interface PersonContract {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface PersonLegalContract extends PersonContract {
  companyRealName: string;
  document: string;

}

export interface PersonNaturalContract extends PersonContract {
  birthDate: Date;
  document: string;
}
