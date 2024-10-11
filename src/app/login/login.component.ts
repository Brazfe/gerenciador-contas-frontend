import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule,
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

    this.http.get('http://localhost:8080/api/security/secure-endpoint', { headers, responseType: 'text' }).subscribe({
        next: (response) => {
          this.loginFailed = false;            
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          this.loginFailed = true;            
        }
    });
}



}
