import { Injectable } from "@angular/core";
import { modpermiso,modpermisoactualizar,modpermisoinsertar } from "../model/modpermiso";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment.prod";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class serviciopermiso{
    private valorpermiso:modpermiso;
    private listapermiso:modpermiso[]=[];
    private cadenahttp:string;
    constructor(private http: HttpClient){
        this.listapermiso= [];
        
    } 

    
    getpermiso(id:number){
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPermiso?idpermiso="+id
        return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
            
            this.valorpermiso = new modpermiso(datos.permiso[0].idpermiso,datos.permiso[0].nombrepermiso,datos.permiso[0].pantallapermiso,
                datos.permiso[0].idpadre,datos.permiso[0].orden);

            return this.valorpermiso;
          });
          

     }

     getpermisos(){
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPermisos"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listapermiso.length=0;
            this.listapermiso=[];
            datos.permisos.forEach(element => {
                this.listapermiso.push(new modpermiso(element.id,element.nombrepermiso,element.pantallapermiso,element.idpadre,element.orden));
                    
            });

            return this.listapermiso;
          }));
     }

     actualizar(permiso:modpermiso){
         var permact:modpermisoactualizar;
         permact=new modpermisoactualizar(permiso.nombrepermiso,permiso.pantallapermiso,permiso.idpadre,permiso.orden);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPermiso"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(permact);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
    }
        

     agregar(permiso:modpermiso){
        var permag:modpermisoinsertar;
        permag=new modpermisoinsertar(permiso.idpadre,permiso.nombrepermiso,permiso.pantallapermiso,permiso.idpadre,permiso.orden);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPermiso"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(permag);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
       
     }
}