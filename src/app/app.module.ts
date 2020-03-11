import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app.component';
import { ProductComponent } from './components/product/product.component';
import { RestserviceService } from './services/restservice.service';
import { FormsModule } from '@angular/forms';
import { BigvaluePipe } from './bigvalue.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule

  ],
  providers: [RestserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
