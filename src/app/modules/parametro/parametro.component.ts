import {ChangeDetectionStrategy,Component, Inject, OnInit,ViewEncapsulation} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationInstance} from 'ngx-pagination';

import { SidePanelOverlayService } from '../../shared/side-panel/side-panel-overlay.service';
import { BEParametroPanelComponent } from './beparametro/borrareditarparametro.component';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { ConfirmarModalComponent } from './../../shared/confirmar-modal/confirmar-modal.component';
import { servicioparametro } from './../../services/servicioparametro';
import { modeloparametro } from './../../model/modparametro';
import { observable,of } from 'rxjs';


@Component({
  selector: 'app-parametro',
  templateUrl: 'parametro.component.html',
  encapsulation:ViewEncapsulation.None,
  providers: [NgbModal],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParametroComponent implements OnInit{
  public query: any = '';
  listaparametros:modeloparametro[];
  parametroactual:modeloparametro;
  inicio:number;
  fin:number;
  totalreg:number;
  

  constructor(private servparametro:servicioparametro, private dialog: MatDialog, private modalService: NgbModal) {
    this.config.itemsPerPage=5;
    this.inicio=1;
    this.fin=this.config.currentPage*1*this.config.itemsPerPage;
    this.config.currentPage=1;
  }
  
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 1,
    currentPage: 1
};

  ngOnInit(): void {
    
    
    this.getParametros();
    
    this.totalreg=this.listaparametros.length; 
  }

  getParametros() {
    of(this.servparametro.getparametros())
      .subscribe(
        res => {
          this.listaparametros = res;
          26
        },  
        err => console.error(err)
      );
  }

  actualizarrango(valor){
      this.config.itemsPerPage=parseInt(valor);
      this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
      this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      if (this.config.itemsPerPage*this.config.currentPage>this.listaparametros.length){
        this.config.currentPage=Math.trunc(this.listaparametros.length/this.config.itemsPerPage)+1;
        this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
        this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      }
      
  }

  open(contenido) {
    this.modalService.open(contenido);
  }

  openEditarParametro({id,parametro,valor,descripcion}:modeloparametro) {
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data= {id,parametro,valor,descripcion};
    dialogConfig.minHeight='480px';
    dialogConfig.minWidth='700px';
    


    const dialogRef = this.dialog.open(BEParametroPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {}
    );    
  }

  

}



