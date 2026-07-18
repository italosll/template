import { LookupContract } from "@interfaces/lookup.contract";

export class ResponseLookupDTO implements LookupContract {
  public id!: number;
  public description!: string;
}
