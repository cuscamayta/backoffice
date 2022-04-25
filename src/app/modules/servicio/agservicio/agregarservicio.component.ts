import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { serviciorequisito } from '../../../../app/services/serviciorequisito';
import {FormBuilder, Validators, FormGroup, FormArray, FormControl} from "@angular/forms";
import { modeloimagen, modeloimagenTotal, modelorequisito } from '../../../model/modrequisito';
import { serviciousuario } from '../../../../app/services/serviciousuario';
import { servicioautenticacion } from '../../../../app/services/servicioautenticacion';
import { modelousuario } from 'src/app/model/modusuario';
@Component({
  selector: 'app-agregarservicio',
  templateUrl: './agregarservicio.component.html',
  styleUrls: ['./agregarservicio.component.scss']
})
export class AServicioPanelComponent implements OnInit{
  estado='Habilitado';
  configurar='Configurar Enlaces';  
  form: FormGroup;
  enviado:boolean=false;
  _usuautenticado:modelousuario;
  public listadetalleimagen:modeloimagen[]=[new modeloimagen(0,"","",0,0),new modeloimagen(0,"","",0,0),
                                new modeloimagen(0,"","",0,0),new modeloimagen(0,"","",0,0)];
  public listadetalleimagenrec:modeloimagen[]=[];
  
  
  _requisito:modelorequisito;
  constructor(private mensajes:ToastrService,private servreq:serviciorequisito,
    private servaut:servicioautenticacion,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AServicioPanelComponent>) { 
      this.form = fb.group({
        
        nombre: ['', Validators.required],
        idimagen: ['0',],
        estado: [0, ],
        
       });
       this._usuautenticado=this.servaut.userValue;
      this._requisito=new modelorequisito(0,"",""
        ,"",this._usuautenticado.id,"",this._usuautenticado.id,0
        ,"","",0,0);
        
    }


  ngOnInit(): void {
    
  }

  imagen(id:number){
    const fileUplodad=document.getElementById('File'+id.toString()) as HTMLInputElement;
    console.log(this.listadetalleimagen[id]);
    fileUplodad.onchange = ()=> {
      const file=fileUplodad.files[0];
          var reader = new FileReader();
          reader.onload = (event:any) => {
            if(this.listadetalleimagen[id].idimagen==0){
              this.listadetalleimagen[id].idimagen=-1;
            }
            this.listadetalleimagen[id].imagenfisica=event.target.result.toString().slice(23,event.target.result.toString().length);
            this.listadetalleimagen[id].nombreimagen=file.name;
              
          }
          reader.readAsDataURL(file);
          
    }

    fileUplodad.click();
  }

  imagenportada(){
    const fileUplodad=document.getElementById('imagenportada') as HTMLInputElement;
    
    fileUplodad.onchange = ()=> {
      const file=fileUplodad.files[0];
          var reader = new FileReader();
          reader.onload = (event:any) => {
            if(this._requisito.idimagen==0){
              this._requisito.idimagen=-1;
            }
            this._requisito.imagenfisica=event.target.result.toString().slice(23,event.target.result.toString().length);
            this._requisito.nombreimagen=file.name;
              
          }
          reader.readAsDataURL(file);
          
    }

    fileUplodad.click();
  }


  getdetalleimagen(id:number,cbdetimg){
    this.servreq.getdetallerequisitos(id).subscribe(datos =>{
      console.log(datos);
      this.listadetalleimagenrec.length=0;
      datos.forEach(element => this.listadetalleimagenrec.push(element))
      cbdetimg();
    });  
  }

  get f() { return this.form.controls; }
  
  public close(valor):void {
    
    this.dialogRef.close(valor);
  }
  public grabarcallback(){
    this.grabar(()=>{this.close(this._requisito)})
  }
  public grabar(callback){
    
    var _imagencomp:modeloimagenTotal;
    var eliminar:boolean;
    this.enviado=true;
    
    if (this.form.valid) {
      
      
      this._requisito.nombrerequisito=this.form.value.nombre;
      this._requisito.estadorequisito=this.form.value.estado;
      this._requisito.usuariomodifica=this._usuautenticado.id;
      this.servreq.agregar(this._requisito).subscribe(datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error(datos.dsMens)
            console.log(datos.dsMens);
          
        }
        else{
          
          this._requisito.nombrerequisito=datos.requisito[0].nombrerequisito;
          this._requisito.estadorequisito=datos.requisito[0].estadorequisito;
          
          _imagencomp=new modeloimagenTotal(this._requisito.idimagen,this._requisito.nombreimagen,
                        this._requisito.imagenfisica,this._requisito.alto,this._requisito.ancho,1,this._requisito.idrequisito);
          this.servreq.eliminarimagen(_imagencomp.idimagen).subscribe(resultado=>{
            if(resultado.isOk=="S"){
              this.servreq.agregarimagen(_imagencomp).subscribe(resap=>{
                this.listadetalleimagenrec.forEach(elemento=>{
                  this.servreq.eliminarimagen(elemento.idimagen)
                })
                this.listadetalleimagen.forEach(elemento=>{
                  _imagencomp=new modeloimagenTotal(elemento.idimagen,elemento.nombreimagen,
                    elemento.imagenfisica,elemento.ancho,elemento.alto,2,this._requisito.idrequisito);
                    this.servreq.agregarimagen(_imagencomp);
                })
              })
              callback();
            }
          })
        }
      })
    }
    else{
      this.mensajes.error("Debe comletar todos los datos del formulario", "Mensaje de Error")
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
