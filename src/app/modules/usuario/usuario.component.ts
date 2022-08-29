import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



import { BEUsuarioPanelComponent } from './beusuario/borrareditarusuario.component';
import { AUsuarioPanelComponent } from './agregarusuario/agregarusuario.component';
import { SidePanelOverlayService } from '../../shared/side-panel/side-panel-overlay.service';
import { MatDialog, MatDialogConfig, MatSlideToggle } from '@angular/material';
import { ConfirmarModalComponent } from './../../shared/confirmar-modal/confirmar-modal.component';
import { serviciousuario } from './../../services/serviciousuario';
import { servicioperfil } from './../../services/servicioperfil';
import { modelousuario } from './../../model/modusuario';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PaginationInstance } from 'ngx-pagination';
import { modeloperfil } from './../../model/modperfil';
import { modelohabilitado } from './../../model/modHabilitado';
import { isError } from 'util';




@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.component.html',
  styleUrls: ['usuario.component.scss']
})

export class UsuarioComponent implements OnInit {

  public query: any = '';
  public listausuarios: modelousuario[] = [];
  public listaperfiles: modeloperfil[] = [];
  public usuarioactual: modelousuario;
  private usuarios$: Observable<modelousuario[]>;
  inicio: number;
  fin: number;
  totalreg: number;
  load: boolean;
  opciones: modelohabilitado[] = [];



  closeResult = '';

  constructor(private mensajes: ToastrService, private servperfil: servicioperfil, private servusuario: serviciousuario, private dialog: MatDialog, private modalService: NgbModal) {
    this.config.itemsPerPage = 5;
    this.inicio = 1;
    this.fin = this.config.currentPage * 1 * this.config.itemsPerPage;
    this.config.currentPage = 1;
    this.opciones.push(new modelohabilitado("S", "Habilitado"));
    this.opciones.push(new modelohabilitado("N", "DesHabilitado"));

  }
  ngOnInit(): void {

    this.load = true;
    this.getUsuarios();
    // setTimeout(() => {
    // }, 1000);
  }


  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 1,
    currentPage: 1
  };
  open(contenido) {
    this.modalService.open(contenido);
  }



  getUsuarios() {
    this.servusuario.getUsersWithProfiles().subscribe(response => {
      console.log(response);
      this.listausuarios.length = 0;
      response.usuarios.forEach(element => {
        this.listausuarios.push(new modelousuario().mapModel(element))
      });

      this.servusuario.setUsers(this.listausuarios);
      this.totalreg = this.listausuarios.length;
      this.load = false;
    });
  }

  getUsuariosfiltro(cbUsuarios, Id: string) {
    this.usuarios$ = this.servusuario.getusuariosfiltro(Id);

    this.usuarios$.subscribe(datos => {

      this.listausuarios.length = 0;
      datos.forEach(element => this.listausuarios.push(element))
      cbUsuarios();
    });
  }

  currentFilterSelected = null;

  filtro(id) {
    this.currentFilterSelected = id;
    if (id != null) {
      this.getUsuariosfiltro(() => { this.totalreg = this.listausuarios.length; }, id)
    }
    else
      this.getUsuarios();
  }

  actualizarrango(valor) {
    this.config.itemsPerPage = parseInt(valor);
    this.inicio = ((this.config.currentPage * 1) - 1) * this.config.itemsPerPage + 1;
    this.fin = this.config.currentPage * 1 * this.config.itemsPerPage;
    if (this.config.itemsPerPage * this.config.currentPage > this.listausuarios.length) {
      this.config.currentPage = Math.trunc(this.listausuarios.length / this.config.itemsPerPage) + 1;
      this.inicio = ((this.config.currentPage * 1) - 1) * this.config.itemsPerPage + 1;
      this.fin = this.config.currentPage * 1 * this.config.itemsPerPage;
    }

  }

  openAgregarUsuario() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = '550px';
    dialogConfig.minWidth = '700px';



    const dialogRef = this.dialog.open(AUsuarioPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != null) {
          this.usuarioactual = data;
          this.listausuarios.push(this.usuarioactual);
          this.mensajes.success("Usuario " + this.usuarioactual.nombre + "agregado correctamente");
          this.mensajes.success("La Constraseña del usuario creado es 'cre123'", "Mensaje Informativo", { disableTimeOut: true })
        }
      }
    );
  }

  openEditarUsuario({ id, login, nombre, apellido, telefono, correo }: modelousuario) {    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { id, login, nombre, apellido, telefono, correo };
    dialogConfig.minHeight = '550px';
    dialogConfig.minWidth = '700px';

    const dialogRef = this.dialog.open(BEUsuarioPanelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != null) {
          this.usuarioactual = data;
          var i;
          for (i = 0; i < this.listausuarios.length; i = i + 1) {
            if (this.listausuarios[i].id == this.usuarioactual.id)
              this.listausuarios[i] = this.usuarioactual;
          }

          this.mensajes.success("Usuario " + this.usuarioactual.nombre + " actualizado correctamente", "Mensaje Informativo")

        }

      }
    );
  }

  openBorrarUsuario(id: number, $event) {
    const dialogConfig = new MatDialogConfig();
    var a;
    $event.stopPropagation();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titulo: 'Mensaje de Advertencia',
      mensaje: '¿Esta seguro que desea borrar el usuario seleccionado?'
    };
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {

        if (data.respuesta) {
          this.Borrar(() => { }, id);

        }
      }

    );

  }

  Borrar(cbusuarios, id: number) {
    debugger;
    this.servusuario.borrar(id)
      .subscribe(
        res => {
          if (res.isOk === "S") {
            var i = 0;
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.listausuarios.splice(i, 1);
                this.mensajes.success("Usuario " + element.nombre + " borrado correctamente", "Mensaje Informativo")
              }
              i = i + 1;
            })
          }
          else {
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.mensajes.error("Usuario " + element.nombre + " no ha posido ser borrado (" + res.dsMens + ")", "Mensaje Error")
              }
            })
          }

          cbusuarios();
        },
        err => this.listausuarios.forEach(element => {
          if (element.id == id) {
            this.mensajes.error("Usuario " + element.nombre + " no ha posido ser borrado", "Mensaje Error")
          }
        })
      );
  }

  Habilitar(cbusuarios, id: number, $event) {

    this.servusuario.habilitar(id)
      .subscribe(
        res => {

          if (res.isOk = "S") {
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.usuarioactual = element;
                element.estado = "S";
                this.mensajes.success("Usuario " + element.nombre + " habilitado correctamente", "Mensaje Informativo")


              }
            })

          }
          else {
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.usuarioactual = element;
                element.estado = "N";
                this.mensajes.error("Usuario " + element.nombre + " no ha podido ser habilitado", "Mensaje Error")
                let matSlideToggle: MatSlideToggle = $event.source;
                matSlideToggle.toggle();

              }
            })
          }

          cbusuarios();
        },
        err => this.listausuarios.forEach(element => {
          if (element.id == id) {
            this.usuarioactual = element;
            element.estado = "N";
            this.mensajes.error("Usuario " + element.nombre + " no ha podido ser habilitado", "Mensaje Informativo");
            let matSlideToggle: MatSlideToggle = $event.source;
            matSlideToggle.toggle();
          }
        })

      );
  }

  DesHabilitar(cbusuarios, id: number, $event) {

    this.servusuario.deshabilitar(id)
      .subscribe(
        res => {

          if (res.isOk = "S") {
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.usuarioactual = element;
                element.estado = "N";
                this.mensajes.success("Usuario " + element.nombre + " deshabilitado correctamente", "Mensaje Informativo")


              }
            })

          }
          else {
            this.listausuarios.forEach(element => {
              if (element.id == id) {
                this.usuarioactual = element;
                element.estado = "S";
                this.mensajes.error("Usuario " + element.nombre + " no ha podido ser deshabilitado", "Mensaje Error")
                let matSlideToggle: MatSlideToggle = $event.source;
                matSlideToggle.toggle();

              }
            })
          }

          cbusuarios();
        },
        err => this.listausuarios.forEach(element => {
          if (element.id == id) {
            this.usuarioactual = element;
            element.estado = "S";
            this.mensajes.error("Usuario " + element.nombre + " no ha podido ser deshabilitado", "Mensaje Informativo");
            let matSlideToggle: MatSlideToggle = $event.source;
            matSlideToggle.toggle();
          }
        })

      );
  }

  HabDesUsuario(idusuario: number, $event) {


    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if ($event.checked) {
      dialogConfig.data = {
        titulo: 'Mensaje de Advertencia',
        mensaje: '¿Esta seguro que desea habilitar el usuario seleccionado?'
      };
    }
    else {
      dialogConfig.data = {
        titulo: 'Mensaje de Advertencia',
        mensaje: '¿Esta seguro que desea deshabilitar el usuario seleccionado?'
      };
    }
    const dialogRef = this.dialog.open(ConfirmarModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {

        if (data.respuesta) {
          if ($event.checked) {

            this.Habilitar(() => { }, idusuario, $event);



          }
          else {
            this.DesHabilitar(() => { }, idusuario, $event);


          }

        }
        else {
          let matSlideToggle: MatSlideToggle = $event.source;
          matSlideToggle.toggle();
        }

      }

    );


  }


  abrirpop(popover) {
    if (popover.isOpen()) {

    } else {
      popover.open();
    }
  }



}

