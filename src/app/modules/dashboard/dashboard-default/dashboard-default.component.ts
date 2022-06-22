import { Component, OnInit } from '@angular/core';
import { servicioautenticacion } from '../../../services/servicioautenticacion';

import { modmenu } from '../../../model/modmenu';
import { serviciopermiso } from '../../../services/serviciopermiso';
import { servicioperfil } from '../../../services/servicioperfil';
import { modpermiso } from 'src/app/model/modpermiso';
import { modeloperfil } from 'src/app/model/modperfil';

@Component({
  selector: 'app-dashboard-default',
  templateUrl: './dashboard-default.component.html',
  styleUrls: [
    './dashboard-default.component.scss',
    '../../../../assets/icon/svg-animated/svg-weather.css'
  ]
})
export class DashboardDefaultComponent implements OnInit{

  acceso2:modmenu[];
 

  constructor(private _servicioautenticacion:servicioautenticacion) { 

  }
  ngOnInit() {
    this.acceso2=JSON.parse(localStorage.getItem('accesos'));
    this._servicioautenticacion.opcion.subscribe(valor=>{this.acceso2=valor;
    });
    
    
  }

  
 

  

}







