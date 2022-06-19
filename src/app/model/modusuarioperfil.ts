export class modelousuarioperfil{
    idusuario:number;
    idperfil:number
    
    constructor(vidusuario,vidperfil){
        this.idusuario=vidusuario;
        this.idperfil=vidperfil;
        
    }

    
}

export class actperfil{
    public idperfil:number;

    constructor(id:number){
        this.idperfil=id;
    }
}

export class actperfilesusuario{
    public idusuario:number;
    public perfiles:actperfil[];

    constructor(){
        this.idusuario=null;
        this.perfiles=[];
    }
}

export class modelousuarioperfilact{
    public usuario:actperfilesusuario;

     constructor(){
         this.usuario=new actperfilesusuario();
     }
}