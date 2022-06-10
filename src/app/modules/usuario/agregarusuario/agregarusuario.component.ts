import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { modeloperfil } from './../../../model/modperfil';
import { servicioperfil } from './../../../services/servicioperfil';
import { of } from 'rxjs';
import { modelousuario } from './../../../model/modusuario';
import { serviciousuario } from './../../../services/serviciousuario';
import {FormBuilder, Validators, FormGroup, FormArray, FormControl} from "@angular/forms";
import { modpermiso } from '../../../model/modpermiso';
import { modelolistaconsel } from '../../../model/modlistaconsel';
import { servicioperfilpermiso } from '../../../services/servicioperfilpermiso';
import { serviciousuarioperfil } from '../../../services/serviciousuarioperfil';
import { modelousuarioperfil } from '../../../model/modusuarioperfil';
import { ToastrService } from 'ngx-toastr';
import { serviciopermiso } from '../../../services/serviciopermiso';
import { servicioautenticacion } from './../../../services/servicioautenticacion';
import { EspaciosValidator } from '../../../shared/soloespacios';
import { almenosunitem } from '../../../shared/almenosunitem';
import { hoja } from '../../../shared/arbol';




@Component({
  selector: 'app-borrareditarusuario',
  templateUrl: './agregarusuario.component.html',
  styleUrls: ['./agregarusuario.component.scss']
})
export class AUsuarioPanelComponent {
  listaperfiles:modeloperfil[];
  public listapermisos:modpermiso[]=[];
  form: FormGroup;
  load:boolean;
  public listaperfsel:modelolistaconsel[]=[];
  arbolpermisos:hoja[]=[];
  enviado=false;
  
  
  _usuario:modelousuario;

  

  constructor(private mensajes:ToastrService, private dialogRefBE: MatDialogRef<AUsuarioPanelComponent>,
    private servpermisos:serviciopermiso,private servperperf:servicioperfilpermiso,
    private _servusuperf:serviciousuarioperfil,private _serviciousuario:serviciousuario,
    private fb: FormBuilder,private servperfil:servicioperfil,
    private servauten:servicioautenticacion,
    private dialogRef: MatDialogRef<AUsuarioPanelComponent>) { 
    this.listapermisos.length=0;
    this.listapermisos=[];
    this.enviado=false;

    this._usuario=new modelousuario(0,'','','','','','','S','',0,'',0);
    this.form = fb.group({
      usuario: ['', [Validators.required,Validators.maxLength(30),EspaciosValidator.solo]],
      nombre: ['', [Validators.required,Validators.maxLength(50),EspaciosValidator.solo]],
      apellidos: ['', [Validators.required,Validators.maxLength(50),EspaciosValidator.solo]],
      telefono: ['', [Validators.required,Validators.maxLength(20)]],
      direccion: ['', [Validators.required,EspaciosValidator.solo]],
      perfiles: new FormArray([],[Validators.required,almenosunitem()]),
      permisos: new FormArray([]),

     });

      this.load=true;
      setTimeout(()=>{                           
        this.getPermisos(()=>{this.listapermisos.forEach(element =>{
           /* if(element.idpadre==0){
              this.arbolpermisos.push(new hoja(element.idpermiso,element.nombrepermiso,[]))
           }
           else{
             this.arbolpermisos.forEach(arbolhoja=>{
               if(arbolhoja.value==element.idpadre){
                 arbolhoja.agregarhijo(element.idpermiso,element.nombrepermiso);
               }
             })
           } */
           this.permisosFormArray.push(new FormControl(element.estado));
          });}); 
        this.getPerfiles(()=>{this.crealistasel();this.listaperfsel.forEach(element => this.perfilesFormArray.push(new FormControl(element.seleccionado)));this.load=false;});
      }, 1000);  
     
    
    
  }

  get perfilesFormArray() {
    return this.form.controls.perfiles as FormArray;
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
        cbpermisos();
        
      });
  }
  getPerfiles(cbperfiles) {
    this.servperfil.getperfiles()
      .subscribe(
        res => {
          this.listaperfiles = res;
          
          cbperfiles();
        });

    
  }
  
 
  crealistasel(){
    this.listaperfsel.length=0;
    this.listaperfsel=[];
    this.listaperfiles.forEach(elemento =>{
      this.listaperfsel.push(new modelolistaconsel(elemento.idperfil,elemento.nombreperfil,false));
    })
  }


  cambiar(id:number,e){
    this.listaperfsel.forEach(element=>{
      if(element.id==id)
        if (e.target.checked)
            element.seleccionado=true;
          else
          element.seleccionado=false;
        
    })
    this.listapermisos.forEach(element=> element.estado=false);
    this.actualizarpermisos();
    this.listaperfsel.forEach(perfsel=>{
      if(perfsel.seleccionado){
        this.servperperf.getperfilpermisos(perfsel.id).subscribe(perm =>{
          perm.forEach(elementper=>{
            this.listapermisos.forEach(permiso=>{
              if(elementper.idpermiso==permiso.idpermiso){
                permiso.estado=true;

              }
            });
            
          });
          this.actualizarpermisos();
        });
      }
    })
    
    
  }
  
  actualizarpermisos(){
    let index = 0; // or 1 or 2
    while(index<this.listapermisos.length){
      (<FormArray>this.form.controls['permisos']).at(index).patchValue(this.listapermisos[index].estado);
      index=index+1;
    }
  }

  


  public close(valor):void {
    this.dialogRefBE.close(valor);
  }

  grabarcallback(){
    this.grabar(()=>{this.close(this._usuario);})
  }
  public grabar(callback){
    var _usuautenticado:modelousuario;
    var _usuperf:modelousuarioperfil;
    var eliminar:boolean;
    this.enviado=true;
    _usuautenticado=this.servauten.userValue;
    if (this.form.valid) {
      this._usuario.usuarioregistra=_usuautenticado.id;
      this._usuario.login=this.form.value.usuario;
      this._usuario.nombre=this.form.value.nombre;
      this._usuario.apellido=this.form.value.apellidos;
      this._usuario.telefono=this.form.value.telefono;
      this._usuario.correo=this.form.value.direccion;
      this._serviciousuario.agregar(this._usuario).subscribe(datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error("Error al agregar usuario: "+datos.dsMens)
          
        }
        else{
          
          this._usuario=datos.usuario[0];
          
          this.listaperfsel.forEach(elemento=>{
            _usuperf=new modelousuarioperfil(this._usuario.id,elemento.id);
            
              this._servusuperf.agregar(_usuperf).subscribe(datos => {
            
                if(datos.isOk=="N")
                {
                  this.mensajes.error(datos.dsMens)
                  
                }
              })     
                
          })
          
          
        }
       callback(); 
      });
      
      
    }
    else{
      
      return;
    }
    
  }


}
