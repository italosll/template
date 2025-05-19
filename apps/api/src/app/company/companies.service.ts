import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { HTTP_ERROR_MESSAGES } from "../common/utils/http-error-messages.util";
import { AuditContract } from "../common/contracts/audit.contract";
import { EntityService } from "../common/services/entity.service";
import { Company } from "./entities/companies.entity";
import { UpdateCompanyDTO } from "./dto/update-companies.dto";
import { CompanyContract } from "@interfaces/company.contract";
import { CompanyFactory } from "./factories/companies.factory";
import { S3FilesService } from "../common/files/s3-files.service";
import { ResponseCompanyDTO } from "./dto/response-companies.dto";
import { ColumnQueryParameters } from "../common/utils/crud-helper.util";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";
import { CreateCompanyDTO } from "./dto/create-companies.dto";

@Injectable()
export class CompaniesService implements EntityService<ResponseCompanyDTO, CreateCompanyDTO, UpdateCompanyDTO>{

  constructor(
    @InjectRepository(Company) private _companyRepository:Repository<Company>,
    @Inject(S3FilesService) private _filesService: S3FilesService
  ){}

  async findAll(company?:Partial<CompanyContract & AuditContract>): Promise<ResponseCompanyDTO[]>{
    const queryBuilder = this._companyRepository.createQueryBuilder();
    const queriesParameters:ColumnQueryParameters<Company>[] = getQueriesParameters();
    
    queryBuilder.andWhereMultipleColumns(company, queriesParameters);
    const companies = await queryBuilder.getMany();

    const companiesWithFiles = companies.map( 
      (company)=>(
        {...new CompanyFactory().response(company), 
          image: this._filesService.getFileInfoByS3FileKey(company.s3FileKey, company.fantasyName)
        }
      )

    )
    return companiesWithFiles;
  }

  async create(createCompany:CreateCompanyDTO): Promise<CreateDefaultResponseDTO>{

    const registeredCompany = await this._companyRepository.findOne({
      where: {
        cnpj: createCompany.cnpj
      }
    });

    if(registeredCompany) throw new HttpException(HTTP_ERROR_MESSAGES.alreadyExists(), HttpStatus.CONFLICT);

    const entity = this._companyRepository.create(createCompany);
    entity.s3FileKey = await this._filesService.upload(["companies"],createCompany?.image?.base64File, registeredCompany?.s3FileKey);
    const created = await this._companyRepository.save(entity);
    const response = { id: created.id };
    return response;
  }

  async update(updateEntity?:UpdateCompanyDTO): Promise<UpdateDefaultResponseDTO>{

    const registeredCompany = await this._companyRepository.findOne({
      where: {
        cnpj: updateEntity.cnpj
      }
    });

    if(!registeredCompany) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);

    this._companyRepository.merge(
      registeredCompany,
      updateEntity
    )

    registeredCompany.s3FileKey = await this._filesService.upload(["companies"],updateEntity?.image?.base64File, registeredCompany?.s3FileKey);

    this._companyRepository.save(registeredCompany);
    const response = { id: registeredCompany.id };

    return response;
  }

  async delete(ids:number[]) {
    const companies = await this._companyRepository.find();

    ids.forEach((id)=>{
      const registeredUser = companies?.find((user)=> user.id === id);
      if(!registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    })

    await this._companyRepository.softDelete({id: In(ids)});

    return { ids };
  }

  async hardDelete(ids:number[]) {
    const companies = await this._companyRepository.find();

    ids.forEach((id)=>{
      const registeredUser = companies?.find((user)=> user.id === id);
      if(!registeredUser) throw new HttpException(HTTP_ERROR_MESSAGES.notFound(), HttpStatus.NOT_FOUND);
    })

    await this._companyRepository.delete({id: In(ids)});

    return { ids };
  }
}
