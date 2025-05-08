
export function objectToQueryParams(params:{[key:string]:unknown}):string{

    let stringParams = "";

    const keys = Object.keys(params);

    if(keys.length>0){
        stringParams += "?";
    }

    Object.keys(params).forEach((key) => {
        stringParams += `${key}=${params[key]}&`;
    });

    return stringParams.slice(0,-1);

}