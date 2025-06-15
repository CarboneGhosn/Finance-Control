import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transacao {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  // adicione outros campos que existirem
}

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private apiUrl = 'http://localhost:5000/api/transacao';

  constructor(private http: HttpClient) {}

  getTransacoes(): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(this.apiUrl);
  }

  adicionarTransacao(transacao: Transacao): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, transacao);
  }

  atualizarTransacao(transacao: Transacao): Observable<any> {
    return this.http.put(`${this.apiUrl}/${transacao.id}`, transacao);
  }

  deletarTransacao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
