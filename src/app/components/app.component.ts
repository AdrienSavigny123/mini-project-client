import { Component } from '@angular/core';
import { RestserviceService} from '../services/restservice.service';
import { World,Product,Pallier} from '../resources/world';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'Chef Etoile';

world: World = new World();
server : string;

rate: string;
rates: string[] = ['1', '10', '100', 'Max'];
rateIndex = 0;



username: string;

constructor(private service: RestserviceService){
  this.server = service.server;
  service.getWorld().then(
    world => {
      this.world=world;
      
    }
  );
}


}
