import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AServicioPanelComponent} from './agregarservicio.component';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {SharedModule} from '../../../shared/shared.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule,MatGridListModule,MatCheckboxModule,MatToolbarModule,MatProgressSpinnerModule,MatMenuModule, MatIconModule, MatDialogModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    SharedModule,
    MatSlideToggleModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AServicioPanelComponent
    
    ],
  exports: [AServicioPanelComponent
    
    ],
  entryComponents:[AServicioPanelComponent],
})
export class AServicioPanelModule { }