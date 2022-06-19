import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";
import { modeloperfilpermiso, modeloperfilpermisoact } from "../model/modperfilpermiso";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
@Injectable({
    providedIn: 'root'
})

export class servicioperfilpermiso{
    private cadenahttp:string;
    private valorperfilpermiso:modeloperfilpermiso;
    private listaperfilpermiso:modeloperfilpermiso[]=[];
     
    constructor(private http: HttpClient){
        
        this.listaperfilpermiso= [];
        
    } 

    

     getperfilpermisos(idperfil:number){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPermisosDeUnPerfil?IdPerfil="+idperfil
        
        this.listaperfilpermiso.length=0;
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {

            datos.permisoperfil.forEach(element => {this.listaperfilpermiso.push(new modeloperfilpermiso(element.idperfil,element.idpermiso)); 
                
            });
            return this.listaperfilpermiso;
          }));
       
     }
     
    
     borrar(idperfil:number,idpermiso:number){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/DesasignarPermiso?IdPerfil="+idperfil+"&IdPermiso="+idpermiso
        return this.http.post<any>(this.cadenahttp,null);
     }
     

     agregar(perfilpermiso:modeloperfilpermiso){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/AsignarPermiso?IdPerfil="+perfilpermiso.idperfil+"&IdPermiso="+perfilpermiso.idpermiso
        return this.http.post<any>(this.cadenahttp,null);
       
     }

     actualizarpermisos(perfil:modeloperfilpermisoact){
        
        
       this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPermisosDeUnPerfil"
       const headers = { 'content-type': 'application/json'}  
       const body=JSON.stringify(perfil);
       console.log(perfil);
       return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
   }
}