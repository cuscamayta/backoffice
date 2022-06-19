export class modeloperfilpermiso{
    idpermiso:number;
    idperfil:number;
    
    constructor(vidperfil,vidpermiso){
        this.idpermiso=vidpermiso;
        this.idperfil=vidperfil;
        
    }

    
}

export class actpermiso{
    public idpermiso:number;

    constructor(id:number){
        this.idpermiso=id;
    }
}

export class actpermisosperfil{
    public idperfil:number;
    public permisos:actpermiso[];

    constructor(){
        this.idperfil=null;
        this.permisos=[];
    }
}

export class modeloperfilpermisoact{
    public perfil:actpermisosperfil;

     constructor(){
         this.perfil=new actpermisosperfil();
     }
}