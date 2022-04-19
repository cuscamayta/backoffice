import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardDefaultRoutingModule } from './dashboard-default-routing.module';
import { DashboardDefaultComponent } from './dashboard-default.component';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardDefaultRoutingModule,
    SharedModule,
    
  ],
  declarations: [DashboardDefaultComponent]
})
export class DashboardDefaultModule { }
