
import { BrowserModule } from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layout/admin/title/title.component';
import { AuthComponent } from './layout/auth/auth.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { SidePanelOverlayModule} from './shared/side-panel/side-panel-overlay.module';
import {SidePanelOverlayService} from './shared/side-panel/side-panel-overlay.service';
import { MatCardModule } from '@angular/material/card';
import { ConfirmarModalModule } from './shared/confirmar-modal/confirmar-modal.module';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ChangePassComponent } from './modules/auth/changepass/changepass.component';
import 'rxjs/add/operator/mergeMap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
    ChangePassComponent,
    

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    NgbModule,
    DragDropModule,
    SidePanelOverlayModule,    
    MatCardModule,
    ConfirmarModalModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC4iDjmkRljIqVOHyK-fvY8xxW13yb8CFE'
    })
  ],
  exports: [ SharedModule,FormsModule
    ],
  entryComponents:[ChangePassComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA  ],
    
  providers: [ SidePanelOverlayService,
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
