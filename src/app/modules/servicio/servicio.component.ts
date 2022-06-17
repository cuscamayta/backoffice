import {Component, Inject, OnInit,ViewEncapsulation} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SidePanelOverlayService } from '../../shared/side-panel/side-panel-overlay.service';
import { BEServicioPanelComponent } from './beservicio/borrareditarservicio.component';
import { MatDialogConfig } from '@angular/material';
import { ConfirmarModalComponent } from '../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { serviciorequisito } from '../../../app/services/serviciorequisito';
import { modelorequisito } from '../../../app/model/modrequisito';
import { ToastrService } from 'ngx-toastr';
import { AServicioPanelComponent } from './agservicio/agregarservicio.component';

@Component({
  selector: 'app-servicio',
  templateUrl: 'servicio.component.html',
  styleUrls: ['servicio.component.scss'],
  encapsulation:ViewEncapsulation.None,
  providers: [NgbModal]
})
export class ServicioComponent implements OnInit{
  public query: any = '';
  requisitoactual:modelorequisito;
  listaservicio:modelorequisito[]=[];
  load:boolean;

  constructor(private mensajes:ToastrService,private servreq:serviciorequisito,
    
    private dialog: MatDialog, private modalService: NgbModal,private _overlaySidePanelService: SidePanelOverlayService) {
    
  }

  ngOnInit(): void {
    this.load=true;
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.getRequisitos(()=>{ this.load=false; });
    }, 1000);
    
  }

  getRequisitos(cbRequisitos) {
    this.servreq.getrequisitos().subscribe(datos =>{
      
      this.listaservicio.length=0;
      console.log(this.listaservicio);
      datos.forEach(element =>{ this.listaservicio.push(element);
      })
      cbRequisitos();
    });  
       
        
    
    
    
    
  }
  openDialog(idreq:number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
        titulo: '¿Esta Seguro?',
        mensaje: 'Borrar el Servicio no se puede revertir'
    };

      
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => { 
          
          if (data.respuesta){
            if (!this.servreq.borrar(idreq)){
              this.mensajes.error("El servicio no se ha podido borrar","Mensaje de Advertencia")

            }
            else{
              var i=0;
              this.listaservicio.forEach(elem=>{
                if(elem.idrequisito==idreq){
                  this.listaservicio.splice(i,1);
                }
                i=i+1;
              })
            }
          }
        }
    );    
  }
   
  public openagregarservicio():void {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.scrollStrategy
  
      
  
        
      const dialogRef = this.dialog.open(AServicioPanelComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(
        data => {
          if (data!=null){
            this.requisitoactual=data;
            this.listaservicio.push(this.requisitoactual)
            
            this.mensajes.success("Usuario "+this.requisitoactual.nombrerequisito + " agregado correctamente","Mensaje Informativo")
            
          }
          
        }
      );    
    }

  public openeditarservicio({idrequisito,nombrerequisito,estadorequisito
    ,usuarioregistra,fecharegistro,usuariomodifica,fechamodificacion,idimagen
  ,nombreimagen,imagenfisica,ancho,alto}:modelorequisito):void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data= {idrequisito,nombrerequisito,estadorequisito
      ,usuarioregistra,fecharegistro,usuariomodifica,fechamodificacion,idimagen
    ,nombreimagen,imagenfisica,ancho,alto};
    dialogConfig.scrollStrategy

    

      
    const dialogRef = this.dialog.open(BEServicioPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        
        if (data!=null){
          this.requisitoactual=data;
          var i;
          for(i=0;i<this.listaservicio.length;i=i+1){
            if(this.listaservicio[i].idrequisito==this.requisitoactual.idrequisito)
            this.listaservicio[i]=this.requisitoactual;
          }
          
          this.mensajes.success("Usuario "+this.requisitoactual.nombrerequisito + " actualizado correctamente","Mensaje Informativo")
          
        }
        
      }
    );    
  }

  abrirpop(popover){
    if (popover.isOpen()) {
      
    } else {
      popover.open();
    }
  }

  
  
  

}



