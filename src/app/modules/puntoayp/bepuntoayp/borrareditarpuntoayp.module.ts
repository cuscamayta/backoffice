import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BEPuntoaypPanelComponent} from './borrareditarpuntoayp.component';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {SharedModule} from '../../../shared/shared.module';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4iDjmkRljIqVOHyK-fvY8xxW13yb8CFE'
    })
  ],
  declarations: [BEPuntoaypPanelComponent],
  exports: [BEPuntoaypPanelComponent],
  entryComponents:[BEPuntoaypPanelComponent],
  providers:[]
})
export class BEPuntoaypPanelModule { }