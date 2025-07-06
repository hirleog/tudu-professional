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
        label: 'Serviços de Manutenção',
        value: 'manutencao',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-paint-roller',
      cardDetail: {
        label: 'Pintura Residencial',
        value: 'pintura',
      },
      disabled: false,
    },
    {
      id: 2,
      icon: 'fas fa-home',
      cardDetail: {
        label: 'Limpeza e Conservação',
        value: 'limpeza',
      },
      disabled: true,
    },
    {
      id: 3,
      icon: 'fas fa-wrench',
      cardDetail: {
        label: 'Reformas e Reparos',
        value: 'reformas',
      },
      disabled: true,
    },
    {
      id: 4,
      icon: 'fas fa-briefcase',
      cardDetail: {
        label: 'Consultoria',
        value: 'consultoria',
      },
      disabled: true,
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
  getCards(status_pedido: string, offset: number = 0, limit: number = 10) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    let params = new HttpParams()
      .set('status_pedido', status_pedido)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

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
