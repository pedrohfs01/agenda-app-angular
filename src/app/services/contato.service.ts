import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contato } from '../contato/contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.API_URL+"/api/contatos";

  constructor(private http: HttpClient) { }

  save(contato: Contato) : Observable<Contato>{
    return this.http.post<Contato>(`${this.url}`, contato);
  }

  listarTodos(): Observable<Contato[]>{
    return this.http.get<Contato[]>(this.url);
  }

  favourite(contato: Contato) : Observable<any>{
    return this.http.patch(`${this.url}/${contato.id}/favorito`, null);
  }
}
