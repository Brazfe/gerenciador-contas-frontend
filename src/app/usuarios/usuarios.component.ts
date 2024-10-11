import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfisService } from '../services/perfis.service';
import { UsuariosService } from '../services/usuarios.service';



@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
    
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent  {


  usuarioForm!: FormGroup;
  usuarios: any[] = [];
  perfis: any[] = [];


  constructor(private http: HttpClient, 
              private router: Router,
              private fb: FormBuilder, 
              private usuarioServico: UsuariosService,
              private perfilService: PerfisService) {


        this.usuarioForm = this.fb.group({
                  usuario: ['', Validators.required],
                  nome: ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  senha: ['', Validators.required],
                  perfil: ['', Validators.required]
                });

      this.carregarPerfis();
      this.carregaUsuarios(); 

         
  
  }



  redirecionarNovoUsuario() {
    this.router.navigate(['/perfis']);
  }



  salvarUsuario(): void {
    if (this.usuarioForm.valid) {
        const perfilId = this.usuarioForm.get('perfil')?.value;

        const usuario = {
            usuario: this.usuarioForm.get('usuario')?.value,
            nome: this.usuarioForm.get('nome')?.value,
            senha: this.usuarioForm.get('senha')?.value,
            email: this.usuarioForm.get('email')?.value,
            perfil: { id: perfilId } 
        };

        this.usuarioServico.salvarUsuario(usuario).subscribe(
            (res: any) => {

                this.carregaUsuarios(); 
                
                this.usuarioForm = this.fb.group({
                  usuario: ['', Validators.required],
                  nome: ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  senha: ['', Validators.required],
                  perfil: ['', Validators.required]
                });

            },
            (err: any) => { 
                console.error('Erro ao salvar usuário', err);
            }
        );
    } else {
        console.log('Formulário inválido');
        this.usuarioForm.markAllAsTouched(); 
    }
}

  
  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe((data) => {
      console.log('perfis')
      console.log(data)
      this.perfis = data;
    });
  }

  carregaUsuarios(): void {
    this.usuarioServico.buscarUsuarios().subscribe(
      (data: any) => {  
        this.usuarios = data; 
      },
      (err: any) => {
        console.error('Erro ao carregar usuários', err);
      }
    );
  }
  


}
