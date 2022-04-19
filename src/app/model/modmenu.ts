export class modmenu {
    id: number;
    nombre: string;
    descripcion:string;
    ruta:string;
    imagen:string;
    visiblemenu:boolean;
    visibledash:boolean;
    especial:string;
    selecmenu:string;
   
    constructor(id,nombre,descripcion,ruta,imagen,visiblem,visibled,especial="",selecmenu="['selected-menu']"){
      this.id=id;
      this.nombre=nombre;
      this.descripcion=descripcion;
      this.ruta=ruta;
      this.imagen=imagen;
      this.visiblemenu=visiblem;
      this.visibledash=visibled;
      this.especial=especial;
      this.selecmenu=selecmenu;
    }

    static cargarmenu():modmenu[]{
       var resp:modmenu[]=[];
       resp.push(new modmenu(1,"gestseg","Gestión Seguridad","['/perfil']","",true,false,"",""));
       resp.push(new modmenu(2,"perfiles","Perfiles","/perfil","assets/images/all-regulations.svg",true,true,'class="sub-menu-item"',"['selected-menu']"));
       resp.push(new modmenu(3,"usuarios","Usuarios","/usuario","assets/images/usuario.svg",true,true,'class="sub-menu-item"',"['selected-menu']"));
       //resp.push(new modmenu(4,"contrasena","Contraseña","/changepass","",false,false,"","['selected-menu']"));
       resp.push(new modmenu(5,"requisitos","Requisitos de Servicio","/servicio","assets/images/services.svg",true,true,"","['selected-menu']"));
       resp.push(new modmenu(6,"puntosayp","Puntos de Atención","/puntoayp","assets/images/point.svg",true,true,"","['selected-menu']"));
       //resp.push(new modmenu(7,"parametros","Parametros","/parametro","assets/images/parameter.svg",false,false,"","['selected-menu']"));
       return resp;
    }

    static cargaraccesos():modmenu[]{
      var resp:modmenu[]=[];
      //resp.push(new modmenu(1,"gestseg","Gestión Seguridad","/perfil","",true,false,"",""));
      resp.push(new modmenu(2,"perfiles","Perfiles","/perfil","assets/images/all-regulations.svg",true,true,'class="sub-menu-item"',"['selected-menu']"));
      resp.push(new modmenu(3,"usuarios","Usuarios","/usuario","assets/images/usuario.svg",true,true,'class="sub-menu-item"',"['selected-menu']"));
      //resp.push(new modmenu(4,"contrasena","Contraseña","/changepass","",false,false,"","['selected-menu']"));
      resp.push(new modmenu(5,"requisitos","Requisitos de Servicio","/servicio","assets/images/services.svg",true,true,"","['selected-menu']"));
      resp.push(new modmenu(6,"puntosayp","Puntos de Atención","/puntoayp","assets/images/point.svg",true,true,"","['selected-menu']"));
      //resp.push(new modmenu(7,"parametros","Parametros","/parametro","assets/images/parameter.svg",false,false,"","['selected-menu']"));
      return resp;
   }
  }
  