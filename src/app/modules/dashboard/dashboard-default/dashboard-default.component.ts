import { Component, OnInit } from '@angular/core';
import { servicioautenticacion } from '../../../services/servicioautenticacion';

import { modmenu } from '../../../model/modmenu';

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







