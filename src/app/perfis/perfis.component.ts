import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfis',
  standalone: true,
  imports: [    
    FormsModule,
    CommonModule],
  templateUrl: './perfis.component.html',
  styleUrl: './perfis.component.css'
})
export class PerfisComponent {

  constructor(private http: HttpClient, 
              private router: Router) {}


  voltar() {
    this.router.navigate(['/usuarios']);
  }


}
