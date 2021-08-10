import { orderBy } from 'lodash';
import * as _moment from 'moment';
const moment = _moment;

export class Person {
    title: string;
    body: string;
    website: string;
    image: any;
    books: Array<Book>;
    constructor(data: any){
        let attr = data.attributes;
        this.title = attr.title;
        this.body = (attr.body && attr.body.processed) ? attr.body.processed : ''; 
        this.website = attr.field_website;
        const image_url = data.image.attributes.uri.url.replace(/\/sites\/default\/files\//, "/sites/default/files/styles/author_image/public/");
        let image = `https://api.mfavsmfa.com${image_url}`;
        this.image = image;
        if(data.books){
          const bs = data.books.map(b => new Book(b));
          this.books = orderBy(bs,[(bItem) => {
            const ts = moment(bItem.pubDate).format('x');
            return parseInt(ts);
          }]).reverse();
        }
    }
}

export class Book {
  title: string;
  pubDate: string;
  cover: string;
  constructor(data: any){
    if(data){
      let attr = data.attributes;
      if(attr){
        this.title = attr.title;
        this.pubDate = attr.field_first_published;
      }
      if(data.cover){
        //maybe need to apply cover style to here:
        const image_url = data.cover.attributes.uri.url;
        let image = `https://api.mfavsmfa.com${image_url}`;
        this.cover = image;
      }
    } else {
      console.log('yikes');
    }

  }
}