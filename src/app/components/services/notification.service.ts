import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  readonly vapidPublicKey =
    'BETOn-pGBaW59qF-RFin_fUGfJmZshZFIg2KynwJUDfCEg5mon6iRE6hdPTxplYV5lCKWuupLAGz56V9OSecgA4';
  id_prestador: any;
  private currentClienteId?: string;
  private currentPrestadorId?: string;
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 segundos

  constructor(private http: HttpClient) {
    const prestadorId = localStorage.getItem('prestador_id');
    if (prestadorId) {
      this.setCurrentUser(undefined, prestadorId);
    }
  }

  // ✅ ADICIONAR: Método para configurar o usuário
  setCurrentUser(clienteId?: string, prestadorId?: any): void {
    this.currentClienteId = clienteId;
    this.currentPrestadorId = prestadorId;
    console.log('🔧 Usuário configurado no NotificationService:', {
      clienteId,
      prestadorId,
    });

    // ✅ CARREGA O CONTADOR APÓS CONFIGURAR O USUÁRIO
    this.loadUnreadCount(true);
  }

  sendSubscriptionToServer(
    clienteId: any,
    prestadorId: any,
    subscription: any
  ) {
    return this.http.post(`${environment.apiUrl}/notifications/subscribe`, {
      clienteId,
      prestadorId,
      subscription,
    });
  }

  /** Testa o push chamando notifications/test/clienteId/prestadorId */
  sendTest(clienteId: number, prestadorId: number) {
    return this.http.post(`${environment.apiUrl}/notifications/test`, {});
  }

  async requestPushSubscription(clienteId?: number, prestadorId?: number) {
    const sw = await navigator.serviceWorker.ready;

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.vapidPublicKey,
    });

    return this.http.post('/notifications/subscribe', {
      subscription,
      clienteId: clienteId || null,
      prestadorId: prestadorId || null,
    });
  }

  loadUnreadCount(force: boolean = false): void {
    const now = Date.now();

    // ✅ VERIFICA CACHE (igual ao que funciona)
    if (!force && now - this.lastLoadTime < this.CACHE_DURATION) {
      console.log('♻️ Usando cache do contador');
      return;
    }

    // ✅ SÓ FAZ A REQUISIÇÃO SE TIVER UM USUÁRIO CONFIGURADO
    if (!this.currentClienteId && !this.currentPrestadorId) {
      console.log('⏳ Aguardando configuração do usuário...');
      return;
    }

    let params = new HttpParams().set('_t', now.toString());

    // ✅ USA AS VARIÁVEIS DO USUÁRIO CONFIGURADO
    if (this.currentClienteId) {
      params = params.set('clienteId', this.currentClienteId);
    }

    if (this.currentPrestadorId) {
      params = params.set('prestadorId', this.currentPrestadorId);
    }

    console.log('🔄 Carregando contador com parâmetros:', {
      clienteId: this.currentClienteId,
      prestadorId: this.currentPrestadorId,
    });

    this.http
      .get<{ count: number }>(
        `${environment.apiUrl}/notifications/list/count/unread`,
        { params }
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Contador de não lidas do servidor:', response.count);
          this.unreadCountSubject.next(response.count);
          this.lastLoadTime = now; // ✅ ATUALIZA O TIMESTAMP
        },
        error: (err) => {
          console.error('❌ Erro ao carregar contador de não lidas:', err);
          this.unreadCountSubject.next(0); // ✅ FALLBACK
        },
      });
  }

  // ✅ ADICIONAR: Método para forçar atualização
  forceRefresh(): void {
    console.log('🔄 Forçando atualização completa');
    this.loadUnreadCount(true);
  }
}
