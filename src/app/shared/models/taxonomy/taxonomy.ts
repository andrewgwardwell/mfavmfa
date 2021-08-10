export class Taxonomy {
    terms: string;
    constructor(data: any){
      this.terms = data.data.map(item => new Term(item));
    }
}

export class Term {
  name: string;
  id: string;
  constructor(data: any){
    this.name = data.attributes.name;
    this.id = data.id;
  }
}
