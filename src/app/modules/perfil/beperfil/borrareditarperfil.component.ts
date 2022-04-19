import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { MatDialogConfig,MatDialogRef } from '@angular/material';
import { modeloperfil } from './../../../model/modperfil';
import { modeloperfilpermiso } from './../../../model/modperfilpermiso';
import { servicioperfil } from './../../../services/servicioperfil';
import { servicioperfilpermiso } from './../../../services/servicioperfilpermiso';
import {FormBuilder, Validators, FormGroup, FormArray, FormControl} from "@angular/forms";
import { modpermiso } from './../../../model/modpermiso';
import { serviciopermiso } from './../../../services/serviciopermiso';
import { ToastrService } from 'ngx-toastr';
import { modelousuario } from './../../../model/modusuario';
import { servicioautenticacion } from './../../../services/servicioautenticacion';


@Component({
  selector: 'app-borrareditarperfil',
  templateUrl: './borrareditarperfil.component.html',
  styleUrls: ['./borrareditarperfil.component.scss']
})
export class BEPerfilPanelComponent implements OnInit{
  form: FormGroup;
  
  closeResult = '';
  idperfil:number;
  _perfil:modeloperfil;
  _perfilpermisos:modeloperfilpermiso[]=[];
  enviado=false;
  listapermisos:modpermiso[]=[];
  listapermisossel:modpermiso[]=[];

  constructor(private mensajes:ToastrService,private servpermisos:serviciopermiso,
    private _servicioperfilpermiso:servicioperfilpermiso,private _servicioperfil:servicioperfil,
    private servauten:servicioautenticacion,
    private fb: FormBuilder,private dialogrefp:MatDialogRef<BEPerfilPanelComponent>,@Inject(MAT_DIALOG_DATA) {idperfil,nombreperfil,descripcionperfil,estadoperfil,fecharegistro,usuarioregistra,fechamodificacion,usuariomodificacion}:modeloperfil) { 
    this.enviado=false;
    this.idperfil=idperfil;
    this.listapermisos.length=0;
    this.listapermisos=[];
    this.listapermisossel.length=0;
    this.listapermisossel=[];
    this._perfil=new modeloperfil(idperfil,nombreperfil,descripcionperfil,estadoperfil,fecharegistro,usuarioregistra,fechamodificacion,usuariomodificacion);
    
    
    this.form = fb.group({
      descripcion: [descripcionperfil, Validators.required],
      nombre: [nombreperfil, Validators.required],
      permisos:new FormArray([]),
      
    });
    this.getPermisos(()=>{
      this.traerpermisosperfil(()=>{
        for (var i = 0; i < this._perfilpermisos.length; i++){
          // aqui se puede referir al objeto con arreglo[i];
          this.listapermisos.forEach(perm=>{
            if (perm.idpermiso==this._perfilpermisos[i].idpermiso)
            {
              perm.estado=true;
            }
          })
          this.listapermisossel.forEach(permsel=>{
            if (permsel.idpermiso==this._perfilpermisos[i].idpermiso)
            {
              permsel.estado=true;
            }
          })
        }
        this.listapermisossel.forEach(element => this.permisosFormArray.push(new FormControl(element.estado)));
      });
    });
    
  }

  get permisosFormArray() {
    return this.form.controls.permisos as FormArray;
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    
    
    
    
  }

  getPermisos(cbpermisos){
    
    this.servpermisos.getpermisos()
    .subscribe(
      res => {
        this.listapermisos = res;
        this.listapermisossel=res;
        cbpermisos();
        
      });
  }
  traerpermisosperfil(cbperper){
    this._servicioperfilpermiso.getperfilpermisos(this.idperfil).subscribe(datos=>{
      this._perfilpermisos=datos;
      cbperper();
    });
    
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  public close(valor):void {
    this.dialogrefp.close(valor);
  }
  public grabarcallback(){
    this.grabar(()=>{this.close(this._perfil);})
  }
  public grabar(cbgrabar){
    var _usuautenticado:modelousuario;
    this.enviado=true;
    _usuautenticado=this.servauten.userValue;
    if (this.form.valid) {
      this._perfil.descripcionperfil=this.form.value.descripcion;
      this._perfil.nombreperfil=this.form.value.nombre;
      
      this._perfil.usuariomodificacion=_usuautenticado.id;
      this._servicioperfil.actualizar(this._perfil).subscribe(datos=>
      {
        console.log(datos);
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
          this.listapermisos.forEach(per=>{
            if (!this.listapermisossel.includes(per))
              this._servicioperfilpermiso.borrar(this._perfil.idperfil,per.idpermiso).subscribe(datos2=>{
                if(datos2.isOk=="N"){
                  this.mensajes.error(datos.dsMens)
                  console.log(datos.dsMens);
                }
              });
            
          })
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
