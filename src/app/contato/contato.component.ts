import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
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

  colunas = ["foto", "id", "nome", "email", "favorito"];

  totalElements = 0;
  pagina = 0;
  tamanho = 5;
  pageSizeOptions: number[] = [5];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  montarFormulario(){
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  favoritar(contato: Contato){
    this.service.favourite(contato).subscribe(response => {
      contato.favorito = !contato.favorito;
    })
   }

  listarContatos(pagina = 0, tamanho = 10){
    this.service.listarTodos(pagina, tamanho).subscribe(response => {
      this.contatos = response['content'];
      this.totalElements = response["totalElements"];
      this.pagina = response["number"];
    });
  }

  submit(){
    const formValues = this.formulario.value;
    const c: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(c).subscribe(response => {
      let lista: Contato[] = [...this.contatos, response]
      this.contatos = lista;
    });
  }

  uploadFoto(event, contato){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append("foto", foto);
      this.service
            .upload(contato, formData)
            .subscribe(response => this.listarContatos());
    }
  }

  visualizarContato(contato: Contato){
    this.matDialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: "450px",
      data: contato
    })
  }

  paginar(event: PageEvent){
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho)
  }
}
