import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { servicioautenticacion } from '../../../../../app/services/servicioautenticacion';
import { modpermiso } from '../../../../model/modpermiso';
import { serviciopermiso } from '../../../../../app/services/serviciopermiso';
import { serviciousuarioperfil } from '../../../../../app/services/serviciousuarioperfil';
import { servicioperfilpermiso } from '../../../../../app/services/servicioperfilpermiso';
import { ToastrService } from 'ngx-toastr';
import { servicioperfil } from '../../../../../app/services/servicioperfil';
import { modeloperfil } from '../../../../model/modperfil';

@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss']
})
export class BasicLoginComponent  implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  listapermisos:modpermiso[]=[];
  
  listaperfiles:modeloperfil[]=[];
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: servicioautenticacion,
      private servpermisos:serviciopermiso,
      private servperfil:servicioperfil,
      private servusuperf:serviciousuarioperfil,
      private servperfpermiso:servicioperfilpermiso,
      private mensaje:ToastrService
  ) { 
      // redirect to home if already logged in
      
      
      if (this.authenticationService.userValue) { 
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    
    this.submitted = true;
    

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value,()=>{
        
        
            
        if (this.authenticationService.userValue!=null){
            this.servperfil.getperfiles()
            .subscribe(
            res => {
                this.listaperfiles = res;
                localStorage.setItem('perfiles',JSON.stringify(this.listaperfiles));
            
            });
            this.router.navigate([this.returnUrl]);
        }
        else{
            this.mensaje.error("Usuario o Contraseña erroneos");
            this.loading=false;
            
            return;
        }
        
        
    });
              
  }

  
}
