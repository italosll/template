import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { PersonNatural } from "@api/person/entities/person-natural.entity";

export type ResponseClientDTO = PersonLegal | PersonNatural;
