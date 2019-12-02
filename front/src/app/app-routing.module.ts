import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QrComponent } from "./qr/qr.component";
import { MachineComponent } from "./machine/machine.component";

const routes: Routes = [
  { path: "qr/:string", component: QrComponent },
  { path: "", component: MachineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
