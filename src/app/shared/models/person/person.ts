export class Person {
    title: string;
    body: string;
    website: string;
    image: any;
    constructor(data: any){
        let attr = data.attributes;
        this.title = attr.title;
        this.body = (attr.body && attr.body.processed) ? attr.body.processed : ''; 
        this.website = attr.field_website;
        const image_url = data.image.attributes.uri.url.replace(/\/sites\/default\/files\//, "/sites/default/files/styles/author_image/public/");
        let image = `https://api.mfavsmfa.com${image_url}`;
        this.image = image;
    }
}