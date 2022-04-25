import { NgModule, } from '@angular/core';
import { ServicioRoutingModule } from './servicio-routing.module';
import { ServicioComponent } from './servicio.component';
import {SharedModule} from '../../shared/shared.module';
import { SidePanelOverlayModule } from '../../shared/side-panel/side-panel-overlay.module';
import { BEServicioPanelModule } from './beservicio/borrareditarservicio.module';
import { AServicioPanelModule } from './agservicio/agregarservicio.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ServicioRoutingModule,
    SharedModule,
    SidePanelOverlayModule,
    BEServicioPanelModule,
    AServicioPanelModule,
    FormsModule,

  ],
  declarations: [ServicioComponent]
  
})
export class ServicioModule { 
  
}
