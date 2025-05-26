import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      path: '/socket.io', // garante que Nginx roteie corretamente
      transports: ['websocket'],
      secure: true,
      withCredentials: true,
    });
  }
  ouvirAtualizacaoPedido(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('atualizacao-pedido', (dados: any) => {
        subscriber.next(dados);
      });
    });
  }
}
