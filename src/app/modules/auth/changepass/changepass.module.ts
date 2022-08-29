import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePassComponent} from './changepass.component';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {SharedModule} from '../../../shared/shared.module';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,

  ],
  declarations: [],
  exports: [],
  entryComponents:[],
  providers:[]
})
export class ChangePassModule { }