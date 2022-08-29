import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { serviciorequisito } from '../../../../app/services/serviciorequisito';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from "@angular/forms";
import { modeloimagen, modeloimagenTotal, modelorequisito } from '../../../model/modrequisito';
import { serviciousuario } from '../../../../app/services/serviciousuario';
import { servicioautenticacion } from '../../../../app/services/servicioautenticacion';
import { modelousuario } from '../../../../app/model/modusuario';
import { EspaciosValidator } from '../../../../app/shared/soloespacios';
@Component({
  selector: 'app-agregarservicio',
  templateUrl: './agregarservicio.component.html',
  styleUrls: ['./agregarservicio.component.scss']
})
export class AServicioPanelComponent implements OnInit {
  estado = 'Habilitado';
  configurar = 'Configurar Enlaces';
  form: FormGroup;
  enviado: boolean = false;
  _usuautenticado: modelousuario;
  public listadetalleimagen: modeloimagen[] = [new modeloimagen(0, "", "", 0, 0), new modeloimagen(0, "", "", 0, 0),
  new modeloimagen(0, "", "", 0, 0), new modeloimagen(0, "", "", 0, 0)];
  public listadetalleimagenrec: modeloimagen[] = [];
  public respaldoimagen: modeloimagen;

  _requisito: modelorequisito = new modelorequisito(0, "", "S"
    , 0, "", 0, "", 0
    , "", "", 0, 0);;
  constructor(private mensajes: ToastrService, private servreq: serviciorequisito,
    private servaut: servicioautenticacion,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AServicioPanelComponent>) {
    this._usuautenticado = this.servaut.userValue;
    this._requisito.estadorequisito = "S";
    this._requisito.usuariomodifica = this._usuautenticado.id;
    this._requisito.usuarioregistra = this._usuautenticado.id;
    this.form = fb.group({

      nombre: [this._requisito.nombrerequisito, [Validators.required, Validators.maxLength(70), EspaciosValidator.solo]],
      idimagen: [this._requisito.idimagen,],
      estado: [this._requisito.estadorequisito,],

    });



  }


  ngOnInit(): void {

  }

  Borrar(id: number) {
    this.listadetalleimagen[id] = new modeloimagen(0, "", "", 0, 0);
  }

  imagen(id: number) {
    const fileUplodad = document.getElementById('File' + id.toString()) as HTMLInputElement;

    this.respaldoimagen = new modeloimagen(this.listadetalleimagen[id].idimagen, this.listadetalleimagen[id].nombreimagen,
      this.listadetalleimagen[id].imagenfisica, this.listadetalleimagen[id].ancho, this.listadetalleimagen[id].alto);
    fileUplodad.onchange = () => {
      const file = fileUplodad.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        if (this.listadetalleimagen[id].idimagen == 0 || this.listadetalleimagen[id].idimagen == undefined) {
          this.listadetalleimagen[id].idimagen = -1;
        }
        this.listadetalleimagen[id].imagenfisica = event.target.result.toString().slice(23, event.target.result.toString().length);
        this.listadetalleimagen[id].nombreimagen = file.name;

      }
      reader.readAsDataURL(file);
      const Img = new Image();
      Img.src = URL.createObjectURL(file);

      Img.onload = (e: any) => {
        this.listadetalleimagen[id].alto = e.path[0].height;
        this.listadetalleimagen[id].ancho = e.path[0].width;
        // if ((this.listadetalleimagen[id].alto > 640) || (this.listadetalleimagen[id].ancho > 926)) {
        //   this.listadetalleimagen[id] = this.respaldoimagen;
        //   this.mensajes.error("El tamaño de la Imagen es demasiado grande", "Mensaje de Error");
        // }
      }

    }

    fileUplodad.click();
  }

  imagenportada() {
    const fileUplodad = document.getElementById('imagenportada') as HTMLInputElement;
    this.respaldoimagen = new modeloimagen(this._requisito.idimagen, this._requisito.nombreimagen,
      this._requisito.imagenfisica, this._requisito.ancho, this._requisito.alto);
    fileUplodad.onchange = () => {
      const file = fileUplodad.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        if (this._requisito.idimagen == 0 || this._requisito.idimagen == undefined) {
          this._requisito.idimagen = -1;
        }
        this._requisito.imagenfisica = event.target.result.toString().slice(23, event.target.result.toString().length);
        this._requisito.nombreimagen = file.name;

      }
      reader.readAsDataURL(file);
      const Img = new Image();
      Img.src = URL.createObjectURL(file);

      Img.onload = (e: any) => {
        this._requisito.alto = e.path[0].height;
        this._requisito.ancho = e.path[0].width;
        // if ((this._requisito.alto > 640) || (this._requisito.ancho > 322)) {
        //   this._requisito.idimagen = this.respaldoimagen.idimagen;
        //   this._requisito.imagenfisica = this.respaldoimagen.imagenfisica;
        //   this._requisito.nombreimagen = this.respaldoimagen.nombreimagen;
        //   this._requisito.alto = this.respaldoimagen.alto;
        //   this._requisito.ancho = this.respaldoimagen.ancho;
        //   this.mensajes.error("El tamaño de la Imagen de portada es demasiado grande", "Mensaje de Error");
        // }
      }


    }

    fileUplodad.click();
  }

  HabDesEstado($Event) {
    if ($Event.checked) {
      this._requisito.estadorequisito = "S";

    }
    else {
      this._requisito.estadorequisito = "N";
    }
  }

  getdetalleimagen(id: number, cbdetimg) {
    this.servreq.getdetallerequisitos(id).subscribe(datos => {

      this.listadetalleimagenrec.length = 0;
      datos.forEach(element => this.listadetalleimagenrec.push(element))
      cbdetimg();
    });
  }

  get f() { return this.form.controls; }

  public close(valor): void {

    this.dialogRef.close(valor);
  }
  public grabarcallback() {
    this.grabar(() => { this.close(this._requisito) })
  }
  public grabar(callback) {

    var _imagencomp: modeloimagenTotal;
    var eliminar: boolean;
    this.enviado = true;

    if (this.form.valid && this._requisito.idimagen != 0) {


      this._requisito.nombrerequisito = this.form.value.nombre;
      this._requisito.usuariomodifica = this._usuautenticado.id;
      this.servreq.agregar(this._requisito).subscribe(datos => {
        if (datos.isOk == "N") {
          this.mensajes.error(datos.dsMens)


        }
        else {

          this._requisito.nombrerequisito = datos.requisito[0].nombrerequisito;
          this._requisito.estadorequisito = datos.requisito[0].estadorequisito;
          this._requisito.idrequisito = datos.requisito[0].idrequisito;

          _imagencomp = new modeloimagenTotal(this._requisito.idimagen, this._requisito.nombreimagen,
            this._requisito.imagenfisica, this._requisito.alto, this._requisito.ancho, 1, this._requisito.idrequisito);
          this.servreq.agregarimagen(_imagencomp).subscribe(resap => {
            console.log(resap);
            this.listadetalleimagen.forEach(elemento => {
              if (elemento.idimagen != 0) {
                _imagencomp = new modeloimagenTotal(elemento.idimagen, elemento.nombreimagen,
                  elemento.imagenfisica, elemento.ancho, elemento.alto, 2, this._requisito.idrequisito);
                this.servreq.agregarimagen(_imagencomp).subscribe(resultadoii => {
                  console.log(resultadoii);
                });
              }


            })
            callback();
          })
        }
      })
    }
    else {
      this.mensajes.error("Debe comletar todos los datos del formulario", "Mensaje de Error")
      return;
    }

  }

  abrirpop(popover) {
    if (popover.isOpen()) {

    } else {
      popover.open();
    }
  }
}
