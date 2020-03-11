import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {World,Pallier,Product} from '../resources/world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

    server ="http://localhost:8080/adventureISIS/"
    user = "";

  constructor(private http: HttpClient) { 
    
  }

  public get getServer(): string {
    return this.server;
  }
  set setServer(server: string){
    this.server=server;
  }   
  
  get getUser(): string {
    return this.user;
}

set setUser(user: string) {
  this.user=user;
}

private handleError(error: any): Promise<any> {
  console.error('An error occurred', error); 
  return Promise.reject(error.message|| error);
}
getWorld(): Promise<World> {
  return this.http.get(this.server + 'webresources/generic/world')
  .toPromise().catch(this.handleError);
};

}