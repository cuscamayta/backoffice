import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { modelopuntoayp,modelopuntoaypactualizar,modelopuntoaypinsertar } from "../model/modpuntoayp";
import { modelousuario } from "../model/modusuario";
import { servicioautenticacion } from "./servicioautenticacion";

@Injectable({
    providedIn: 'root'
})

export class serviciopuntoayp{
    private valorpuntoayp:modelopuntoayp;
    private listapuntoayp:modelopuntoayp[]=[];
    private cadenahttp:string;
    private valorusuario:modelousuario;
     
    constructor(private http: HttpClient,servaut:servicioautenticacion){
        
        this.listapuntoayp= [];
        
        this.valorusuario=servaut.userValue;
    } 

     getpuntoayps(){

        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPuntosAtencionPago"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listapuntoayp.length=0;
            this.listapuntoayp=[];
            datos.puntos.forEach(element => {
                this.listapuntoayp.push(new modelopuntoayp(element.idpunto,element.nombre,element.direccion
                    ,element.idtipo,element.tipo,element.latitud,element.longitud));
            });
                
                
            
            
            return this.listapuntoayp;
          }));
     }

     getpuntoaypsfiltro(tipo:number){

        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPuntosAtencionPago"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listapuntoayp.length=0;
            this.listapuntoayp=[];
            datos.puntos.forEach(element => {
                this.listapuntoayp.push(new modelopuntoayp(element.idpunto,element.nombre,element.direccion
                    ,element.idtipo,element.tipo,element.latitud,element.longitud));
            });
                
                
            
            
            return this.listapuntoayp;
          }));
     }

     actualizar(puntoayp:modelopuntoayp){
        var papact:modelopuntoaypactualizar;

        papact=new modelopuntoaypactualizar(puntoayp.idpunto,puntoayp.nombre,puntoayp.direccion,
            puntoayp.idtipo,puntoayp.latitud,puntoayp.longitud,this.valorusuario.id);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPunto"
         const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(papact);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
    }

     borrar(id:number){
        var resp=false;
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/EliminarPunto?IdPunto="+id
        return this.http.post<any>(this.cadenahttp,null).subscribe(datos => {
            if (datos.isOk="S"){
                resp=true;
            }
            
            
            return resp;
          });
        
     }

     agregar(puntoayp:modelopuntoayp){
        var papact:modelopuntoaypinsertar;

        papact=new modelopuntoaypinsertar(puntoayp.nombre,puntoayp.direccion,
            puntoayp.idtipo,puntoayp.latitud,puntoayp.longitud,this.valorusuario.id);
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPunto"
         const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(papact);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
       
     }
}