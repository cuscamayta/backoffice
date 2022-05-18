import { ChangeDetectorRef, AfterViewInit, Component, OnInit } from '@angular/core';

import { MatDialogConfig, MatDialogRef } from '@angular/material';
import { modelopuntoayp } from './../../../model/modpuntoayp';
import { serviciopuntoayp} from './../../../services/serviciopuntoayp';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { MapsAPILoader, MouseEvent  } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { TipoPunto } from '../bepuntoayp/borrareditarpuntoayp.component';



@Component({
  selector: 'app-agregarpuntoayp',
  templateUrl: './agregarpuntoayp.component.html',
  styleUrls: ['./agregarpuntoayp.component.scss']
})
export class APuntoaypPanelComponent implements OnInit{
  form:FormGroup;
  closeResult = '';
  idpunto:number;
  _puntoayp:modelopuntoayp;
  
  enviado=false;
  marcador:marker;
  
  zoom=12;
  tipos = [
    new TipoPunto(1, 'Atención al Socio'),
    new TipoPunto(2, 'Pago de Factura') 
  ];

  constructor(private _serviciopuntoayp:serviciopuntoayp,
    private mensajes:ToastrService,
    private fb: FormBuilder,private dialogRef: MatDialogRef<APuntoaypPanelComponent>) { 
    this.enviado=false;
    this._puntoayp=new modelopuntoayp(0,"","","","",0,0);
    this.marcador=new marker(-17.78629, -63.18117,true);
    this.zoom=12;
    this.form = fb.group({
      nombre: ['', Validators.required],
      tipo: [1, ],
      direccion: ['', Validators.required],
      latitud: ['-17.78629', Validators.required],
      longitud: ['-63.18117', Validators.required],
      
  });
  }

  ngOnInit(): void {
    
    
    
    
  }

  get f() { return this.form.controls; }

   
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
    console.log(m);
    
  }
  markerDragEnd(m:marker, $event: MouseEvent) {
    this.marcador.lat= $event.coords.lat,
      this.marcador.lon= $event.coords.lng
      this.form.get('latitud').patchValue(this.marcador.lat.toString());
      this.form.get('longitud').patchValue(this.marcador.lon.toString());
      console.log(m);
  }

  

  

  public close(valor):void {
    this.dialogRef.close(valor);
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
      

      this._serviciopuntoayp.agregar(this._puntoayp).subscribe( datos=>
      {
        if (datos.isOk=="N"){
          this.mensajes.error(datos.dsMens)
            console.log(datos.dsMens);
          
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
