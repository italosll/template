export type FactoryContract = {
 fullData: (params?: object) => object
 createData: (params?: object) => object
 updateData: (params?: object) => object
}

export interface FactoryWithRelationsContract extends FactoryContract{
    fullDataWithRelations: (params?: object) => object
}