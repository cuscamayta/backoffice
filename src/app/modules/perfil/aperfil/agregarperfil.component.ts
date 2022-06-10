import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';

import { MatDialogConfig, MatDialogRef } from '@angular/material';
import { modeloperfil } from './../../../model/modperfil';
import { servicioperfil } from './../../../services/servicioperfil';
import {FormBuilder, Validators, FormGroup, FormArray, FormControl} from "@angular/forms";
import { modeloperfilpermiso } from './../../../model/modperfilpermiso';
import { servicioperfilpermiso } from './../../../services/servicioperfilpermiso';
import { modpermiso } from './../../../model/modpermiso';
import { serviciopermiso } from './../../../services/serviciopermiso';
import { ToastrService } from 'ngx-toastr';
import { modelousuario } from './../../../model/modusuario';
import { servicioautenticacion } from './../../../services/servicioautenticacion';
import { EspaciosValidator } from '../../../shared/soloespacios';

@Component({
  selector: 'app-agregarperfil',
  templateUrl: './agregarperfil.component.html',
  styleUrls: ['./agregarperfil.component.scss']
})
export class APerfilPanelComponent{
  form:FormGroup;
  closeResult = '';
  enviado=false;
  listapermisos:modpermiso[]=[];
  listapermisossel:modpermiso[]=[];
  _perfil:modeloperfil;
  _perfilpermisos:modeloperfilpermiso[];
  load:boolean;
  

  constructor(private mensajes:ToastrService,private servpermisos:serviciopermiso, 
    private _servicioperfilpermiso:servicioperfilpermiso,private _servicioperfil:servicioperfil,
    private servauten:servicioautenticacion,
    private fb: FormBuilder,private dialogRef: MatDialogRef<APerfilPanelComponent>) { 
    this.enviado=false;
    this._perfil=new modeloperfil(0,"","","","",0,"",0);
    this.form = fb.group({
      descripcion: ['', [Validators.required,Validators.maxLength(50),EspaciosValidator.solo]],
      nombre: ['', [Validators.required,Validators.maxLength(30),EspaciosValidator.solo]],
      permisos:new FormArray([]),
      
      
    });
    this.load=true;
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.getPermisos(()=>{
      
        
        this.listapermisossel.forEach(permsel=>{
            permsel.estado=false;
        });
      
      this.listapermisossel.forEach(element => this.permisosFormArray.push(new FormControl(element.estado)));
      this.load=false;
    });
    }, 1000);
    
    
  }

  get permisosFormArray() {
    return this.form.controls.permisos as FormArray;
  }

  get f() { return this.form.controls; }

  getPermisos(cbpermisos){
    
    this.servpermisos.getpermisos()
    .subscribe(
      res => {
        this.listapermisos = res;
        this.listapermisossel=res;
        cbpermisos();
        
      });
  }

  close(valor):void {
    this.dialogRef.close(valor);
  }

  
  
  public grabarcallback(){
    this.grabar(()=>{this.close(this._perfil);})
  }
  public grabar(cbgrabar){
    var _usuautenticado:modelousuario;
    this.enviado=true;
    _usuautenticado=this.servauten.userValue;
    if (this.form.valid) {
      this._perfil.descripcionperfil=this.form.value.descripcion.trim();
      this._perfil.nombreperfil=this.form.value.nombre.trim();
      
      this._perfil.usuarioregistra=_usuautenticado.id;
      this._servicioperfil.agregar(this._perfil).subscribe(datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error("Error al agregar un nuevo perfil: "+datos.dsMens)
            
          
        }
        else{
          this._perfil=datos.perfil[0];
          this.listapermisossel.forEach(persel=>{
            if (!this.listapermisos.includes(persel))
              this._servicioperfilpermiso.agregar(new modeloperfilpermiso(this._perfil.idperfil,persel.idpermiso)).subscribe(datos=>{
                if(datos.isOk=="N"){
                  this.mensajes.error(datos.dsMens)
                  
                }
              });
            
          });
          cbgrabar();
        }
        
      });
      
    }
    else{
      return;
    }
    
  }  
  
  cambiopermisopadre(id:number,evento){
     var valor=false;
     console.log("entro al evento de consola"+id+evento.value);
     this.listapermisossel.forEach(elemento=>{
       if(elemento.idpermiso==id){
         valor=!elemento.estado;
         elemento.estado=valor;
       }
       if(elemento.idpadre==id){
         elemento.estado=valor;
       }
     })
     // actualizar pantalla con los valores del padre
     let index = 0; 
     for(index=0;index<this.listapermisossel.length;index=index+1){
        (<FormArray>this.form.controls['permisos']).at(index).patchValue(this.listapermisossel[index].estado);
     }  
  }



  abrirpop(popover){
    if (popover.isOpen()) {
      
    } else {
      popover.open();
    }
  }
}
