import { PersonLegalContract } from "./person.contract";
import { TenantContract } from "./tenant.contract";
import { UserContract } from "./user.contract";

export type SignUpContract = Omit<PersonLegalContract, "id"> &
  Omit<UserContract, "id" | "filtereableEmail"> &
  Omit<TenantContract, "id" | "companyId">;
