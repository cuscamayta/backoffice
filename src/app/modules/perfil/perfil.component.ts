import {ChangeDetectionStrategy,Component, Inject, OnInit,ViewEncapsulation} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationInstance} from 'ngx-pagination';

import { SidePanelOverlayService } from '../../shared/side-panel/side-panel-overlay.service';
import { BEPerfilPanelComponent } from './beperfil/borrareditarperfil.component';
import { APerfilPanelComponent } from './aperfil/agregarperfil.component';
import { MatDialog, MatDialogConfig,MatSlideToggle} from '@angular/material';
import { ConfirmarModalComponent } from './../../shared/confirmar-modal/confirmar-modal.component';
import { servicioperfil } from './../../services/servicioperfil';
import { modeloperfil } from './../../model/modperfil';
import { ToastrService } from 'ngx-toastr';
import { serviciopermiso } from './../../services/serviciopermiso';
import { modpermiso } from './../../model/modpermiso';



@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.component.html',
})
export class PerfilComponent implements OnInit{
  public query: any = '';
  permisos:boolean[]=[false,false,false,false,false,false];
  listaperfiles:modeloperfil[]=[];
  perfilactual:modeloperfil;
  inicio:number;
  fin:number;
  totalreg:number;
  listapermisos:modpermiso[]=[];
  

  constructor(private mensajes:ToastrService, private servperfil:servicioperfil, 
    private dialog: MatDialog, private modalService: NgbModal,  
    private servpermisos:serviciopermiso,
    private _overlaySidePanelService: SidePanelOverlayService) {
    this.config.itemsPerPage=5;
    this.inicio=1;
    this.fin=this.config.currentPage*1*this.config.itemsPerPage;
    this.config.currentPage=1;
    this.getPermisos(()=>{});
  }
  
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
};

  ngOnInit(): void {
    
    
    this.getPerfiles(()=>{this.totalreg=this.listaperfiles.length; });
    
    
  }

  getPermisos(cbpermisos){
    
    this.servpermisos.getpermisos()
    .subscribe(
      res => {
        this.listapermisos = res;
        cbpermisos();
        
      });
  }

  getPerfiles(cbperfiles) {
    this.servperfil.getperfiles()
      .subscribe(
        res => {
          this.listaperfiles.length=0;
          res.forEach(element => {this.listaperfiles.push(element),console.log(element);})
          console.log(this.listaperfiles);
          cbperfiles();
        },  
        err => console.error(err)
      );
  }

  filtropermiso(eventofiltro){
    if(eventofiltro.target.value!=null){
      console.log(eventofiltro.target.value);
      this.getPerfilesfiltro(()=>{this.totalreg=this.listaperfiles.length;},eventofiltro.target.value)
    }
    else
      this.getPerfiles(()=>{this.totalreg=this.listaperfiles.length; });
  }

  getPerfilesfiltro(cbperfiles,filtro:number) {
    console.log(filtro);
    this.servperfil.getperfilesfiltro(filtro)
      .subscribe(
        res => {
          this.listaperfiles.length=0;
          res.forEach(element => {this.listaperfiles.push(element),console.log(element);})
          console.log(this.listaperfiles);
          cbperfiles();
        },  
        err => console.error(err)
      );
  }

  actualizarrango(valor){
      this.config.itemsPerPage=parseInt(valor);
      this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
      this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      if (this.config.itemsPerPage*this.config.currentPage>this.listaperfiles.length){
        this.config.currentPage=Math.trunc(this.listaperfiles.length/this.config.itemsPerPage)+1;
        this.inicio=((this.config.currentPage*1)-1)*this.config.itemsPerPage+1;
        this.fin=this.config.currentPage*1*this.config.itemsPerPage;
      }
      console.log(this.inicio);
      console.log(this.config.itemsPerPage);
      console.log(this.fin);
      console.log(this.config);
  }

  selectcheck(id:number) {
    this.getPerfilesfiltro(()=>{},id);
  
  }

  open(contenido) {
    this.modalService.open(contenido);
  }

  openAgregarPerfil() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight='480px';
    dialogConfig.minWidth='750px';
    

      
    const dialogRef = this.dialog.open(APerfilPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          if (data!=null){
            this.perfilactual=data;
            this.listaperfiles.push(this.perfilactual);
            this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " agregado correctamente","Mensaje Informativo")
            }
          }
    );    
  }
  
  HabDesPerfil(idperfil:number,$event){
    console.log($event.checked);
    if ($event.checked){
      
      if (this.servperfil.habilitar(idperfil)) {
        this.listaperfiles.forEach(element=>{
          if (element.idperfil==idperfil){
            element.estadoperfil="S";
            this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " habilitado correctamente","Mensaje Informativo")
            console.log(element.estadoperfil);
            
          }
        })
      }
      
    }
    else{
      if (this.servperfil.deshabilitar(idperfil)) {
        
        this.listaperfiles.forEach(element=>{
          if (element.idperfil==idperfil){
            element.estadoperfil="N";
            this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " deshabilitado correctamente","Mensaje Informativo")
            console.log(element.estadoperfil);
            
          }
        })
      }
    }
    


  }
  openEditarPerfil({idperfil,nombreperfil,descripcionperfil,estadoperfil,
                    fecharegistro,usuarioregistra,fechamodificacion,usuariomodificacion}:modeloperfil) {
    
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data= {idperfil,nombreperfil,descripcionperfil,estadoperfil,
                        fecharegistro,usuarioregistra,fechamodificacion,usuariomodificacion};
    dialogConfig.minHeight='480px';
    dialogConfig.minWidth='750px';
    


    const dialogRef = this.dialog.open(BEPerfilPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data =>{
          if (data!=null){
            this.perfilactual=data;
            var i;
            for(i=0;i<this.listaperfiles.length;i=i+1){
              if(this.listaperfiles[i].idperfil==this.perfilactual.idperfil)
              this.listaperfiles[i]=this.perfilactual;
            }
            console.log(data);
            this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " actualizado correctamente","Mensaje Informativo")
            
          }
        } 
    );    
  }

  openBorrarPerfil(id:number,$event) {
    const dialogConfig = new MatDialogConfig();
    var a;
    $event.stopPropagation();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titulo: 'Mensaje de Advertencia',
      mensaje: '¿Esta seguro que desea borrar el perfil seleccionado?'
    };
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          console.log(data.respuesta);
          if (data.respuesta){
            if (!this.servperfil.borrar(id)){
              this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " no se ha podido borrar","Mensaje Informativo")
              

            }
            else{
              this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " borrado correctamente","Mensaje Informativo")
              this.getPerfiles(()=>{this.totalreg=this.listaperfiles.length; });
            }
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



