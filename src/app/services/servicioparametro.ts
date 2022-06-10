import { Injectable } from "@angular/core";
import { modeloparametro } from "../model/modparametro";

@Injectable({
    providedIn: 'root'
})

export class servicioparametro{
    private valorparametro:modeloparametro;
    private listaparametro:modeloparametro[]=[];
     
    constructor(){
        
        this.listaparametro= [new modeloparametro(1,"Contraseña","cre123","Contraseña asignada a los nuevos usuarios"),new modeloparametro(2,"IntervaloProximidadAP","3","Intervalo de tiempo para notificaciones por proximidad")];
        
    } 

    getparametro(id:number){
         var resp=null;
        for(var i=0;i<this.listaparametro.length;i++){
            if (this.listaparametro[i].id==id)
            { 
                resp=this.listaparametro[i];
                
            }
        }
        return resp;

     }

     getparametros(){
         return this.listaparametro;
     }

     actualizar(parametro:modeloparametro){
         var resp=false;
        for(var i=0;i<this.listaparametro.length;i++){
            if (this.listaparametro[i].id==parametro.id)
            { 
                this.listaparametro[i].parametro=parametro.parametro;
                this.listaparametro[i].valor=parametro.parametro;
                this.listaparametro[i].descripcion=parametro.descripcion;
                resp=true;
                
            }
        }
        return resp;
        
    }
     borrar(id:number){
        var resp=false;
        for(var i=0;i<this.listaparametro.length;i++){
            if (this.listaparametro[i].id==id)
            { 
                this.listaparametro.splice(i,1);
                resp=true;
                
            }
        }
        return resp;
     }

     agregar(parametro:modeloparametro){
        var resp=false;
       for(var i=0;i<this.listaparametro.length;i++){
           if (this.listaparametro[i].id==parametro.id)
           { 
               
               resp=true;
               
           }
       }
       if (!resp){
           this.listaparametro.push(parametro);
       }
       return !resp;
       
     }
}