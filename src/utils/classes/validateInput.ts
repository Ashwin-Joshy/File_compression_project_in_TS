import { IncomingSocketData } from "../interfaces/incomingSocketData";
import { ValidationResponse } from "../interfaces/validationResponse";

class ValidateInput{
    constructor(){

    }
    public static async validate(data:IncomingSocketData):Promise<ValidationResponse>{
        return new Promise(async (resolve, reject) => {
            
            
            console.log('data', data);
            console.log(data.from);
            let from = data.from
            let to = data.to
            let fromLength = from.length;
            let toLength = to.length;
            console.log('from', from);
            if(data.from.length==0 || data.to.length==0 || data.zipname=="" || data.fromdate=="" || data.todate==""){
                reject({
                    type:'error',
                    message:'Invalid data'
                });
            }
            else if (toLength != fromLength || fromLength == 0 || toLength == 0 ) { 
                reject({
                    type:'error',
                    message:'No of From and To paths are not equal or are empty'
                });
            }
            else {
                resolve({
                    type:'Success',
                    message:'Valid data'
                });
            }
            
        })   
    }
}
export default ValidateInput;