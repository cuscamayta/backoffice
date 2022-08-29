import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogConfig, MatDialogRef } from '@angular/material';
import { modeloperfil } from './../../../model/modperfil';
import { actpermiso, modeloperfilpermiso, modeloperfilpermisoact } from './../../../model/modperfilpermiso';
import { servicioperfil } from './../../../services/servicioperfil';
import { servicioperfilpermiso } from './../../../services/servicioperfilpermiso';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from "@angular/forms";
import { modpermiso } from './../../../model/modpermiso';
import { serviciopermiso } from './../../../services/serviciopermiso';
import { ToastrService } from 'ngx-toastr';
import { modelousuario } from './../../../model/modusuario';
import { servicioautenticacion } from './../../../services/servicioautenticacion';
import { EspaciosValidator } from '../../../shared/soloespacios';


@Component({
  selector: 'app-borrareditarperfil',
  templateUrl: './borrareditarperfil.component.html',
  styleUrls: ['./borrareditarperfil.component.scss']
})
export class BEPerfilPanelComponent implements OnInit {
  form: FormGroup;

  closeResult = '';
  idperfil: number;
  _perfil: modeloperfil;
  _perfilpermisos: modeloperfilpermiso[] = [];
  enviado = false;
  listapermisos: modpermiso[] = [];
  listapermisossel: modpermiso[] = [];
  load: boolean;
  _perfilpermisosact: modeloperfilpermisoact;

  resetPermissionsStatus(listItems) {
    listItems.map(x => {
      x.estado = false;
    })
  }

  constructor(private mensajes: ToastrService, private servpermisos: serviciopermiso,
    private _servicioperfilpermiso: servicioperfilpermiso, private _servicioperfil: servicioperfil,
    private servauten: servicioautenticacion,
    private fb: FormBuilder, private dialogrefp: MatDialogRef<BEPerfilPanelComponent>, @Inject(MAT_DIALOG_DATA) { idperfil, nombreperfil, descripcionperfil, estadoperfil, fecharegistro, usuarioregistra, fechamodificacion, usuariomodificacion }: modeloperfil) {
    this.enviado = false;
    this.idperfil = idperfil;
    this.listapermisos.length = 0;
    this.listapermisos = [];
    this.listapermisossel.length = 0;
    this.listapermisossel = [];
    this._perfil = new modeloperfil(idperfil, nombreperfil, descripcionperfil, estadoperfil, fecharegistro, usuarioregistra, fechamodificacion, usuariomodificacion);


    this.form = fb.group({
      descripcion: [descripcionperfil, [Validators.required, Validators.maxLength(50), EspaciosValidator.solo]],
      nombre: [nombreperfil, [Validators.required, Validators.maxLength(30), EspaciosValidator.solo]],
      permisos: new FormArray([]),

    });
    this.load = true;

    setTimeout(() => {
      this.getPermisos();
    }, 1000);
  }

  getPermissionByPerfil() {
    this.resetPermissionsStatus(this.listapermisos);
    this._servicioperfilpermiso.getperfilpermisos(this.idperfil).subscribe(datos => {
      this._perfilpermisos = datos;
      this.loadPermissionsSelected(this.listapermisos, datos);

      this.listapermisossel.forEach(element => this.permisosFormArray.push(new FormControl(element.estado)));
      this.load = false;
    });
  }

  get permisosFormArray() {
    return this.form.controls.permisos as FormArray;
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
  }

  loadPermissionsSelected(permissionList, selectedPermissions) {
    selectedPermissions.map(selectedPermission => {
      let currentPermission = permissionList.find(permission => permission.idpermiso === selectedPermission.idpermiso);
      currentPermission.estado = currentPermission ? true : false;
    })
    this.listapermisossel = this.listapermisos;
  }

  loadPermissions() {
    this.listapermisos = JSON.parse(localStorage.getItem("permisos"));
    this.listapermisossel = JSON.parse(localStorage.getItem("permisos"));

    if (!this.listapermisos) {
      this.servpermisos.getpermisos().subscribe(res => {
        this.listapermisos = res;
        this.listapermisossel = res;
      });
    }
  }

  getPermisos() {
    this.loadPermissions();
    this.getPermissionByPerfil();
  }

  traerpermisosperfil(cbperper) {
    this._servicioperfilpermiso.getperfilpermisos(this.idperfil).subscribe(datos => {
      this._perfilpermisos = datos;
      cbperper();
    });
  }

  public close(valor): void {
    this.dialogrefp.close(valor);
  }

  public grabarcallback() {
    this.grabar(() => { this.close(this._perfil); })
  }

  public grabar(cbgrabar) {
    var _usuautenticado: modelousuario;
    this.enviado = true;
    _usuautenticado = this.servauten.userValue;
    if (this.form.valid) {
      this._perfil.descripcionperfil = this.form.value.descripcion.trim();
      this._perfil.nombreperfil = this.form.value.nombre.trim();
      this._perfil.usuariomodificacion = _usuautenticado.id;
      this._servicioperfil.actualizar(this._perfil).subscribe(datos => {

        if (datos.isOk == "N") {
          this.mensajes.error("Error al guardar los datos editados del perfil: " + datos.dsMens)
        }
        else {
          this._perfil = datos.perfil[0];
          this._perfilpermisosact = new modeloperfilpermisoact();
          this.listapermisossel.forEach(persel => {
            if (persel.estado == true) {
              this._perfilpermisosact.perfil.idperfil = this._perfil.idperfil;
              this._perfilpermisosact.perfil.permisos.push(new actpermiso(persel.idpermiso));
            }
          });
          this._servicioperfilpermiso.actualizarpermisos(this._perfilpermisosact).subscribe(datos => {
            if (datos.isOk == "N") {
              this.mensajes.error(datos.dsMens)
            }
            cbgrabar();
          });
        }
      });
    }
    else {
      return;
    }
  }

  _keyUp(event: any, tamano: number, cadena: string) {
    if (cadena.length >= tamano) {
      event.preventDefault();
    }
  }

  cambiopermisopadre(id: number, padre, indice) {
    var valor = false;
    var nocambiar = false;
    if (padre == 0) {
      this.listapermisossel.forEach(elemento => {
        if (elemento.idpermiso == id) {
          valor = !elemento.estado;
          elemento.estado = valor;
        }
        if (elemento.idpadre == id) {
          elemento.estado = valor;
        }
      })
    }
    else {
      this.listapermisossel[indice].estado = !this.listapermisossel[indice].estado;
      this.listapermisossel.forEach(element => {
        if (element.idpadre == this.listapermisossel[indice].idpadre) {
          if (element.estado != this.listapermisossel[indice].estado) {
            nocambiar = true;
          }
        }
      })
      if (!nocambiar) {
        this.listapermisossel.forEach(element => {
          if (element.idpermiso == this.listapermisossel[indice].idpadre) {
            element.estado = this.listapermisossel[indice].estado;
          }
        })
      }
      else {
        this.listapermisossel.forEach(element => {
          if (element.idpermiso == this.listapermisossel[indice].idpadre) {
            element.estado = false;
          }
        })
      }
    }
    // actualizar pantalla con los valores del padre
    let index = 0;
    console.log(this.listapermisossel);
    for (index = 0; index < this.listapermisossel.length; index = index + 1) {
      (<FormArray>this.form.controls['permisos']).at(index).patchValue(this.listapermisossel[index].estado);
    }
  }


  abrirpop(popover) {
    if (popover.isOpen()) {

    } else {
      popover.open();
    }
  }
}
