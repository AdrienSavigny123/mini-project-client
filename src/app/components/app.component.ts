import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService} from '../services/restservice.service';
import { World,Product,Pallier} from '../resources/world';
import { ProductComponent } from './product/product.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { delay } from '../utils/delay.function';


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
interval;
gain:number;
nvAnges = 0;
  toasterService: any;
  toastrService: any;
  dInvest: boolean;

constructor(private service: RestserviceService, private toastr : ToastrService){
  service.setUser(localStorage.getItem("username"));
  this.server = service.getServer();
  this.createUsername(); 
  service.getWorld().then(
    world => { this.world = world;
      this.bonusAllunlock()
      this.managerDisponibility();
      this.upgradeDisponibility();
      this.angelUpgradesDisponibility();
    });
   
    setTimeout(() => { console.log(this.world.money); console.log(this.world.score);
      if(this.world.activeangels != 0){
        console.log("coucou");
        console.log(this.world.products);
      this.world.products.product.forEach(produit => {
        console.log("coucou");
        produit.revenu = produit.revenu * (1 + (this.world.activeangels * this.world.angelbonus/100));
      });
      }
    }, 100)
   
}

ngOnInit(): void {
  document.getElementById('boutonMult').innerHTML = "x1";
  this.username = localStorage.getItem("username");
}


onUsernameChanged(): void {
  localStorage.setItem("username", this.username);
  this.service.setUser(this.username);
}

createUsername(): void {
  this.username = localStorage.getItem("username");
  if (this.username == '') {
    this.username = 'Chef' + Math.floor(Math.random() * 10000);
    localStorage.setItem("username", this.username);
  }
  this.service.setUser(this.username);
}


onProductionDone(p: Product) {
  this.nvAnges = Math.round(150 * Math.sqrt(this.world.score / Math.pow(10, 15)));
  this.gain = p.revenu * p.quantite * (1 + this.world.activeangels * this.world.angelbonus / 100);
  this.world.money = this.world.money + this.gain;
  this.world.score = this.world.score + this.gain;
  this.managerDisponibility();
  this.upgradeDisponibility();
  this.service.putProduit(p);
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



async onBuyDone(cost: number) {
  if (this.world.money >= cost) {
    this.world.money -= cost;
    console.log('hi' + cost);
  } else {
    this.world.money = this.world.money;
  }
  console.log(this.world.money);
  await delay(0);
  this.managerDisponibility();
  this.upgradeDisponibility();
  
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
    this.service.putManager(m); }
    this.toastr.success("Achat du Manager " + m.name + " effectué"); 

}

achatUpgrade (u : Pallier){
  if(this.world.money >= u.seuil){
    this.world.money = this.world.money - u.seuil;
    this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(u)].unlocked = true;
    console.log("money" + this.world.money)
    
    if(u.idcible == 0){
      this.productsComponent.forEach(prod => prod.calcUpgrade(u));
      this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour tous les produits","Upgrade global");
      console.log("money2" + this.world.money)
    }
    else{
      this.productsComponent.forEach(prod => {
        if(u.idcible == prod.product.id){
          prod.calcUpgrade(u);
          this.toastr.success("Achat d'un upgrade de "+u.typeratio+" pour "+prod.product.name,"Upgrade")
          console.log("money3" + this.world.money)
        }
      })
    }
  this.upgradeDisponibility();
  this.service.putUpgrade(u);
  }
}




achatAnge(angel) {
  if (this.world.activeangels >= angel.seuil) {
    this.world.activeangels -= angel.seuil;
    angel.unlocked = true;
    if (angel.typeratio == "ange") {
      this.world.angelbonus += angel.ratio;
    } else {
      if (angel.idcible == 0) {
        this.productsComponent.forEach(product => product.calcUpgrade(angel))
        this.toastr.success("Achat d'un upgrade de "+angel.typeratio+" pour "+ " pour tous les produits", "Upgrade Angels")
      } else {
        this.productsComponent[angel.idcible - 1].calcUpgrade(angel)
        this.toastr.success("achat d'un upgrade de " + angel.typeratio + " pour " + this.world.products.product[angel.idcible - 1].name, "Upgrade Angels")
      }
    }
    
    this.updateProductRevenu(angel.seuil);
    this.service.putAngel(angel);
  }
}

bonusAllunlock() {
  //quantité minimale des produits
  let listeProd = this.productsComponent.map(p => p.product.quantite)
  let minQuantite = Math.min(...listeProd)
  this.world.allunlocks.pallier.map(value => {
    if (!value.unlocked && minQuantite >= value.seuil) {
      this.world.allunlocks.pallier[this.world.allunlocks.pallier.indexOf(value)].unlocked = true;
      this.productsComponent.forEach(prod => prod.calcUpgrade(value))
      this.toasterService.pop("Bonus " + value.typeratio + " sur tous les produits", "AllUnlock");
    }
  })
}


  productUnlockDone  (p : Pallier){
    this.productsComponent.forEach(prod => {
      if (p.idcible == prod.product.id) {
        this.toastr.success("Bonus de " + p.typeratio + " effectué sur " + prod.product.name);
        }
    });
  }

    //recupération des angels gagnés
    claimAngel(): void {
      this.service.deleteWorld();
      window.location.reload();
    }
  

    updateProductRevenu(seuil){
      if(this.world.activeangels != 0){ 
      this.world.products.product.forEach(product => {
        product.revenu = product.revenu * this.world.activeangels * this.world.angelbonus/(this.world.activeangels+seuil);
      });
    }
    }

 

  }

