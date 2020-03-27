import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService} from '../services/restservice.service';
import { World,Product,Pallier} from '../resources/world';
import { ProductComponent } from './product/product.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  @ViewChildren(ProductComponent) public productsComponent: QueryList<ProductComponent>;
  title = 'Chef Etoile';

world: World = new World();
server : string;
username: string = ''
qtmulti : string = "X1";
managerDispo : boolean;
upgradeDispo : boolean;
angelDispo : boolean;

constructor(private service: RestserviceService, private toastr : ToastrService){
  this.server = service.getServer();
  service.getWorld().then(
    world => {
      this.world=world;
      console.log("world:",world);
      }).catch(error => {console.log("error:",error)});

      this.createUsername();
         
  
}

ngOnInit(){

}

onUsernameChanged(): void {
  localStorage.setItem("username", this.username);
  this.service.setUser(this.username);
}

createUsername(): void {
  this.username = localStorage.getItem("username");
  if (this.username == '') {
    this.username = 'Jedi' + Math.floor(Math.random() * 10000);
    localStorage.setItem("username", this.username);
  }
  this.service.setUser(this.username);
}


onProductionDone(p : Product){
  this.world.money = this.world.money + p.revenu*p.quantite;
  this.world.score = this.world.score + p.revenu*p.quantite;
  console.log('Je ne fais que passer')
  this.managerDisponibility();
  this.upgradeDisponibility();
}

buyRate() {
  switch(this.qtmulti){
    case 'X1' : this.qtmulti = 'X10';
    break;
    case 'X10' : this.qtmulti = 'X100';
    break;
    case 'X100' : this.qtmulti = 'Max';
    break;
    case 'Max' : this.qtmulti = 'X1';
    break;
  }
}

onBuyDone(cost: number): void {
  if (this.world.money >= cost) {
    this.world.money -= cost;
  }
  this.newManager();
}

managerDisponibility() : void {
  this.managerDispo = false;
  this.world.managers.pallier.forEach(val => {
    if(!this.managerDispo){
        if(this.world.money > val.seuil && !val.unlocked){
        this.managerDispo = true;
        }
    }
  })
}

upgradeDisponibility(){
  this.upgradeDispo = false;
  this.world.upgrades.pallier.map(upgrade => {
    if(!this.upgradeDispo){
      if(!upgrade.unlocked && this.world.money > upgrade.seuil){
        this.upgradeDispo = true
      }
    }
  })
}

angelUpgradesDisponibility() {
  this.angelDispo = false;
  this.world.angelupgrades.pallier.map(angel => {
    if (!this.angelDispo) {
      if (!angel.unlocked && this.world.activeangels > angel.seuil) {
        this.angelDispo = true
      }
    }
  })
}





achatManager(m : Pallier){
  if(this.world.money >= m.seuil){
    this.world.money = this.world.money - m.seuil;
    var index = this.world.managers.pallier.indexOf(m);
    this.world.managers.pallier[index].unlocked = true;

    this.world.products.product.forEach(element => {
      if(m.idcible==element.id){
         var index = this.world.products.product.indexOf(element);
         this.world.products.product[index].managerUnlocked = true;
      }
    });
    this.managerDisponibility();
    this.toastr.success("Achat du Manager " + m.name + " effectué");  }

}

achatUpgrade (u : Pallier){
  if(this.world.money >= u.seuil){
    this.world.money = this.world.money - u.seuil;
    this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(u)].unlocked = true;
    
    if(u.idcible == 0){
      this.productsComponent.forEach(prod => prod.calcUpgrade(u));
      this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour tous les produits","Upgrade global");
    }
    else{
      this.productsComponent.forEach(prod => {
        if(u.idcible == prod.product.id){
          prod.calcUpgrade(u);
          this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour "+prod.product.name,"Upgrade")
        }
      })
    }
    this.upgradeDisponibility();
  }
}
  newManager() {
    for (const manager of this.world.managers.pallier) {
      if (this.world.money >= manager.seuil && manager.unlocked === false) {
        document.getElementById('btnManagers').innerHTML = '<span class="badge">New</span> Managers';
        break;
      } else {
        document.getElementById('btnManagers').innerHTML = 'Managers';
      }
    }
  }



  productUnlockDone  (p : Pallier){
    this.productsComponent.forEach(prod => {
      if (p.idcible == prod.product.id) {
        this.toastr.success("Bonus de " + p.typeratio + " effectué sur " + prod.product.name);
        }
    });
  }
}
