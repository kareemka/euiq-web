export function governorateDiscount(subtotal:number,fee:number|undefined,destination:string,discounts:Record<string,number>={}){
 if(fee===undefined||!destination)return 0;
 const amount=discounts[destination]??0;
 if(!Number.isSafeInteger(amount)||amount<0)return 0;
 return Math.min(amount,Math.max(0,subtotal+fee));
}
