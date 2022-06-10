import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment.prod";
import { modeloperfil,modeloperfilactualizar,modeloperfilinsertar } from "../model/modperfil";

@Injectable({
    providedIn: 'root'
})

export class servicioperfil{
    private valorperfil:modeloperfil;
    private listaperfil:modeloperfil[]=[];
     
    private cadenahttp:string;
    constructor(private http: HttpClient){
        
        this.listaperfil= [];
        
    } 

    getperfil(id:number){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPerfil?idperfil="+id
        return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
            
            this.valorperfil = datos.usuario[0];
            
            
            return this.valorperfil;
          });

    }

     getperfiles(){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPerfiles"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listaperfil.length=0;
            this.listaperfil=[];
            datos.perfiles.forEach(element => {
                this.listaperfil.push(new modeloperfil(element.idperfil,element.nombreperfil,element.descripcionperfil
                    ,element.estadoperfil,element.fecharegistro,element.usuarioregistra
                    ,element.fechamodificacion,element.usuariomodificacion));
            });
            
            return this.listaperfil;
            
          }));
     }

     getperfilesfiltro(IdPermiso:number){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPerfilesDeUnPermiso?IdPermiso="+IdPermiso
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            this.listaperfil.length=0;
            this.listaperfil=[];
            datos.perfiles.forEach(element => {
                this.listaperfil.push(new modeloperfil(element.idperfil,element.nombreperfil,element.descripcionperfil
                    ,element.estadoperfil,element.fecharegistro,element.usuarioregistra
                    ,element.fechamodificacion,element.usuariomodificacion));
            });
            return this.listaperfil;
            
          }));
     }

     actualizar(perfil:modeloperfil){
        var perfact:modeloperfilactualizar;
         perfact=new modeloperfilactualizar(perfil.idperfil,perfil.nombreperfil,perfil.descripcionperfil,
            perfil.estadoperfil,perfil.usuariomodificacion);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPerfil"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(perfact);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
    }
     borrar(id:number){
         var resp=false;
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/EliminarPerfil?IdPerfil="+id
        return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
            if (datos.isOk="S"){
                resp=true;
            }
            
            
            return resp;
          });
        var resp=false;
        
        return resp;
     }

     habilitar(id:number){
        var resp=false;
       this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/HabilitarPerfil?idperfil="+id
       return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
           if (datos.isOk="S"){
               resp=true;
           }
           
           
           return resp;
         });
       var resp=false;
       
       return resp;
    }

    deshabilitar(id:number){
        var resp=false;
       this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/DeshabilitarPerfil?idperfil="+id
       return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
           if (datos.isOk="S"){
               resp=true;
           }
           
           
           return resp;
         });
       var resp=false;
       
       return resp;
    }



     agregar(perfil:modeloperfil){
        var perfact:modeloperfilinsertar;
        perfact=new modeloperfilinsertar(perfil.nombreperfil,perfil.descripcionperfil,
           perfil.estadoperfil,perfil.usuarioregistra);
       this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPerfil"
       const headers = { 'content-type': 'application/json'}  
       const body=JSON.stringify(perfact);
       
       return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
       
     }
}