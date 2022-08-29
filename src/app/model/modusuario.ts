import { OperatorFunction } from "rxjs";

export class modelousuario {
  pipe(arg0: OperatorFunction<unknown, unknown>) {
    throw new Error('Method not implemented.');
  }
  id: number = 0;
  login: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  estado: string;
  primeravez?: string = "S";
  fecharegistro?: string;
  usuarioregistra?: number = 0;
  fechamodificacion?: string;
  usuariomodifica?: number = 0;

  constructor() {

  }
  // constructor(vid: number, vlogin: string, vnombre: string, vapellido: string, vtelefono: string, vcorreo: string, vestado: string, vprivez: string, vfechareg: string, vusureg: number, vfecmod: string, vusumod: number) {
  //   this.id = vid;
  //   this.login = vlogin;
  //   this.nombre = vnombre;
  //   this.apellido = vapellido;
  //   this.telefono = vtelefono;
  //   this.correo = vcorreo;
  //   this.estado = vestado;
  //   this.primeravez = vprivez;
  //   this.fecharegistro = vfechareg;
  //   this.usuarioregistra = vusureg;
  //   this.fechamodificacion = vfecmod;
  //   this.usuariomodifica = vusumod;
  // }

  mapModel(model) {
    this.id = model.id;
    this.login = model.login;
    this.nombre = model.nombre;
    this.apellido = model.apellido;
    this.telefono = model.telefono;
    this.correo = model.correo;
    this.estado = model.estado;
    this.primeravez = model.primeravez;
    this.fecharegistro = model.fecharegistro;
    this.usuarioregistra = model.usuarioregistra;
    this.fechamodificacion = model.fechamodificacion;
    this.usuariomodifica = model.usuariomodifica;
    return this;
  }

}

export class modelousuarioactualizar {

  IDUSUA: number;
  DSUSUALOGI: string;
  DSUSUAPASS: string;
  DSNOMB: string;
  DSAPEL: string;
  DSTELE: string;
  DSMAIL: string;
  OPESTA: string;
  OPPRIM: string;
  IDUSUAMODI: number;

  constructor(id, login, pass, nombre, apellido, telefono, correo, estado, privez, usumod) {
    this.IDUSUA = id;
    this.DSUSUALOGI = login;
    this.DSUSUAPASS = pass;
    this.DSNOMB = nombre;
    this.DSAPEL = apellido;
    this.DSTELE = telefono;
    this.DSMAIL = correo;
    this.OPESTA = estado;
    this.OPPRIM = privez;
    this.IDUSUAMODI = usumod;


  }


}

export class modelousuarioinsertar {


  DSUSUALOGI: string;
  DSUSUAPASS: string;
  DSNOMB: string;
  DSAPEL: string;
  DSTELE: string;
  DSMAIL: string;
  OPESTA: string;
  OPPRIM: string;
  IDUSUAREGI: number;

  constructor(login, pass, nombre, apellido, telefono, correo, estado, privez, usureg) {
    this.DSUSUALOGI = login;
    this.DSUSUAPASS = pass;
    this.DSNOMB = nombre;
    this.DSAPEL = apellido;
    this.DSTELE = telefono;
    this.DSMAIL = correo;
    this.OPESTA = estado;
    this.OPPRIM = privez;
    this.IDUSUAREGI = usureg;


  }


}
