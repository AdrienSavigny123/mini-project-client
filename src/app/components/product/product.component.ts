import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { World,Product } from 'src/app/resources/world';


declare var require;
const ProgressBar= require("progressbar.js");
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  
  progressbar: any;

  @ViewChild('bar') progressBarItem;
  world: World;
  product: Product;
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
    
    bar.animate(1.0);  // Number from 0.0 to 1.0
  }

@Input()
set prod( value: Product) {
  this.product= value;
}

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
}
