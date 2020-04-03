export class Person {
    title: string;
    body: string;
    website: string;
    image: any;
    constructor(data: any){
        let attr = data.attributes;
        this.title = attr.title;
        this.body = attr.body.processed; 
        this.website = attr.field_website;
        let image = `http://mfavmfa.lndo.site/${data.image.attributes.uri.url}`;
        this.image = image;
    }
}