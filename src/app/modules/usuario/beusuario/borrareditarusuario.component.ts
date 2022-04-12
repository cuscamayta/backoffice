import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef,MatDialogConfig } from '@angular/material';
import { modeloperfil } from './../../../model/modperfil';
import { servicioperfil } from './../../../services/servicioperfil';
import { modelousuario } from './../../../model/modusuario';
import { modelousuarioperfil } from './../../../model/modusuarioperfil';
import { serviciousuario } from './../../../services/serviciousuario';
import {FormBuilder, Validators, FormGroup, FormArray, FormControl} from "@angular/forms";
import { serviciousuarioperfil } from '../../../services/serviciousuarioperfil';
import { modelolistaconsel } from '../../../model/modlistaconsel';
import { modpermiso } from '../../../model/modpermiso';
import { servicioperfilpermiso } from '../../../services/servicioperfilpermiso';
import { ToastrService } from 'ngx-toastr';
import { serviciopermiso } from '../../../services/serviciopermiso';

@Component({
  selector: 'app-borrareditarusuario',
  templateUrl: './borrareditarusuario.component.html',
  styleUrls: ['./borrareditarusuario.component.scss']
})
export class BEUsuarioPanelComponent {
  public listaperfiles:modeloperfil[]=[];
  public listausuarioperfil:modelousuarioperfil[]=[];
  public listapermisos:modpermiso[]=[];
  form: FormGroup;
  
  public listaperfsel:modelolistaconsel[]=[];
  
  idusuario:number;
  _usuario:modelousuario;
  enviado=false;

  constructor(private mensajes:ToastrService,private servperperf:servicioperfilpermiso,private servpermisos:serviciopermiso,private _servusuperf:serviciousuarioperfil,private _serviciousuario:serviciousuario,private fb: FormBuilder,private servperfil:servicioperfil, private dialogRefBE: MatDialogRef<BEUsuarioPanelComponent>, private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) {id,login,nombre,apellido,telefono,correo,estado,primeravez,fechamodificacion,usuariomodifica,fecharegistro,usuarioregistra}:modelousuario) { 
    this.listapermisos.length=0;
    this.listapermisos=[];
    this.enviado=false;
    this.idusuario=id;
    this.form = fb.group({
      usuario: [login, Validators.required],
      nombre: [nombre, Validators.required],
      apellidos: [apellido, Validators.required],
      telefono: [telefono, Validators.required],
      direccion: [correo, Validators.required],
      perfiles: new FormArray([]),
      permisos: new FormArray([]),
      
     });
    this._usuario=new modelousuario(id,login,nombre,apellido,telefono,correo,estado,primeravez,fechamodificacion,usuariomodifica,fecharegistro,usuarioregistra);
    this.getPermisos(()=>{this.listapermisos.forEach(element => this.permisosFormArray.push(new FormControl(element.estado)));}); 
    this.getPerfiles(()=>{this.crealistasel();});
    
      
    
    
    
    
    
    
     
  }

  get perfilesFormArray() {
    return this.form.controls.perfiles as FormArray;
  }

  get permisosFormArray() {
    return this.form.controls.permisos as FormArray;
  }
  get f() { return this.form.controls; }

  getUsuarioPerfiles(vvIdUsuario:number,cbusuarioperfiles) {
    
    this.listausuarioperfil.length=0;
    this._servusuperf.getusuarioperfiles(vvIdUsuario).subscribe( datos =>{
      this.listausuarioperfil=datos;
      
      var i,j

      for(i=0;i<this.listausuarioperfil.length;i=i+1){
        
        for(j=0;j<this.listaperfsel.length;j=j+1){

            if(this.listausuarioperfil[i].idperfil==this.listaperfsel[j].id){
            this.listaperfsel[j].seleccionado=true;
            }
        }
      } 
      console.log(this.listaperfsel);
      this.listausuarioperfil.forEach(element=> {
          this.servperperf.getperfilpermisos(element.idperfil).subscribe(perm=>{
            perm.forEach(elementper=>{
              this.listapermisos.forEach(permiso=>{
                if(elementper.idpermiso==permiso.idpermiso){
                  permiso.estado=true;
                }
              });
              
            });

            this.actualizarpermisos();
            
          });
      });
      cbusuarioperfiles();
    });
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
          this.listaperfiles = res;
          console.log(this.listaperfiles);
          cbperfiles();
        });

    
  }

  crealistasel(){
    this.listaperfsel.length=0;
    this.listaperfsel=[];
    this.listaperfiles.forEach(elemento =>{
      this.listaperfsel.push(new modelolistaconsel(elemento.idperfil,elemento.nombreperfil,false));
    })
    console.log(this.listaperfsel);
    this.getUsuarioPerfiles(this._usuario.id,()=>{this.listaperfsel.forEach(element => this.perfilesFormArray.push(new FormControl(element.seleccionado))); console.log(this.listaperfsel);});
    
  }
 
   
  cambiar(id:number,e){
    console.log(this.listaperfsel);
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
  public grabarcallback(){
    this.grabar(()=>{this.close(this._usuario)})
  }
  public grabar(callback){
    var _usuautenticado:modelousuario;
    var _usuperf:modelousuarioperfil;
    var eliminar:boolean;
    this.enviado=true;
    _usuautenticado=JSON.parse(localStorage.getItem('usuario'));
    if (this.form.valid) {
      
      this._usuario.login=this.form.value.usuario;
      this._usuario.nombre=this.form.value.nombre;
      this._usuario.apellido=this.form.value.apellidos;
      this._usuario.telefono=this.form.value.telefono;
      this._usuario.correo=this.form.value.direccion;
      this._usuario.usuariomodifica=_usuautenticado.id;
      this._serviciousuario.actualizar(this._usuario,this._usuario.login).subscribe(datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error(datos.dsMens)
            console.log(datos.dsMens);
          
        }
        else{
          
          this._usuario=datos.usuario[0];
          
          this.listaperfsel.forEach(elemento=>{
            _usuperf=new modelousuarioperfil(this._usuario.id,elemento.id);
            if (!this.listausuarioperfil.includes(_usuperf))
              this._servusuperf.agregar(_usuperf).subscribe(datos => {
            
                if(datos.isOk=="N"){
                  this.mensajes.error(datos.dsMens)
                  console.log(datos.dsMens);
                }
                
              })     
                
          })
          this.listausuarioperfil.forEach(datos=>{
            eliminar=true;
            this.listaperfsel.forEach(persel=>{
  
              if(datos.idperfil==persel.id)
                 eliminar=false;
            })
            if(eliminar)
               this._servusuperf.borrar(this._usuario.id,datos.idperfil).subscribe(datos => {
            
                if(datos.isOk=="N"){
                  this.mensajes.error(datos.dsMens)
                  console.log(datos.dsMens);
                }
              }) ;
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
