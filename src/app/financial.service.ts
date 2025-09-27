import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor(private http: HttpClient) {}

  buscarPagamentosPorClientePaginado(
    id_prestador: number,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('id_prestador', id_prestador)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<any>(
      `${environment.apiUrl}/payments/cliente/${id_prestador}/dashboard`,
      {
        params,
      }
    );
  }
}
