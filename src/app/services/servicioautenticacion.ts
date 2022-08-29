import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { modelousuario } from '../model/modusuario';
import { environment } from '../../environments/environment';
import { serviciousuario } from './serviciousuario';
import { modpermiso } from '../model/modpermiso';
import { ToastrService } from 'ngx-toastr';

import { serviciopermiso } from './serviciopermiso';
import { serviciousuarioperfil } from './serviciousuarioperfil';
import { servicioperfilpermiso } from './servicioperfilpermiso';
import { modmenu } from '../model/modmenu';
import { modeloperfilpermiso } from '../model/modperfilpermiso';


@Injectable({ 
    providedIn: 'root' 
})
export class servicioautenticacion {
    private userSubject: BehaviorSubject<modelousuario>;
    public user: Observable<modelousuario>;
    listausuarios:modelousuario[]=[];
    lista:modpermiso[]=[];
    menu:modmenu[];
    accesos:modmenu[];
    menues=new EventEmitter<modmenu[]>();
    opcion=new EventEmitter<modmenu[]>();
    private listapermisosSubject:BehaviorSubject<modpermiso[]>
    public listapermisos:Observable<modpermiso[]>;
    ejecutar=false;
    permisos:modeloperfilpermiso[]=[];
    constructor(
        private router: Router,
        private http: HttpClient, private servusu:serviciousuario,
        private servpermisos:serviciopermiso,
        private servusuperf:serviciousuarioperfil,
        private servperfpermiso:servicioperfilpermiso,
        private mensajes:ToastrService
    ) {
        this.userSubject = new BehaviorSubject<modelousuario>(JSON.parse(localStorage.getItem('usuarioactual')));
        this.user = this.userSubject.asObservable();
        this.listapermisosSubject = new BehaviorSubject<modpermiso[]>(JSON.parse(localStorage.getItem('permisos')));
        this.listapermisos = this.listapermisosSubject.asObservable();
        this.menu=JSON.parse(localStorage.getItem('menu'));
        this.accesos=JSON.parse(localStorage.getItem('accesos'));
        
        this.menues.emit(this.menu);
        this.opcion.emit(this.accesos);
        this.traerusuarios(()=>{});
    }

    traerusuarios(cbusuarios){        
        this.servusu.getusuarios().subscribe(datos=>{
            datos.usuarios.forEach(element => this.listausuarios.push(element))
            cbusuarios();
        })
    }

    public get userValue(): modelousuario {
        return this.userSubject.value;
    }

    public get ListaPermisosValue(): modpermiso[] {
        return this.listapermisosSubject.value;
    }    
   

    login(usuario: string, password: string,cblogin) {
        var usuariotemp:modelousuario=null;
        this.permisos=[];
        
        this.servusu.getusuariopassword(usuario,password).subscribe(datos => { 
            
            if(datos.isOk=="S"){
                //TODO refactor
                usuariotemp = new modelousuario().mapModel(datos.usuario[0]);
                usuariotemp.id = datos.usuario[0].idusuario;
                usuariotemp.estado = datos.usuario[0].habilitado;
                // usuariotemp= new modelousuario(datos.usuario[0].idusuario,datos.usuario[0].login,
                //     datos.usuario[0].nombre,datos.usuario[0].apellido,datos.usuario[0].telefono
                //     ,datos.usuario[0].correo,datos.usuario[0].habilitado,"","",0
                //     ,"",0); 
                /* this.listausuarios.forEach(element=>{
                    if(datos.usuario[0].login==element.login)
                        usuariotemp= new modelousuario(element.id,element.login,element.nombre,element.apellido,element.telefono
                        ,element.correo,element.estado,element.primeravez,element.fecharegistro,element.usuarioregistra
                        ,element.fechamodificacion,element.usuariomodifica); 
                    
                }); */
                debugger;
                if (usuariotemp!=null){
                    this.menu=modmenu.cargarmenu();
                    this.accesos=modmenu.cargaraccesos();
                    localStorage.setItem('usuarioactual', JSON.stringify(usuariotemp));
                    this.userSubject.next(usuariotemp);
                    this.ObtenerPermisos(()=>
                        this.ObtenerPermisosMenuUsuario(()=>{},()=>{
                            if(this.lista.length>0){
                                
                                this.permisos.forEach(perusu=>{
                                    
                                    this.lista.forEach(eleper=>{
                                        if(perusu.idpermiso==eleper.idpermiso){
                                            eleper.estado=true;
                                            
                                        }
                                    })
                                }); 
                                this.listapermisosSubject.next(this.lista);
                                localStorage.setItem('permisos',JSON.stringify(this.lista));
                                      this.lista.forEach(liselem=>{
                                        
                                          if(liselem.estado==false){
                                            this.menu.forEach((elemenu,index)=>{
                                              if(liselem.idpermiso==elemenu.id){
                                                this.menu.splice(index,1);
                                                
                                              }
                                            })
        
                                            this.accesos.forEach((eleacc,index2)=>{
                                                if(liselem.idpermiso==eleacc.id){
                                                  this.accesos.splice(index2,1);
                                                }
                                              })
                                          }
                                        
                                      })
                                      
                                      
                                      localStorage.setItem('menu',JSON.stringify(this.menu));
                                      localStorage.setItem('accesos',JSON.stringify(this.accesos));
                                      this.opcion.emit(this.accesos);
                                      this.menues.emit(this.menu);
                                      
                                
                                    
                                
                            }
                            
                        })
                    );
                    
                    
                }
            } 
            
            cblogin();
        });
    }
        
    

    private ObtenerPermisos(cbOP){
        
        
        this.servpermisos.getpermisos().subscribe(permisos=>{
            this.lista=permisos;
            localStorage.setItem('permisos',JSON.stringify(this.lista));
            cbOP();
        });
            
        
      }

    private ObtenerPermisosMenuUsuario(cbOPMU,cbOPMU1){
        debugger;
        if (this.userValue!=null){
            
            this.servusuperf.getusuarioperfiles(this.userValue.id).subscribe(perfil=>{
                perfil.forEach(perfilel=>{
                    this.servperfpermiso.getperfilpermisos(perfilel.idperfil).subscribe(eleperm=>{
                        this.permisos=this.permisos.concat(eleperm); 
                        if(perfilel==perfil[perfil.length-1]){
                           cbOPMU1();
                        }
                        });
                        
                });
                cbOPMU();
            });
            
            
            
        }
      }

    
    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
        this.listapermisosSubject.next([]);
        this.userSubject.next(null);
        this.menu=[];
        this.menu.length=0;
        this.accesos=[];
        this.accesos.length=0;
        this.router.navigate(['authentication/login']);
    }
}