export class MfaUser {
    uid: number;
    name: string;
    email: string;
    subscriptionId: string;
    customerId: string;
    constructor(data: any){
        this.uid = this.accessor(data, 'uid');
        this.name = this.accessor(data, 'name');
        this.email = this.accessor(data, 'mail');
        this.subscriptionId = this.accessor(data, 'field_subscription_id');
        this.customerId = this.accessor(data, 'field_customer_id');
    }
    accessor(value: any, fieldName:string, multiple: boolean = false){
        if(!multiple){
            if(value[fieldName]){
                let d = value[fieldName][0];
                if(d){
                    return d['value'];
                } 
            } else {
                return null;
            }
        }
    }
}
