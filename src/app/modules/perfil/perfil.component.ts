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
import { modelohabilitado } from './../../model/modHabilitado';
import { isEmpty } from 'rxjs/operators';



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
  load:boolean;
  opciones:modelohabilitado[]=[];
  

  constructor(private mensajes:ToastrService, private servperfil:servicioperfil, 
    private dialog: MatDialog, private modalService: NgbModal,  
    private servpermisos:serviciopermiso,
    private _overlaySidePanelService: SidePanelOverlayService) {
    this.config.itemsPerPage=5;
    this.inicio=1;
    this.fin=this.config.currentPage*1*this.config.itemsPerPage;
    this.config.currentPage=1;
    this.opciones.push(new modelohabilitado("S","Habilitado"));
    this.opciones.push(new modelohabilitado("N","DesHabilitado"));
    /* this.getPermisos(()=>{}); */
  }
  
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
};

  ngOnInit(): void {
    
    this.load=true;
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.getPerfiles(()=>{ this.totalreg=this.listaperfiles.length; this.load=false; });
    }, 1000);
    
    
    
  }

  setDelay(times) {
    if (times.length > 0) {
      // Remove the first time from the array
      let wait = times.shift();
      
      // Wait for the given amount of time
      setTimeout(() => {
          // Call the setDelay function again with the remaining times
          this.setDelay(times);
      }, wait);
    }
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
    this.listaperfiles=JSON.parse(localStorage.getItem('perfiles'));
    if(this.listaperfiles==null){
      this.servperfil.getperfiles()
        .subscribe(
          res => {
            this.listaperfiles.length=0;
            res.forEach(element => {this.listaperfiles.push(element);})
            
            cbperfiles();
          },  
          err => console.error(err)
        );
    }
    else{

      cbperfiles();
    }
  }

  filtro(id){
    console.log(id);
    if(id!=null&&id!=undefined){
      
      this.getPerfilesfiltro(()=>{this.totalreg=this.listaperfiles.length;},id)
    }
    else
      this.getPerfiles(()=>{this.totalreg=this.listaperfiles.length; });
  }

  

  getPerfilesfiltro(cbperfiles,filtro:string) {
    
    this.servperfil.getperfilesfiltro(filtro)
      .subscribe(
        res => {
          this.listaperfiles.length=0;
          res.forEach(element => {this.listaperfiles.push(element);})
          
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
            localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));
            this.mensajes.success("Perfil "+this.perfilactual.nombreperfil + " agregado correctamente","Mensaje Informativo")
            this.totalreg=this.listaperfiles.length;
            }
          }
    );    
  }
  
  HabDesPerfil(idperfil:number,$event){
    
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if ($event.checked){
      dialogConfig.data = {
        titulo: 'Mensaje de Advertencia',
        mensaje: '¿Esta seguro que desea habilitar el perfil seleccionado?'
      };
    }
    else{
      dialogConfig.data = {
        titulo: 'Mensaje de Advertencia',
        mensaje: '¿Esta seguro que desea deshabilitar el perfil seleccionado?'
      };
    }
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
          
          if (data.respuesta){
            if ($event.checked){
      
              this.Habilitar(()=>{localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));},idperfil,$event);
                
              
              
            }
            else{
              this.DesHabilitar(()=>{localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));},idperfil,$event);
              
            }
            
          }
          else{
            let matSlideToggle: MatSlideToggle = $event.source;
            matSlideToggle.toggle();
          }
        }
        
    );   
    

  }

  Habilitar(cbperfiles,id:number,$event) {
    
    this.servperfil.habilitar(id)
      .subscribe(
        res => {
          
            if (res.isOk="S"){
              this.listaperfiles.forEach(element=>{
                if (element.idperfil==id){
                  element.estadoperfil="S";
                  this.mensajes.success("Perfil "+element.nombreperfil + " habilitado correctamente","Mensaje Informativo")
                  
                  
                }
              })
            }
            else{
              this.listaperfiles.forEach(element=>{
                if (element.idperfil==id){
                  element.estadoperfil="N";
                  this.mensajes.error("Perfil "+element.nombreperfil + " no ha posido ser habilitado ("+res.dsMens+")","Mensaje Informativo")
                  let matSlideToggle: MatSlideToggle = $event.source;
                  matSlideToggle.toggle();
                }
              })
            }
          
          cbperfiles();
        },  
        err => this.listaperfiles.forEach(element=>{
                if (element.idperfil==id){
                  element.estadoperfil="N";
                  this.mensajes.error(err,"Mensaje Informativo");
                  let matSlideToggle: MatSlideToggle = $event.source;
                  matSlideToggle.toggle();
                }
        })
        
      );
  }
  
  DesHabilitar(cbperfiles,id:number,$event) {
    
    this.servperfil.deshabilitar(id)
      .subscribe(
        res => {
          
          if (res.isOk="S"){
            this.listaperfiles.forEach(element=>{
              if (element.idperfil==id){
                element.estadoperfil="N";
                this.mensajes.success("Perfil "+element.nombreperfil + " deshabilitado correctamente","Mensaje Informativo")
                
                
              }
            })
          }
          else{
            this.listaperfiles.forEach(element=>{
              if (element.idperfil==id){
                element.estadoperfil="S";
                this.mensajes.error("Perfil "+element.nombreperfil + " no ha posido ser deshabilitado ("+res.dsMens+")","Mensaje Informativo")
                let matSlideToggle: MatSlideToggle = $event.source;
                  matSlideToggle.toggle();
              }
            })
          }
          
          cbperfiles();
        },  
        err => this.listaperfiles.forEach(element=>{
                if (element.idperfil==id){
                  element.estadoperfil="S";
                  this.mensajes.error(err,"Mensaje Informativo");
                  let matSlideToggle: MatSlideToggle = $event.source;
                  matSlideToggle.toggle();
                }
        })
        
      );
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
            localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));
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
          
          if (data.respuesta){
            this.Borrar(()=>{localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));},id);
          }
        }
        
    );    
    
  }  

  Borrar(cbperfiles,id:number) {
    
    this.servperfil.borrar(id)
      .subscribe(
        res => {
          if (res.isOk="S"){
            var i=0;
            this.listaperfiles.forEach(element=>{
              if (element.idperfil==id){
                this.listaperfiles.splice(i,1);
                this.mensajes.success("Perfil "+element.nombreperfil + " borrado correctamente","Mensaje Informativo")
              
              }
              i=i+1;
            })
          }
          else{
            this.listaperfiles.forEach(element=>{
              if (element.idperfil==id){
                this.mensajes.error("Perfil "+element.nombreperfil + " no ha posido ser borrado ("+res.dsMens+")","Mensaje Error")
              }
            })
          }
          
          cbperfiles();
        },  
        err => this.listaperfiles.forEach(element=>{
              if (element.idperfil==id){
                this.mensajes.error("Perfil "+element.nombreperfil + " no ha posido ser borrado","Mensaje Error")
              }
        })
      );
  }

  abrirpop(popover){
    if (popover.isOpen()) {
      
    } else {
      popover.open();
    }
  }
}



