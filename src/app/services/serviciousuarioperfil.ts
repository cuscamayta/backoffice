import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment.prod";
import { modelousuarioperfil} from "../model/modusuarioperfil";
import { map } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class serviciousuarioperfil{
    private cadenahttp:string;
    private valorusuarioperfil:modelousuarioperfil;
    private listausuarioperfil:modelousuarioperfil[]=[];
     
    constructor(private http: HttpClient){
        console.log("entro al constructor");
        this.listausuarioperfil.length=0;
    } 

     getusuarioperfiles(vidusuario:number){
        
        
        this.cadenahttp=environment.apiURL + "/clwprd/ws_pagosweb/cre.movilapp/RetornaPerfilesDeUnUusario?IdUsuario="+vidusuario
        console.log(this.cadenahttp);
        this.listausuarioperfil.length=0;
        this.listausuarioperfil=[];
        return this.http.post<any>(this.cadenahttp,null).pipe(map(datos => {
            
            datos.perfilusuario.forEach(element => this.listausuarioperfil.push(new modelousuarioperfil(element.idusuario,element.idperfil)));
            console.log(this.listausuarioperfil.length);
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
}