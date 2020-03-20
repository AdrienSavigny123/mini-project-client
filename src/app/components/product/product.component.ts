import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { World,Product } from 'src/app/resources/world';


declare var require;
const ProgressBar= require("progressbar.js");
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  


  @ViewChild('bar') progressBarItem;
  progressbar: any;
  world: World;
  product: Product;
  lastupdate: number;
  rateProd: string;
  constructor() { }

  ngOnInit(): void {
    var bar = new ProgressBar.Line(bar, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: {width: '100%', height: '100%'}
    });
    setInterval(() =>{ this.calcScore(); }, 100);
    bar.animate(1.0);  // Number from 0.0 to 1.0
  }

@Input()
set prod( value: Product) {
  this.product= value;
}
@Output()
notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

startFabrication() {
  this.progressbar.set(0);
  this.progressbar.animate(1, { duration: this.product.vitesse });
  this.product.timeleft = this.product.vitesse;
  this.countdown(this.product.id, this.product.vitesse);
}
countdown(id: number, speed: number) {
  const countDownDate = new Date().getTime() + speed;
  // tslint:disable-next-line:only-arrow-functions
  const x = setInterval(function () {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    let hours = (Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).toString();
    let minutes = (Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).toString();
    let seconds = (Math.floor((distance % (1000 * 60)) / 1000)).toString();
    if (hours.match('0') || hours.match('-1')) {
      hours = '00';
    }
    if (minutes.match('0') || minutes.match('-1')) {
      minutes = '00';
    }
    if (seconds.match('0*') || seconds.match('-1')) {
      seconds = '0' + seconds;
    }
    document.getElementById('temps' + id).innerHTML = hours + ':' + minutes + ':' + seconds;
    if (distance < 0) {
      let time = '';
      if (speed <= 10000) {
        time = '0' + (speed / 1000).toString();
      } else {
        time = (speed / 1000).toString();
      }
      clearInterval(x);
      document.getElementById('temps' + id).innerHTML = hours + ':' + minutes + ':' + time;
    }
  }, 0);
}

calcScore(): void {
  const now = Date.now();
  const elapseTime = now - this.lastupdate;
  this.lastupdate = now;

  if (this.product.managerUnlocked) {
    if (this.product.timeleft !== 0) {
      this.product.timeleft = this.product.timeleft - elapseTime;
      if (this.product.timeleft <= 0) {
        this.product.timeleft = this.product.vitesse;
        this.notifyProduction.emit(this.product);
        this.startFabrication();
      }
    } else {
      this.startFabrication();
    }

  } else {

    if (this.product.timeleft !== 0) {
      this.product.timeleft = this.product.timeleft - elapseTime;
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
  }
}
}
