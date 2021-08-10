import {Person} from '../person/person';
export class SimpleProgram {
  title: string;
  uuid: string;
  nid: number;
  body: string;
  field_address: string;
  genres: Array<any>;
  logo: string;
  residency_type: Array<any>;
  constructor(data: any){
    Object.assign(this, data);
    if(data.field_genre){
      const gs = data.field_genre.split('|') || [];
      this.genres = gs.sort();
    }
    if(data.field_residency_type){
      const rts = data.field_residency_type.split('|') || [];
      this.residency_type = rts.sort();
    }
  }
}
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
    logo: string;
    extras: any;
    people: Array<Person> = [];
    genres: Array<string>;
    residency_type: Array<string>;
    constructor(data: any){
        let core = data.data && data.data[0] ? data.data[0] : data;
        let attr = core.attributes;
        this.id = core.id;
        this.title = attr.title;
        this.nid = attr.drupal_internal__nid;
        this.body = (attr.body && attr.body.processed) ? attr.body.processed : ''; 
        this.address = attr.field_address;
        this.publications = attr.field_affiliated_programs;
        this.deadline = attr.field_application_deadline;
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


        if(data.logoUrl && data.logoUrl.attributes && data.logoUrl.attributes.uri){
            let logo =`https://api.mfavsmfa.com${data.logoUrl.attributes.uri.url}`
            this.logo = logo;
        }
        if(this.extras){
          let people = this.extras.people;
          if(this.extras.genre && this.extras.genre.length > 0){
            this.genres = this.extras.genre.map(g => g.attributes.name).sort();
          }
          if(this.extras.res_type && this.extras.res_type.length > 0){
            this.residency_type = this.extras.res_type.map(g => g.attributes.name).sort();
          }
          if(people && people.length > 0){
            people.forEach(p => {
              let person = new Person(p);
              this.people.push(person);
            });
          }
        }
    }
}
