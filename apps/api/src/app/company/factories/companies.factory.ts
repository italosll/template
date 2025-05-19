 
import { AuditContract } from "../../common/contracts/audit.contract";
import { FactoryContract } from "../../common/contracts/factory.contract";

import { plainToInstance } from 'class-transformer';
import { UpdateCompanyDTO } from "../dto/update-companies.dto";
import { ResponseCompanyDTO } from "../dto/response-companies.dto";
import { CreateCompanyDTO } from "../dto/create-companies.dto";

export class CompanyFactory implements FactoryContract<
  CreateCompanyDTO,
  UpdateCompanyDTO,
  ResponseCompanyDTO
>{

  private _fakeData:Partial<CreateCompanyDTO | UpdateCompanyDTO | ResponseCompanyDTO> ={
    id: 1,
    fantasyName : "fantasyName",
    companyName : "companyName",
    cnpj : "cnpj",
    image : {
      name: "company_3243423.png",
      url: "www.url.com.br"
    },

    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    recoveredAt: new Date()
  }

  public create (
    params?:Partial<CreateCompanyDTO & AuditContract>,
    setFakeData = false
  ) {
   return plainToInstance(
    CreateCompanyDTO,
     setFakeData 
     ? {...this._fakeData, ...params} 
     : params
    );
  }

  public update (
    params?:Partial<UpdateCompanyDTO & AuditContract>,
    setFakeData = false
  ) {
    return plainToInstance(
      UpdateCompanyDTO,
       setFakeData 
       ? {...this._fakeData, ...params} 
       : params
      );
  }

  public response  (
    params?:Partial<ResponseCompanyDTO & AuditContract>,
    setFakeData = false
  ) {
    return plainToInstance(
      ResponseCompanyDTO,
       setFakeData 
       ? {...this._fakeData, ...params} 
       : params
       );
  }
}
