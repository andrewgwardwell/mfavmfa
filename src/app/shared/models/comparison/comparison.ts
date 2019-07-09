export class Comparison {
    //    _links: any;
       type: Array<any>;
       title: any;
       field_programs: Array<any>;
        constructor(data: any){
            let title = data.title || 'Comparison';
            this.type = [{target_id: data.type}];
            // this._links = {type: {href:'http://example.com/rest/type/node/page'}};
            this.title = [{value: title}];
            if(data.programs){
                this.field_programs = [];
                data.programs.forEach(element => {
                    this.field_programs.push(new ComparisonProgram(element));
                });
            }
            
        }
}

export class ComparisonProgram {
    target_id: number;
    target_type: string;
    target_uuid: string;
    url: string;
    constructor(data: any){
        this.target_id = data.target_id || data.data.attributes.drupal_internal__nid;
        this.target_uuid = data.target_uuid || data.data.id;
        this.url = data.url || null;
    }
}
