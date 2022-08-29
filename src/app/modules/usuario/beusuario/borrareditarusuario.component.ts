import { ChangeDetectorRef, AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SidePanelOverlayService } from '../../../shared/side-panel/side-panel-overlay.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef, MatDialogConfig } from '@angular/material';
import { modeloperfil } from './../../../model/modperfil';
import { servicioperfil } from './../../../services/servicioperfil';
import { modelousuario } from './../../../model/modusuario';
import { actperfil, modelousuarioperfil, modelousuarioperfilact } from './../../../model/modusuarioperfil';
import { serviciousuario } from './../../../services/serviciousuario';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from "@angular/forms";
import { serviciousuarioperfil } from '../../../services/serviciousuarioperfil';
import { modelolistaconsel } from '../../../model/modlistaconsel';
import { modpermiso } from '../../../model/modpermiso';
import { servicioperfilpermiso } from '../../../services/servicioperfilpermiso';
import { ToastrService } from 'ngx-toastr';
import { serviciopermiso } from '../../../services/serviciopermiso';
import { servicioautenticacion } from './../../../services/servicioautenticacion';
import { EspaciosValidator } from '../../../shared/soloespacios';
import { almenosunitem } from '../../../shared/almenosunitem';

@Component({
  selector: 'app-borrareditarusuario',
  templateUrl: './borrareditarusuario.component.html',
  styleUrls: ['./borrareditarusuario.component.scss']
})
export class BEUsuarioPanelComponent {
  public listaperfiles: modeloperfil[] = [];
  public listausuarioperfil: modelousuarioperfil[] = [];
  public listapermisos: modpermiso[] = [];
  form: FormGroup;

  public listaperfsel: modelolistaconsel[] = [];

  idusuario: number;
  _usuario: modelousuario;
  enviado = false;
  load: boolean;
  _usuarioperfiles: modelousuarioperfilact;

  constructor(private mensajes: ToastrService, private servperperf: servicioperfilpermiso,
    private servpermisos: serviciopermiso, private _servusuperf: serviciousuarioperfil,
    private _serviciousuario: serviciousuario, private fb: FormBuilder,
    private servauten: servicioautenticacion,
    private servperfil: servicioperfil, private dialogRefBE: MatDialogRef<BEUsuarioPanelComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) { id, login, nombre, apellido, telefono, correo, estado, primeravez, fechamodificacion, usuariomodifica, fecharegistro, usuarioregistra }: modelousuario) {
    this.listapermisos.length = 0;
    this.listapermisos = [];
    this.enviado = false;
    this.idusuario = id;
    this.form = fb.group({
      usuario: [login, [Validators.required, Validators.maxLength(30), EspaciosValidator.solo]],
      nombre: [nombre, [Validators.required, Validators.maxLength(50), EspaciosValidator.solo]],
      apellidos: [apellido, [Validators.required, Validators.maxLength(50), EspaciosValidator.solo]],
      telefono: [telefono, [Validators.required, Validators.maxLength(20)]],
      direccion: [correo, [Validators.required, EspaciosValidator.solo]],

      perfiles: new FormArray([], [Validators.required, almenosunitem()]),
      permisos: new FormArray([]),

    });

    this._usuario = new modelousuario().mapModel({ id, login, nombre, apellido, telefono, correo, estado, primeravez, fechamodificacion, usuariomodifica, fecharegistro, usuarioregistra });

    this.load = true;
    setTimeout(() => {
      this.loadPermissionsFromStorage();
      this.loadProfilesFromStorage();
    }, 1000);
  }

  resetPemissionStatus() {
    this.listapermisos.map(permission => {
      permission.estado = false;
    })
  }

  loadPermissionsFromStorage() {
    this.listapermisos = JSON.parse(localStorage.getItem('permisos'));
    if (!this.listapermisos) {
      this.getPermissionsFromServer();
    } else {
      this.createFormControlsForPermissions();
    }
  }

  getPermissionsFromServer() {
    this.servpermisos.getpermisos().subscribe(res => {
      this.listapermisos = res;
      this.createFormControlsForPermissions();
    });
  }

  createFormControlsForPermissions() {
    this.resetPemissionStatus();
    this.listapermisos.forEach(element => {
      this.permisosFormArray.push(new FormControl(element.estado));
    });
  }

  loadProfilesFromStorage() {
    this.listaperfiles = JSON.parse(localStorage.getItem('perfiles'));
    if (!this.listaperfiles) {
      this.getProfilesFromServer();
    } else {
      this.createFormControlForProfiles();
    }
  }

  getProfilesFromServer() {
    this.servperfil.getperfiles().subscribe(res => {
      this.listaperfiles = res;
      this.createFormControlForProfiles();
    });
  }

  createFormControlForProfiles() {
    this.crealistasel();
    // this.listaperfsel.forEach(element => this.perfilesFormArray.push(new FormControl(element.seleccionado)));
    this.load = false;
  }

  get perfilesFormArray() {
    return this.form.controls.perfiles as FormArray;
  }

  get permisosFormArray() {
    return this.form.controls.permisos as FormArray;
  }
  get f() { return this.form.controls; }

  getUsuarioPerfiles(vvIdUsuario: number, cbusuarioperfiles) {    
    this.listausuarioperfil.length = 0;
    this._servusuperf.getusuarioperfiles(vvIdUsuario).subscribe(datos => {
      this.listausuarioperfil = datos;

      var i, j

      for (i = 0; i < this.listausuarioperfil.length; i = i + 1) {

        for (j = 0; j < this.listaperfsel.length; j = j + 1) {

          if (this.listausuarioperfil[i].idperfil == this.listaperfsel[j].id) {
            this.listaperfsel[j].seleccionado = true;
          }
        }
      }

      this.listausuarioperfil.forEach(element => {
        this.servperperf.getperfilpermisos(element.idperfil).subscribe(perm => {
          perm.forEach(elementper => {
            this.listapermisos.forEach(permiso => {
              if (elementper.idpermiso == permiso.idpermiso) {
                permiso.estado = true;
              }
            });

          });

          this.actualizarpermisos();

        });
      });
      cbusuarioperfiles();
    });
  }

  getPermisos(cbpermisos) {
    this.listapermisos = JSON.parse(localStorage.getItem('permisos'));
    if (this.listapermisos == null) {
      this.servpermisos.getpermisos()
        .subscribe(
          res => {
            this.listapermisos = res;
            cbpermisos();

          });
    }
    else {
      cbpermisos();
    }
  }

  getPerfiles(cbperfiles) {
    this.listaperfiles = JSON.parse(localStorage.getItem('perfiles'));
    if (this.listaperfiles == null) {
      this.servperfil.getperfiles()
        .subscribe(
          res => {
            this.listaperfiles = res;

            cbperfiles();
          });
    }
    else {
      cbperfiles();
    }


  }


  crealistasel() {
    this.listaperfsel.length = 0;
    this.listaperfsel = [];
    this.listaperfiles.forEach(elemento => {
      this.listaperfsel.push(new modelolistaconsel(elemento.idperfil, elemento.nombreperfil, false));
    })

    this.getUsuarioPerfiles(this._usuario.id, () => { this.listaperfsel.forEach(element => this.perfilesFormArray.push(new FormControl(element.seleccionado))); });

  }


  cambiar(id: number, e) {

    this.listaperfsel.forEach(element => {
      if (element.id == id)
        if (e.target.checked)
          element.seleccionado = true;
        else
          element.seleccionado = false;

    })
    this.listapermisos.forEach(element => element.estado = false);
    this.actualizarpermisos();
    this.listaperfsel.forEach(perfsel => {
      if (perfsel.seleccionado) {
        this.servperperf.getperfilpermisos(perfsel.id).subscribe(perm => {
          perm.forEach(elementper => {
            this.listapermisos.forEach(permiso => {
              if (elementper.idpermiso == permiso.idpermiso) {
                permiso.estado = true;

              }
            });

          });
          this.actualizarpermisos();
        });
      }
    })

  }

  actualizarpermisos() {
    let index = 0; // or 1 or 2
    while (index < this.listapermisos.length) {
      (<FormArray>this.form.controls['permisos']).at(index).patchValue(this.listapermisos[index].estado);
      index = index + 1;
    }


  }

  public close(valor): void {

    this.dialogRefBE.close(valor);
  }
  public grabarcallback() {
    this.grabar(() => { this.close(this._usuario) })
  }
  public grabar(callback) {
    var _usuautenticado: modelousuario;
    var _usuperf: modelousuarioperfil;
    var eliminar: boolean;
    this.enviado = true;
    _usuautenticado = this.servauten.userValue;
    if (this.form.valid) {

      this._usuario.login = this.form.value.usuario;
      this._usuario.nombre = this.form.value.nombre;
      this._usuario.apellido = this.form.value.apellidos;
      this._usuario.telefono = this.form.value.telefono;
      this._usuario.correo = this.form.value.direccion;
      this._usuario.usuariomodifica = _usuautenticado.id;
      this._serviciousuario.actualizar(this._usuario, this._usuario.login).subscribe(datos => {
        if (datos.isOk == "N") {
          this.mensajes.error("Error al editar los datos del usuario: " + datos.dsMens)


        }
        else {

          this._usuario = datos.usuario[0];
          console.log(this.listaperfsel);
          this._usuarioperfiles = new modelousuarioperfilact();
          this._usuarioperfiles.usuario.idusuario = this._usuario.id;
          this.listaperfsel.forEach(elemento => {
            if (elemento.seleccionado) {
              this._usuarioperfiles.usuario.perfiles.push(new actperfil(elemento.id));

            }
          })


          this._servusuperf.actualizarperfiles(this._usuarioperfiles).subscribe(datos => {

            if (datos.isOk == "N") {
              this.mensajes.error(datos.dsMens)

            }
          })

        }
        callback();
      });


    }
    else {

      return;
    }

  }

}
