import { Injectable } from "@angular/core";
import { modeloimagen, modeloimagenTotal, modelorequisito, modelorequisitoactualizar, modelorequisitoinsertar } from "../model/modrequisito";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment.prod";
import { buffer, map } from "rxjs/operators";
import { Observable } from "rxjs";
import * as Buffer from "Buffer";
import { WebElementPromise } from "protractor";


@Injectable({
    providedIn: 'root'
})

export class serviciorequisito{
    private listadetallereq:modeloimagen[]=[];
    private listarequisito:modelorequisito[]=[];
    private cadenahttp:string;
    constructor(private http: HttpClient){
        this.listarequisito= [];
    } 

    
    

     getrequisitos():Observable<any>{
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaRequisitos"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listarequisito.length=0;
            this.listarequisito=[];
            datos.requisitos.forEach(element => {
                this.listarequisito.push(new modelorequisito(element.idrequisito,element.nombrerequisito
                    ,element.estadorequisito,element.usuarioregistra,element.fecharegistro
                    ,element.usuariomodifica,element.fechamodificacion,element.idimagen
                    ,element.nombreimagen,element.imagenfisica,element.ancho,element.alto));
            });
                
                
            
            
            return this.listarequisito;
          }));
     }

     getrequisitosfiltro(filtro:string):Observable<any>{
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaRequisitos"
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listarequisito.length=0;
            this.listarequisito=[];
            datos.requisitos.forEach(element => {
                if(element.estadorequisito==filtro){
                    this.listarequisito.push(new modelorequisito(element.idrequisito,element.nombrerequisito
                        ,element.estadorequisito,element.usuarioregistra,element.fecharegistro
                        ,element.usuariomodifica,element.fechamodificacion,element.idimagen
                        ,element.nombreimagen,element.imagenfisica,element.ancho,element.alto));
                }
            });
                
                
            
            
            return this.listarequisito;
          }));
     }

     actualizar(requisito:modelorequisito){
         var reqact:modelorequisitoactualizar;
         
        reqact=new modelorequisitoactualizar(requisito.idrequisito,requisito.nombrerequisito,requisito.estadorequisito,requisito.usuariomodifica);
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaRequisito"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(reqact);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
        
    }
      borrar(id:number){
        var resp=false;
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/EliminarRequisito?IdRequisito="+id
        return this.http.post<any>(this.cadenahttp,null)/* .subscribe(datos => {
            if (datos.isOk="S"){
                resp=true;
            }
            
            
            return resp;
          }) */;
        
     }  
     agregar(requisito:modelorequisito){
        var reqag:modelorequisitoinsertar;
        
        reqag=new modelorequisitoinsertar(requisito.nombrerequisito,requisito.estadorequisito
            ,requisito.usuarioregistra);
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaRequisito"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(reqag);
        
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
       
     }

     agregarimagen(servicio:modeloimagenTotal){
        
       this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/InsertaImagenRequisito"
       const headers= new HttpHeaders()
            .set('content-type', 'application/json')
            .set('NombreImagen', servicio.nombreimagen)
            .set('Ancho',servicio.alto.toString())
            .set('Alto',servicio.ancho.toString())
            .set('Tipo',servicio.tipo.toString())
            .set('IdRequisito',servicio.idrequisito.toString());
       
       const body=this.base64ToArrayBuffer(servicio.imagenfisica);
       
       return this.http.post<any>(this.cadenahttp , body,{'headers':headers});

     }
     
     eliminarimagen(id:number){
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/EliminarImagen?IdImagen="+id
        return this.http.post<any>(this.cadenahttp,null);
 
      }


     getdetallerequisitos(idrequisito:Number):Observable<any>{
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaDetalleRequisito?IdRequisito="+idrequisito
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            this.listadetallereq.length=0;
            this.listadetallereq=[];
            datos.detallerequisito.forEach(element => {
                this.listadetallereq.push(new modeloimagen(element.idimagen,element.nombreimagen
                    ,element.imagenfisica,element.ancho,element.alto));
            });
            
            return this.listadetallereq;
          }));
     }

     base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}