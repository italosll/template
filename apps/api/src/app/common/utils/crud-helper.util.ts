import { SelectQueryBuilder } from "typeorm";
import { S3FilesService } from "../files/s3-files.service";

type ColumnRawQuery<Entity> = {
    raw: string;
    like: keyof Entity

}

type ColumnWhereLikeQuery<Entity> = {
    where:string,
    like: keyof Entity
}

export type ColumnQueryParameters<Entity> = ColumnRawQuery<Entity> | ColumnWhereLikeQuery<Entity>;

export class CrudHelperUtil {
    // public static mountQuery<Entity>(
    //     filterObject:Partial<Record<keyof Entity,unknown>>, 
    //     queryBuilder:SelectQueryBuilder<Entity>,  
    //     columnNames: ColumnQueryDescriptor<Entity>[]){

    //     const columnNamesToQuery = columnNames.filter(
    //         column => filterObject[column.like] !== undefined && filterObject[column.like] !== null)
    //         ;

    //     columnNamesToQuery.forEach(column => {
    //         queryBuilder.andWhere(
    //             `LOWER(${String(column.where)}) LIKE LOWER(:${String(column.like)})`,
    //             { [column.like]: `%${filterObject[column.like]}%` }); 
    //     });
    // }

//     public static getFileInfoByS3FileKey( 
//         s3FileKey:string,
//         description:string,
//         filesService:S3FilesService
//      ){

//     if(!s3FileKey) return null;
    
//     const extension = s3FileKey.split('.').pop();
//    return  {
//         url: filesService.getUrlByKey(s3FileKey),
//         name: ` ${description}.${extension}`
//     };

//     }
}






