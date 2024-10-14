import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  usuarioSelecionadoId: number | null = null; 

  isAdmin: boolean = false;
  username: String = new String();

  isDesabilitaPerfil: boolean = false;
  isDesabilitaSalvar: boolean = false;



  usuariosFiltrados: any[] = [];


  constructor(private http: HttpClient, 
              private router: Router,
              private fb: FormBuilder, 
              private usuarioServico: UsuariosService,
              private perfilService: PerfisService,
              private route: ActivatedRoute) {



      this.trataRegramentoPerfil();
      this.carregarPerfis();
      this.carregaUsuarios(); 

      this.usuarioForm = this.fb.group({
        usuario: ['', Validators.required],
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', Validators.required],
        perfil: [{ value: '', disabled: this.isDesabilitaPerfil }, Validators.required]
      });
         
  
  }



  sair() {
    this.router.navigate(['/login']);
  }



  salvarUsuario(): void {
    if (this.usuarioForm.valid) {
      const perfilId = this.usuarioForm.get('perfil')?.value;
      const usuario = {
        id: this.usuarioSelecionadoId, 
        usuario: this.usuarioForm.get('usuario')?.value,
        nome: this.usuarioForm.get('nome')?.value,
        senha: this.usuarioForm.get('senha')?.value,
        email: this.usuarioForm.get('email')?.value,
        perfil: { id: perfilId }
      };

      if (this.usuarioSelecionadoId) {
        this.usuarioServico.editarUsuario(usuario).subscribe(
          (res: any) => {
            this.carregaUsuarios();
            this.limparFormulario();
          },
          (err: any) => {
            console.error('Erro ao editar usuário', err);
          }
        );
      } else {
        this.usuarioServico.salvarUsuario(usuario).subscribe(
          (res: any) => {
            this.carregaUsuarios();
            this.limparFormulario();
          },
          (err: any) => {
            console.error('Erro ao salvar usuário', err);
          }
        );
      }
    } else {
      console.log('Formulário inválido');
      this.usuarioForm.markAllAsTouched();
    }
  }

  editarUsuario(usuario: any): void {


    const perfilCorrespondente = this.perfis.find(perfil => perfil.tipoPerfil === usuario.perfil);

    this.usuarioSelecionadoId = usuario.id; 
    this.usuarioForm.patchValue({
      usuario: usuario.usuario,
      nome: usuario.nome,
      email: usuario.email,
      senha: '', 
      perfil: perfilCorrespondente ? perfilCorrespondente.id : null 
    });

    if (usuario.id) {
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
    }

    this.isDesabilitaSalvar = false;


  }

  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe((data) => {
      this.perfis = data;
    });
  }

  trataRegramentoPerfil(): void {
    this.route.queryParams.subscribe(params => {
      const tipoPerfil = params['tipoPerfil'];
      this.username = params['username'];

      if(tipoPerfil == 'Administrador'){
        this.isAdmin = true;
      }else{
        this.isAdmin = false;
      }

    });

  }

  carregaUsuarios(): void {
    this.usuarioServico.buscarUsuarios().subscribe(
      (data: any) => {  
        this.usuarios = data; 
        this.filtrarUsuarios();
        this.usuarioForm = this.fb.group({
          usuario: ['', Validators.required],
          nome: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          senha: ['', Validators.required],
          perfil: [{ value: '', disabled: this.isDesabilitaPerfil }, Validators.required]
        });
      },
      (err: any) => {
        console.error('Erro ao carregar usuários', err);
      }
    );
  }

  filtrarUsuarios(): void {
    if(this.isAdmin === false){
      this.usuarios = this.usuarios.filter(usuario => usuario.usuario === this.username);
      this.isDesabilitaPerfil = true;
      this.isDesabilitaSalvar = true;
    }

  }
  
  limparFormulario(): void {
    this.usuarioForm.reset();
    this.usuarioSelecionadoId = null;
  }

  
  excluirUsuario(usuario: any) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
      this.usuarioServico.excluirUsuario(usuario.id).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id); 
        alert('Usuário excluído com sucesso!');
      }, error => {
        alert('Erro ao excluir o usuário.');
        console.error(error);
      });
    }
  }
  


}
