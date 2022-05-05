import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import {SharedModule} from '../../shared/shared.module';
import { BEUsuarioPanelModule } from './beusuario/borrareditarusuario.module';
import { AUsuarioPanelModule } from './agregarusuario/agregarusuario.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';

@NgModule({
  imports: [
    UsuarioRoutingModule,
    SharedModule,
    DragDropModule,
    BEUsuarioPanelModule,
    AUsuarioPanelModule,
    MatSlideToggleModule,
    NgxPaginationModule,
    FormsModule
  ],
  declarations: [
    UsuarioComponent
    
  ]
})
export class UsuarioModule { }
