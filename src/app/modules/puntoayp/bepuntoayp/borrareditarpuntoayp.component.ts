import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject, NgZone} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { MatDialogConfig,MatDialogRef } from '@angular/material';
import { modelopuntoayp } from './../../../model/modpuntoayp';
import { serviciopuntoayp } from './../../../services/serviciopuntoayp';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { MapsAPILoader, MouseEvent  } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { EspaciosValidator } from '../../../../app/shared/soloespacios';


@Component({
  selector: 'app-borrareditarpuntoayp',
  templateUrl: './borrareditarpuntoayp.component.html',
  styleUrls: ['./borrareditarpuntoayp.component.scss']
})

export class BEPuntoaypPanelComponent implements OnInit{
  form: FormGroup;
  
  dropdownSettings = {};
  idpunto:number;
  _puntoayp:modelopuntoayp;
  
  enviado=false;
  marcador:marker;
  
  zoom=12;
  tipos = [
    new TipoPunto(1, 'Atención al Socio'),
    new TipoPunto(2, 'Pago de Factura') 
] 


  constructor(private mensajes:ToastrService,
    private _serviciopuntoayp:serviciopuntoayp,private fb: FormBuilder,private dialogrefp:MatDialogRef<BEPuntoaypPanelComponent>,@Inject(MAT_DIALOG_DATA) {idpunto,nombre,direccion,idtipo,tipo,latitud,longitud}:modelopuntoayp) { 
    this.enviado=false;
    this.idpunto=idpunto;
    this._puntoayp=new modelopuntoayp(idpunto,nombre,direccion,idtipo,tipo,latitud,longitud);
    this.marcador=new marker((Math.round(latitud.valueOf()*100000))/100000,(Math.round(longitud.valueOf()*100000))/100000,true);
    this.zoom=12;
    this.form = this.fb.group({
      nombre: [nombre, [Validators.required,Validators.maxLength(100),EspaciosValidator.solo]],
      tipo: [idtipo],
      direccion: [direccion, [Validators.required,Validators.maxLength(150),EspaciosValidator.solo]],
      latitud: [latitud, Validators.required ],
      longitud: [longitud, Validators.required],
      
  });
    
  }
  
  get f() { return this.form.controls; }

  ngOnInit() {
    
  }
  longitudcambio(valor){
    this.marcador.lon=(valor.valueOf());
  }

  latitudcambio(valor){
    this.marcador.lat=(valor.valueOf());
  }

  mapClicked($event: MouseEvent) {
    
      this.marcador.lat= $event.coords.lat,
      this.marcador.lon= $event.coords.lng
      this.form.get('latitud').patchValue(this.marcador.lat.toString());
      this.form.get('longitud').patchValue(this.marcador.lon.toString());
      
  }

  clickedMarker(m:marker) {
    
    
  }
  markerDragEnd(m:marker, $event: MouseEvent) {
    this.marcador.lat= $event.coords.lat,
      this.marcador.lon= $event.coords.lng
      this.form.get('latitud').patchValue(this.marcador.lat.toString());
      this.form.get('longitud').patchValue(this.marcador.lon.toString());
      
  }

  

  

  public close(valor):void {
    this.dialogrefp.close(valor);
  }

  public grabarcallback(){
    this.grabar(()=>{this.close(this._puntoayp)});
  }

  public grabar(callback){
    this.enviado=true;
    if (this.form.valid) {
      this._puntoayp.nombre=this.form.value.nombre;
      this._puntoayp.idtipo=this.form.value.tipo;

      this._puntoayp.direccion=this.form.value.direccion;
      this._puntoayp.latitud=this.form.value.latitud;
      this._puntoayp.longitud=this.form.value.longitud;
      

      this._serviciopuntoayp.actualizar(this._puntoayp).subscribe( datos=>
      {
        if (datos.isOk=="N"){
          
          this.mensajes.error("Error al editar un punto de atención: "+datos.dsMens)
            
          
        }
        else{
          
          this._puntoayp=datos.punto[0];
          
        }
        callback();
      });
    }
    else {
      return;
    }
    
  }
  
}

export class marker {
	lat: number;
	lon: number;
	draggable: boolean;

  constructor(latitud,longitud,draggable){
    this.lat=latitud;
    this.lon=longitud;
    this.draggable=draggable;
  }
}

export class TipoPunto { 
  constructor(public id:number, public nombre:string) {
  }
}
