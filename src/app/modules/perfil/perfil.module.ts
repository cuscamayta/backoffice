import { NgModule, } from '@angular/core';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import {SharedModule} from '../../shared/shared.module';
import { BEPerfilPanelModule } from './beperfil/borrareditarperfil.module';
import { APerfilPanelModule } from './aperfil/agregarperfil.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';

@NgModule({
  imports: [
    PerfilRoutingModule,
    SharedModule,
    NgxPaginationModule,
    
    BEPerfilPanelModule,
    APerfilPanelModule,
    FormsModule,
    MatSlideToggleModule
    
    
  ],
  declarations: [PerfilComponent]
  
})
export class PerfilModule { 
  
}
