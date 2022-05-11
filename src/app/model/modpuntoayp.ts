import { OperatorFunction } from "rxjs";

export class modelopuntoayp{
    pipe(arg0: OperatorFunction<unknown, unknown>) {
      throw new Error('Method not implemented.');
    }
    idpunto:number;
    nombre:string;
    direccion:string;
    idtipo:string;
    tipo:string;
    latitud:number;
    longitud:number;
    constructor(vid,vnombre,vdireccion,vidtipo,vtipo,vlatitud,vlongitud){
        this.idpunto=vid;
        this.nombre=vnombre;
        this.direccion=vdireccion;
        this.idtipo=vidtipo;
        this.tipo=vtipo;
        this.latitud=vlatitud;
        this.longitud=vlongitud;
    }

    
}

export class modelopuntoaypactualizar{
  pipe(arg0: OperatorFunction<unknown, unknown>) {
    throw new Error('Method not implemented.');
  }
  IDPUNTO:number;
  NOMBRE:string;
  DIRECCION:string;
  TIPO:string;
  LATITUD:number;
  LONGITUD:number;
  MODIFICA:number;
  constructor(vid,vnombre,vdireccion,vtipo,vlatitud,vlongitud,vmodifica){
      this.IDPUNTO=vid;
      this.NOMBRE=vnombre;
      this.DIRECCION=vdireccion;
      this.TIPO=vtipo;
      this.LATITUD=vlatitud;
      this.LONGITUD=vlongitud;
      this.MODIFICA=vmodifica;
  }

  
}

export class modelopuntoaypinsertar{
  pipe(arg0: OperatorFunction<unknown, unknown>) {
    throw new Error('Method not implemented.');
  }
  NOMBRE:string;
  DIRECCION:string;
  TIPO:string;
  LATITUD:number;
  LONGITUD:number;
  REGISTRA:number;
  constructor(vnombre,vdireccion,vtipo,vlatitud,vlongitud,vregistra){
    
    this.NOMBRE=vnombre;
    this.DIRECCION=vdireccion;
    this.TIPO=vtipo;
    this.LATITUD=vlatitud;
    this.LONGITUD=vlongitud;
    this.REGISTRA=vregistra;
  }

  
}