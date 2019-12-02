import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PointsComponent } from "./points/points.component";
import { BottleButtonComponent } from "./bottle-button/bottle-button.component";
import { QrButtonComponent } from "./qr-button/qr-button.component";
import { QrComponent } from "./qr/qr.component";
import { QRCodeModule } from "angular2-qrcode";
import { MachineComponent } from "./machine/machine.component";

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbThemeModule, NbLayoutModule, NbButtonModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { ApiService } from "./api.service";
import { StackComponent } from './stack/stack.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { StackWrapperComponent } from './stack-wrapper/stack-wrapper.component';
import { TextComponent } from './text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    PointsComponent,
    BottleButtonComponent,
    QrButtonComponent,
    QrComponent,
    MachineComponent,
    StackComponent,
    StackWrapperComponent,
    TextComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbButtonModule,
    AngularSvgIconModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule { }
