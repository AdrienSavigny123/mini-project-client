import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app.component';
import { ProductComponent } from './components/product/product.component';
import { RestserviceService } from './services/restservice.service';
import { FormsModule } from '@angular/forms';
import { BigvaluePipe } from './bigvalue.pipe';
import { ModalComponent } from './components/modal/modal.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from './services/notification.service';



@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()


  ],
  providers: [RestserviceService,NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
