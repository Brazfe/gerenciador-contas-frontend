import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule, 
    MatInputModule
    ] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  loginFailed: boolean = false;

  constructor(private http: HttpClient, 
              private router: Router) {}

  login() {
    const headers = new HttpHeaders({
        Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`)
    });

    this.http.get(`http://localhost:8080/api/security/secure-endpoint?username=${this.username}`, { headers }).subscribe({
        next: (response: any) => {
          this.loginFailed = false;      
          const tipoPerfil = response.tipoPerfil; 
          const username = response.username;
          this.router.navigate(['/usuarios'], { queryParams: { tipoPerfil, username } });
        },
        error: (err) => {
          this.loginFailed = true;            
        }
    });
}



}
