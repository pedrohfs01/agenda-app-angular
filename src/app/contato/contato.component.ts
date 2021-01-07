import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoService } from '../services/contato.service';
import { Contato } from './contato';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;

  contatos: Contato[] = []

  colunas = ["id", "nome", "email", "favorito"];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos();
  }

  montarFormulario(){
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  listarContatos(){
    this.service.listarTodos().subscribe(response => {
      this.contatos = response;
    });
  }

  submit(){
    const formValues = this.formulario.value;
    const c: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(c).subscribe(response => {
      this.contatos.push(response);
    });
  }

}
