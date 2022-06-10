import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { MatDialogConfig,MatDialogRef } from '@angular/material';
import { modelousuario, modelousuarioactualizar } from './../../../model/modusuario';

import { serviciousuario } from './../../../services/serviciousuario';
import { servicioautenticacion } from './../../../services/servicioautenticacion';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss']
})
export class ChangePassComponent implements OnInit{
  form: FormGroup;
  
  closeResult = '';
 
  
  _usuario:modelousuario;
  
  
  enviado=false;
  

  constructor(private mensajes:ToastrService,private _servicioautenticacion:servicioautenticacion ,private _serviciousuario:serviciousuario,private fb: FormBuilder,private dialogrefp:MatDialogRef<ChangePassComponent>) { 
    this.enviado=false
    this._usuario=_servicioautenticacion.userValue;
    this.form = fb.group({
      actual: ['', Validators.required],
      nueva: ['', Validators.required],
      confirmar: ['', Validators.required]
  });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    
    
    
  }

  public close(valor):void {
    this.dialogrefp.close(valor);
  }

  public grabar(){
    this.enviado=true;
    if (this.form.valid) {
      if ( this.form.value.nueva==this.form.value.confirmar){
        this._serviciousuario.actualizar(this._usuario,this.form.value.nueva).subscribe(datos=>{
        if (datos.isOk=="S")
          {
            this.mensajes.success("Se cambio la contraseña correctamente");
            this.close(datos);
          }
          else
          {
            this.mensajes.error("Sucedio un error al cambiar la contraseña: "+datos.dsMens);
          }
        });

      }
      else 
      {
        
        this.mensajes.error("La Contraseña nueva debe ser igual al campo confirmar");
      }

      
    }
    else{
      this.mensajes.error("Se deben rellenar todos los campos para cambiar contraseña");
    }
    
  }
  
}
