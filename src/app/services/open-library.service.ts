import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {
  url = "http://openlibrary.org/search.json?author=Ann+Lauterbach";
  
  constructor(private http: HttpClient) { }

  getAuthor(author){
    return this.http.get(this.url);

  }
}
