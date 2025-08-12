import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { card } from 'src/interfaces/card';
import { CardOrders } from 'src/interfaces/card-orders';
import { CardServiceModel } from 'src/interfaces/card-service.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  url: string = environment.apiUrl;
  public serviceCards: card[] = [
    {
      id: 1,
      icon: 'fas fa-tools',
      cardDetail: {
        label: 'Reparos e Manutenção',
        value: 'reparos',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-broom',
      cardDetail: {
        label: 'Limpeza e Higienização',
        value: 'limpeza',
      },
      disabled: false,
    },
    {
      id: 3,
      icon: 'fas fa-hard-hat',
      cardDetail: {
        label: 'Reformas e Construção',
        value: 'construcao',
      },
      disabled: false,
    },
    {
      id: 4,
      icon: 'fas fa-cogs',
      cardDetail: {
        label: 'Montagem e Instalação',
        value: 'montagem',
      },
      disabled: false,
    },
    {
      id: 5,
      icon: 'fas fa-seedling',
      cardDetail: {
        label: 'Jardim e Piscina',
        value: 'jardim',
      },
      disabled: false,
    },
    {
      id: 6,
      icon: 'fas fa-ellipsis-h',
      cardDetail: {
        label: 'Outros serviços',
        value: 'outros',
      },
      disabled: false,
    },
  ];

  constructor(private http: HttpClient) {}

  postCard(card: CardServiceModel) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'access-control-allow-origin': '*',
    });

    return this.http.post(`${this.url}/cards`, card, { headers });
  }

  getCardById(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'access-control-allow-origin': '*',
    });

    return this.http.get(`${this.url}/cards/${id}`, { headers });
  }
  // getCards(
  //   status_pedido: string,
  //   offset: number = 0,
  //   limit: number = 10,
  //   // valorMax?: any,
  //   // valorMin?: any,
  //   // dataInicial?: any,
  //   // dataFinal?: any,
  //   categoria?: any
  // ) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   });

  //   let params = new HttpParams()
  //     .set('status_pedido', status_pedido)
  //     .set('offset', offset.toString())
  //     .set('limit', limit.toString())
  //     // .set('valorMax', valorMax || '')
  //     // .set('valorMin', valorMin || '')
  //     // .set('dataInicial', dataInicial || '')
  //     // .set('dataFinal', dataFinal || '')
  //     .set('categoria', categoria || '');

  //   return this.http.get<{ cards: CardOrders[]; counts: any }>(
  //     `${this.url}/cards`,
  //     { headers, params }
  //   );
  // }

  getCards(
    status_pedido: string,
    offset: number = 10,
    limit: number = 10,
    filterParams?: any // O objeto que conterá dataInicial, dataFinal, valorMax, valorMin, categoria
  ): Observable<{ cards: CardOrders[]; counts: any }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    let params = new HttpParams()
      .set('status_pedido', status_pedido)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    // --- Nova lógica para adicionar os filterParams ---
    if (filterParams) {
      for (const key in filterParams) {
        if (filterParams.hasOwnProperty(key)) {
          const value = filterParams[key];
          if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              value.forEach((item) => {
                params = params.append(key, item);
              });
            } else {
              params = params.set(key, value.toString());
            }
          }
        }
      }
    }
    // --- Fim da nova lógica ---

    return this.http.get<{ cards: CardOrders[]; counts: any }>(
      `${this.url}/cards`,
      { headers, params }
    );
  }

  // Método para buscar o ícone com base no label
  getIconByLabel(label: string): string | null {
    const card = this.serviceCards.find(
      (card) => card.cardDetail.label === label
    );
    return card ? card.icon : null; // Retorna o ícone ou null se não encontrado
  }

  updateCard(
    id: string,
    updatedFields: Partial<CardOrders>
  ): Observable<CardOrders> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'access-control-allow-origin': '*',
    });

    return this.http.put<CardOrders>(`${this.url}/cards/${id}`, updatedFields, {
      headers,
    });
  }

  getServiceCards(): card[] {
    return this.serviceCards;
  }
}
