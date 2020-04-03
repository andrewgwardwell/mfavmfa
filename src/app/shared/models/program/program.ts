import {Person} from '../person/person';
export class Program {
    title: string;
    id: string;
    nid: number;
    body: string;
    address: string;
    publications: string;
    deadline: string;
    contact: string;
    contactName: string;
    fee: number;
    col: string;
    funding: string;
    maxClassSize: number;
    minClassSize: number;
    maxDuration: number;
    minDuration: number;
    alumni: string;
    programName: string;
    qol: number;
    rentIndex: number;
    tuition: number;
    website: string;
    extras: any;
    people: Array<Person> = [];
    constructor(data: any){
        let core = data.data[0];
        let attr = core.attributes;
        this.id = core.id;
        this.title = attr.title;
        this.nid = attr.drupal_internal__nid;
        this.body = attr.body.processed; 
        this.address = attr.field_address;
        this.publications = attr.field_affiliated_programs;
        this.deadline = attr.field_deadline;
        this.contact = attr.field_contact;
        this.contactName = attr.field_contact_name;
        this.fee = attr.field_fee;
        this.col = attr.field_cost_of_living;
        this.funding = attr.field_funding_employment;
        this.maxClassSize = attr.field_max_class_size;
        this.minClassSize = attr.field_min_class_size;
        this.minDuration = attr.field_min_duration;
        this.maxDuration = attr.field_max_duration;
        this.alumni = attr.field_notable_alumni;
        this.programName = attr.field_program_name;
        this.qol = attr.field_quality_of_life;
        this.rentIndex = attr.field_rent_index;
        this.tuition = attr.field_tuition;
        this.website = attr.field_website;
        this.extras = data.extras;
        let people = this.extras.people;
        people.forEach(p => {
            let person = new Person(p);
            this.people.push(person);
        });
    }
}
