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
  
  

  constructor(private mensajes:ToastrService,private servpermisos:serviciopermiso, private _servicioperfilpermiso:servicioperfilpermiso,private _servicioperfil:servicioperfil,private fb: FormBuilder,private dialogRef: MatDialogRef<APerfilPanelComponent>) { 
    this.enviado=false;
    this._perfil=new modeloperfil(0,"","","","",0,"",0);
    this.form = fb.group({
      descripcion: ['', Validators.required],
      nombre: ['', Validators.required],
      permisos:new FormArray([]),
      
      
    });
    this.getPermisos(()=>{
      
        
          this.listapermisossel.forEach(permsel=>{
              permsel.estado=false;
          });
        
        this.listapermisossel.forEach(element => this.permisosFormArray.push(new FormControl(element.estado)));
    });
    
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
    _usuautenticado=JSON.parse(localStorage.getItem('usuario'));
    if (this.form.valid) {
      this._perfil.descripcionperfil=this.form.value.descripcion;
      this._perfil.nombreperfil=this.form.value.nombre;
      
      this._perfil.usuarioregistra=_usuautenticado.id;
      this._servicioperfil.agregar(this._perfil).subscribe(datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error(datos.dsMens)
            console.log(datos.dsMens);
          
        }
        else{
          this._perfil=datos.perfil[0];
          this.listapermisossel.forEach(persel=>{
            if (!this.listapermisos.includes(persel))
              this._servicioperfilpermiso.agregar(new modeloperfilpermiso(this._perfil.idperfil,persel.idpermiso)).subscribe(datos=>{
                if(datos.isOk=="N"){
                  this.mensajes.error(datos.dsMens)
                  console.log(datos.dsMens);
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
  
  abrirpop(popover){
    if (popover.isOpen()) {
      
    } else {
      popover.open();
    }
  }
}
