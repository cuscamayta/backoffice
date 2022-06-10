import { nodo } from './nodo';
export class hoja{
    value:number;
    text:string;
    children:nodo[];
    
    constructor(vvalue,vtext,vhijos:nodo[]){
        this.value=vvalue;
        this.text=vtext;
        this.children.length=0;
        this.children=[];
        vhijos.forEach(elemento=>{
            this.children.push(new nodo(elemento.value,elemento.text));
        })
        
    }
    
    agregarhijo(id,nombre){
        this.children.push(id,nombre);
    }

    borrarhijo(value,text){
        let i=0;
        for(i=0;i<this.children.length;i++){
            if(this.children[i].value==value && this.children[i].text==text){
                this.children.splice(i,1);
            }
        }
            
        
    }
    
}