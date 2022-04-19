import { OperatorFunction } from "rxjs";

export class modelorequisito{
    pipe(arg0: OperatorFunction<unknown, unknown>) {
      throw new Error('Method not implemented.');
    }
    idrequisito:number;
    nombrerequisito:string;
    estadorequisito:string;
    fecharegistro?:string;
    usuarioregistra?:number;
    fechamodificacion?:string;
    usuariomodifica?:number;
    
    constructor(vid:number,vlogin:string,vnombre:string,vapellido:string,vtelefono:string,vcorreo:string,vestado:string,vprivez:string,vfechareg:string,vusureg:number,vfecmod:string,vusumod:number){
        this.idrequisito=vid;
        this.nombrerequisito=vnombre;
        this.estadorequisito=vestado;
        this.fecharegistro=vfechareg;
        this.usuarioregistra=vusureg;
        this.fechamodificacion=vfecmod;
        this.usuariomodifica=vusumod;
    }

    
}

export class modelousuarioactualizar{

  IDUSUA:number;
  DSUSUALOGI:string;
  DSUSUAPASS:string;
  DSNOMB:string;
  DSAPEL:string;
  DSTELE:string;
  DSMAIL:string;
  OPESTA:string;
  OPPRIM:string;
  IDUSUAMODI:number;
  
  constructor(id,login,pass,nombre,apellido,telefono,correo,estado,privez,usumod){
      this.IDUSUA=id;
      this.DSUSUALOGI=login;
      this.DSUSUAPASS=pass;
      this.DSNOMB=nombre;
      this.DSAPEL=apellido;
      this.DSTELE=telefono;
      this.DSMAIL=correo;
      this.OPESTA=estado;
      this.OPPRIM=privez;
      this.IDUSUAMODI=usumod;
      
      
  }

  
}

export class modelousuarioinsertar{

  
  DSUSUALOGI:string;
  DSUSUAPASS:string;
  DSNOMB:string;
  DSAPEL:string;
  DSTELE:string;
  DSMAIL:string;
  OPESTA:string;
  OPPRIM:string;
  IDUSUAREGI:number;
  
  constructor(login,pass,nombre,apellido,telefono,correo,estado,privez,usureg){
      this.DSUSUALOGI=login;
      this.DSUSUAPASS=pass;
      this.DSNOMB=nombre;
      this.DSAPEL=apellido;
      this.DSTELE=telefono;
      this.DSMAIL=correo;
      this.OPESTA=estado;
      this.OPPRIM=privez;
      this.IDUSUAREGI=usureg;
      
      
  }

  
}
