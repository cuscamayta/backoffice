import {ChangeDetectionStrategy,Component, Inject, OnInit,ViewEncapsulation} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationInstance} from 'ngx-pagination';

import { SidePanelOverlayService } from '../../shared/side-panel/side-panel-overlay.service';
import { BEPuntoaypPanelComponent } from './bepuntoayp/borrareditarpuntoayp.component';
import { APuntoaypPanelComponent } from './apuntoayp/agregarpuntoayp.component';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { ConfirmarModalComponent } from './../../shared/confirmar-modal/confirmar-modal.component';
import { serviciopuntoayp } from './../../services/serviciopuntoayp';
import { modelopuntoayp } from './../../model/modpuntoayp';
import { observable,of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-puntoayp',
  templateUrl: 'puntoayp.component.html',
  
})
export class PuntoaypComponent implements OnInit{
  public query: any = '';
  servicios:boolean[]=[false,false];
  listapuntosayp:modelopuntoayp[]=[];
  puntoaypactual:modelopuntoayp;
  inicio:number;
  fin:number;
  totalreg:number;
  load:boolean;
  

  constructor(private servpuntoayp:serviciopuntoayp, 
    private mensajes:ToastrService,
    private dialog: MatDialog, private modalService: NgbModal,  
    private _overlaySidePanelService: SidePanelOverlayService) {
    this.config.itemsPerPage=5;
    this.inicio=1;
    this.fin=this.config.currentPage*1*this.config.itemsPerPage;
    this.config.currentPage=1;

  }
  
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
};

  ngOnInit(): void {
    
    this.load=true;
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.getPuntosayp(()=>{this.totalreg=this.listapuntosayp.length;this.load=false; });
    }, 1000);
    
    
    
  }

  getPuntosayp(cbpuntos) {
    this.servpuntoayp.getpuntoayps().subscribe(datos =>{
      
      this.listapuntosayp.length=0;
      datos.forEach(element =>{ this.listapuntosayp.push(element);
      })
      cbpuntos();
    });  
  }

  actualizarrango(valor){
      this.config.itemsPerPage=parseInt(valor);
      this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
      this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      if (this.config.itemsPerPage*this.config.currentPage>this.listapuntosayp.length){
        this.config.currentPage=Math.trunc(this.listapuntosayp.length/this.config.itemsPerPage)+1;
        this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
        this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      }
      
  }

  selectcheck(id:number) {
    
    this.servicios[id-1]=!this.servicios[id-1];
   
  }

  open(contenido) {
    this.modalService.open(contenido);
  }

  openAgregarPuntoayp() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight='480px';
    dialogConfig.minWidth='700px';
    

      
    const dialogRef = this.dialog.open(APuntoaypPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data!=null){
          this.puntoaypactual=data;
          this.listapuntosayp.push(this.puntoaypactual);
          
          this.mensajes.success("Punto de Atención y Pago "+this.puntoaypactual.nombre + " agregado correctamente","Mensaje Informativo")
        }
      }
    );    
    }
  openEditarPuntoayp({idpunto,nombre,direccion,idtipo,tipo,latitud,longitud}:modelopuntoayp) {
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data= {idpunto,nombre,direccion,idtipo,tipo,latitud,longitud};
    dialogConfig.minHeight='480px';
    dialogConfig.minWidth='700px';
    


    const dialogRef = this.dialog.open(BEPuntoaypPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data!=null){
          this.puntoaypactual=data;
          var i;
          for(i=0;i<this.listapuntosayp.length;i=i+1){
            if(this.listapuntosayp[i].idpunto==this.puntoaypactual.idpunto)
            this.listapuntosayp[i]=this.puntoaypactual;
          }
          
          this.mensajes.success("Punto de Atención y Pago "+this.puntoaypactual.nombre + " actualizado correctamente","Mensaje Informativo")
          
        }
        
      }
    );  
        
  }

  openBorrarPuntoayp(id:number,$event) {
    const dialogConfig = new MatDialogConfig();
    var a;
    $event.stopPropagation();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titulo: 'Mensaje de Advertencia',
      mensaje: '¿Esta seguro que desea borrar el punto de atención o pagos seleccionado?'
  };
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          
          if (data.respuesta){
            if (!this.servpuntoayp.borrar(id)){
              this.mensajes.error("El punto de atención o pago no se ha podido borrar","Mensaje de Advertencia");

            }
            else{
              
              this.getPuntosayp(()=>{this.totalreg=this.listapuntosayp.length;});
            }
          }
        }
        
    );    
    
  }  

}



