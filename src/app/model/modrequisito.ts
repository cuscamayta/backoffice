import { OperatorFunction } from "rxjs";

export class modelorequisito{
    pipe(arg0: OperatorFunction<unknown, unknown>) {
      throw new Error('Method not implemented.');
    }
    idrequisito:number;
    nombrerequisito:string;
    estadorequisito:string;
    usuarioregistra:number;
    fecharegistro:string;
    usuariomodifica:number;
    fechamodificacion:string;
    idimagen:number;
    nombreimagen:string;
    imagenfisica:string;
    ancho:number;
    alto:number;
    
    constructor(vid:number,vnombre:string,vestado:string,vusureg:number,vfechareg:string,
      vusumod:number,vfecmod:string,vidimg:number,vnomimg:string,vimagen:string,vancho:number,valto:number){
        this.idrequisito=vid;
        this.nombrerequisito=vnombre;
        this.estadorequisito=vestado;
        this.fecharegistro=vfechareg;
        this.usuarioregistra=vusureg;
        this.fechamodificacion=vfecmod;
        this.usuariomodifica=vusumod;
        this.idimagen=vidimg;
        this.nombreimagen=vnomimg;
        this.imagenfisica=vimagen;
        this.ancho=vancho;
        this.alto=valto;
    }

    
}

export class modeloimagen{
  pipe(arg0: OperatorFunction<unknown, unknown>) {
    throw new Error('Method not implemented.');
  }
  idimagen:number;
  nombreimagen:string;
  imagenfisica:string;
  ancho:number;
  alto:number;
 
  
  
  constructor(vid:number,vnombre:string,vimagen:string,vancho:number,valto:number){
      this.idimagen=vid;
      this.nombreimagen=vnombre;
      this.imagenfisica=vimagen;
      this.ancho=vancho;
      this.alto=valto;
  }
}


export class modeloimagenTotal{
  pipe(arg0: OperatorFunction<unknown, unknown>) {
    throw new Error('Method not implemented.');
  }
  idimagen:number;
  nombreimagen:string;
  imagenfisica:string;
  ancho:number;
  alto:number;
  tipo:number;
  idrequisito:number;
  
  
  constructor(vid:number,vnombre:string,vimagen:string,vancho:number,valto:number,vtipo:number,vidreq:number){
      this.idimagen=vid;
      this.nombreimagen=vnombre;
      this.imagenfisica=vimagen;
      this.ancho=vancho;
      this.alto=valto;
      this.tipo=vtipo;
      this.idrequisito=vidreq;
  }
}

export class modelorequisitoactualizar{
  IDREQUSERV:number;
  NOREQUSERV:string;
  STREQUSERV:string;
  IDUSUAMODI:number;
  
  constructor(id,nombre,estado,usumod){
      this.IDREQUSERV=id;
      this.NOREQUSERV=nombre;
      this.STREQUSERV=estado;
      this.IDUSUAMODI=usumod;
      
      
  }

  
}

export class modelorequisitoinsertar{
  NOREQUSERV:string;
  STREQUSERV:string;
  IDUSUAREGI:number;
  
  constructor(nombre,estado,usureg){

      this.NOREQUSERV=nombre;
      this.STREQUSERV=estado;
      this.IDUSUAREGI=usureg;
      
      
  }
  
}
