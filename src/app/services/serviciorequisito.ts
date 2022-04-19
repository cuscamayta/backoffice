import { Injectable } from "@angular/core";
import { modelousuario, modelousuarioactualizar, modelousuarioinsertar } from "../model/modusuario";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment.prod";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class serviciousuario{
    private valorusuario:modelousuario;
    private listausuario:modelousuario[]=[];
    private cadenahttp:string;
    constructor(private http: HttpClient){
        this.listausuario= [];
        console.log(this.listausuario.toString());
    } 

    getusuariopassword(usuario:string,password:string){

        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/Login?P_NoLogi="+usuario+"&P_Pass="+password
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            var resp=null;
            if (datos.isOk=="S"){
            resp = this.getusuario(1);
            }
            return resp;
          }));
         

    }
    getusuario(id:number){
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaUsuario?idusuario="+id
        return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
            
            this.valorusuario = datos.usuario[0];
            console.log(datos.usuario[0]);
            console.log(this.valorusuario);
            return this.valorusuario;
          });
          

     }

     getusuarios():Observable<any>{
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaUsuarios"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            console.log(datos);
            this.listausuario.length=0;
            this.listausuario=[];
            datos.usuarios.forEach(element => {
                this.listausuario.push(new modelousuario(element.id,element.login,element.nombre,element.apellido,element.telefono
                    ,element.correo,element.estado,element.primeravez,element.fecharegistro,element.usuarioregistra
                    ,element.fechamodificacion,element.usuariomodifica));
            });
                
                
            
            console.log(this.listausuario);
            return this.listausuario;
          }));
     }

     actualizar(usuario:modelousuario,contrasena:string){
         var usuact:modelousuarioactualizar;
         usuact=new modelousuarioactualizar(usuario.id,usuario.login,contrasena,usuario.nombre,usuario.apellido
            ,usuario.telefono,usuario.correo, usuario.estado, usuario.primeravez,usuario.usuariomodifica);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaUsuario"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(usuact);
        console.log(body)
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
    }
      borrar(id:number){
        var resp=false;
        
        return true;
     }  

     agregar(usuario:modelousuario){
        var usuag:modelousuarioinsertar;
         usuag=new modelousuarioinsertar(usuario.login,usuario.login,usuario.nombre,usuario.apellido
            ,usuario.telefono,usuario.correo, usuario.estado, usuario.primeravez,usuario.usuarioregistra);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaUsuario"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(usuag);
        console.log(body)
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
       
     }
}