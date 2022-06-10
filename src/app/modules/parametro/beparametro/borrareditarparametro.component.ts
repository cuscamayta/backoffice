import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { MatDialogConfig,MatDialogRef } from '@angular/material';
import { modeloparametro } from './../../../model/modparametro';
import { servicioparametro } from './../../../services/servicioparametro';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-borrareditarparametro',
  templateUrl: './borrareditarparametro.component.html',
  styleUrls: ['./borrareditarparametro.component.scss']
})
export class BEParametroPanelComponent implements OnInit{
  form: FormGroup;
  

  idparametro:number;
  _parametro:modeloparametro;
  enviado=false;

  constructor(private _servicioparametro:servicioparametro,private fb: FormBuilder,private dialogrefp:MatDialogRef<BEParametroPanelComponent>,@Inject(MAT_DIALOG_DATA) {id,parametro,valor,descripcion}:modeloparametro) { 
    this.enviado=false;
    this.idparametro=id;
    this._parametro=new modeloparametro(id,parametro,valor,descripcion);
    
    this.form = fb.group({
      parametro: [parametro, Validators.required],
      valor: [valor, Validators.required],
      descripcion: [descripcion, Validators.required],
      
      
      
  });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
  
  }


  

  public close():void {
    this.dialogrefp.close();
  }

  public grabar(){
    this.enviado=true;
    if (this.form.valid) {
      this._parametro.parametro=this.f.parametro.value;
      this._parametro.valor=this.f.valor.value;
      this._parametro.descripcion=this.f.descripcion.value;
      

      if (this._servicioparametro.actualizar(this._parametro))
      {
        
          this.close();
          
         
        
      }
      else
      {
        
        
      }
    }
    else{
      return;
    }
    
  }
  
}
