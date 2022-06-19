import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment.prod";
import { modelousuarioperfil, modelousuarioperfilact} from "../model/modusuarioperfil";
import { map } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class serviciousuarioperfil{
    private cadenahttp:string;
    private valorusuarioperfil:modelousuarioperfil;
    private listausuarioperfil:modelousuarioperfil[]=[];
     
    constructor(private http: HttpClient){
        
        this.listausuarioperfil.length=0;
    } 

     getusuarioperfiles(vidusuario:number):Observable<any>{
        
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaUsuario2/"+vidusuario
        
        this.listausuarioperfil.length=0;
        this.listausuarioperfil=[];
        return this.http.get(this.cadenahttp).pipe(map((datos:any) => {
            console.log(datos.perfiles);
            datos.perfiles.forEach(element => this.listausuarioperfil.push(new modelousuarioperfil(element.idusuario,element.idperfil)));
            
            return this.listausuarioperfil; 
          }));
       
     }

     

    
     agregar(usuarioperfil:modelousuarioperfil){
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/AsignarPerfil?IdUsuario="+usuarioperfil.idusuario+"&IdPerfil="+usuarioperfil.idperfil
        return this.http.post<any>(this.cadenahttp,null);
       
     }


     
     borrar(idusuario:number,idperfil:number){
     
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/DesasignarPerfil?IdUsuario="+idusuario+"&IdPerfil="+idperfil
        return this.http.post<any>(this.cadenahttp,null);
       
     }

     actualizarperfiles(usuario:modelousuarioperfilact){
        
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/ActualizaPerfilesDeUnUsuario"
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(usuario);
        console.log(usuario);
        return this.http.post<any>(this.cadenahttp , body,{'headers':headers});
    }
}