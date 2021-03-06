import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {World,Pallier,Product} from '../resources/world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

    server ="http://localhost:8080/adventureisis/"
    user = "";

  constructor(private http: HttpClient) { 
    
  }

  public getUser() :string {
    return this.user;
  }

public setUser(user:string) {
   this.user=user;
}

public getServer() : string {
  return this.server;
}

private handleError(error: any): Promise<any> {
  console.error('An error occurred', error); 
  return Promise.reject(error.message|| error);
}


getWorld(): Promise<World> {
  console.log("usertest : " + this.getUser());

  console.log(this.server + "generic/world");
  
  //return this.http.get(this.server+ "adventureisis/generic/world").toPromise().catch(this.handleError);
   return this.http.get(this.server + "generic/world", {
    headers: { "X-user": this.getUser() }
   })
     .toPromise().then(response => response)
     .catch(this.handleError);


};

private setHeaders(user: string): HttpHeaders {
  var headers = new HttpHeaders({ 'X-User': user});
  return headers;
};

public putManager(manager: Pallier): Promise<Response> {
  // console.log(upgrade);
   return this.http
     .put(this.server + "generic/manager", manager, {
       headers: { "X-user": this.getUser() }
     })
     .toPromise()
     .then(response => response)
     .catch(this.handleError);
 }


public putProduit(product: Product): Promise<Response> {
   //console.log(product);
   return this.http
     .put(this.server + "generic/product", product, {
       headers: { "X-user": this.getUser() }
     })
     .toPromise()
     .then(response => response)
     .catch(this.handleError);
 }

public putUpgrade(upgrade: Pallier): Promise<Response> {
 // console.log(upgrade);
  return this.http
    .put(this.server + "generic/upgrade", upgrade, {
      headers: { "X-user": this.getUser() }
    })
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
}



public deleteWorld(): Promise<Response> {
  return this.http
    .delete(this.server + "generic/world", {
      headers: this.setHeaders(this.getUser())
    })
    .toPromise().then(response => response)
    .catch(this.handleError);
}



public putAngel(angel: Pallier): Promise<Response> {
  // console.log(angel);
   return this.http
     .put(this.server + "generic/angelupgrade", angel, {
       headers: { "X-user": this.getUser() }
     })
     .toPromise()
     .then(response => response)
     .catch(this.handleError);
 }
}




