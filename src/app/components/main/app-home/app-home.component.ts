import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { Location, TitleCasePipe } from '@angular/common';
import { StateManagementService } from '../../services/state-management.service';
import { formatDecimal } from 'src/app/utils/utils';
import * as bootstrap from 'bootstrap';
import { CurrencyMaskConfig } from 'ngx-currency';
import { NotificationService } from '../../services/notification.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY =
    'BETOn-pGBaW59qF-RFin_fUGfJmZshZFIg2KynwJUDfCEg5mon6iRE6hdPTxplYV5lCKWuupLAGz56V9OSecgA4';

  unreadCount$ = this.notificationService.unreadCount$;

  headerPageOptions: string[] = [];
  overlay: boolean = false;
  dateTimeFormatted: string = '';

  selectedIndex: any = 0;
  placeholderDataHora: string = '';

  id_prestador: any;

  cards: CardOrders[] = [];

  isLogged: any = false;
  counts: any;
  flow: string = '';
  homeFlow: string = '';
  isLoading: boolean = false;

  // para paginação
  paginaAtual = 0;
  limitePorPagina = 10;
  carregandoMais = false;
  finalDaLista = false;

  // Variáveis para os filtros
  showFilters: boolean = false;
  filters = {
    dataInicial: '',
    dataFinal: '',
    valorMin: null,
    valorMax: null,
    categorias: [] as string[],
  };

  availableCategories: string[] = [
    'Consultoria',
    'Reformas e Reparos',
    'Limpeza e Conservação',
    'Pintura Residencial',
    'Jardinagem',
    'Serviços de Manutenção',
  ];
  offset: number = 0;
  openModal: boolean = false;
  isLoadingBtn: boolean = false;
  hideCalendarDays: boolean = false;

  public currencyOptions: CurrencyMaskConfig = {
    prefix: 'R$',
    thousands: '.',
    decimal: ',',
    precision: 2,
    align: 'left',
    allowNegative: false,
    allowZero: false,
    suffix: '',
    nullable: false,
  };

  constructor(
    private route: Router,
    public cardService: CardService,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private stateManagement: StateManagementService,
    private swPush: SwPush,
    private titleCasePipe: TitleCasePipe,
    private notificationService: NotificationService
  ) {
    this.askNotificationPermission();

    moment.locale('pt-br');
    this.placeholderDataHora =
      moment().add(1, 'days').format('DD/MM/YYYY') + ' - 12:00'; // Data de amanhã às 12:00

    this.cards.forEach((card) => {
      let dateTimeFormatted: string = '';

      if (card.horario_preferencial) {
        const formattedDate = moment(card.horario_preferencial).format(
          'DD/MM/YYYY'
        );
        const formattedTime = moment(card.horario_preferencial).format('HH:mm');
        dateTimeFormatted = `${formattedDate} - ${formattedTime}`;

        card.placeholderDataHora = dateTimeFormatted;
      }

      const candidatura = card.candidaturas?.find(
        (c) => c.prestador_id === this.id_prestador
      );

      if (candidatura && candidatura.valor_negociado) {
        candidatura.valor_negociado = card.valor;
      }
    });

    this.activeRoute.queryParams.subscribe((params) => {
      this.homeFlow = params['homeFlow'];
    });

    this.id_prestador = localStorage.getItem('prestador_id');
  }
  ngAfterViewInit() {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    const prestadorId = localStorage.getItem('prestador_id');
    this.notificationService.setCurrentUser(undefined, prestadorId);

    this.notificationService.unreadCount$.subscribe((count) => {
      console.log('Contador no componente:', count);
    });

    this.location.subscribe(() => {
      this.flowNavigate(); // chama seu método back() quando clicar em voltar do navegador
    });
    this.flowNavigate();
    this.activatePushIfNeeded();
  }

  async askNotificationPermission() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Permissão OK, agora o usuário pode ativar o Push.');
      this.activatePush();
    } else {
      console.log('Usuário negou.');
    }
  }

  async activatePush() {
    let clienteId: any = null;
    let prestadorId: any = this.id_prestador;

    console.warn('SwPush step');
    if (!this.swPush.isEnabled) {
      console.warn('SwPush não habilitado');
      return;
    }
    console.warn('passou  do SwPush step');

    try {
      console.log('INICIO Subscription:');

      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((sub) => {
          console.log('Subscription criada:', sub);

          this.notificationService
            .sendSubscriptionToServer(clienteId, prestadorId, sub.toJSON())
            .subscribe(() => {
              console.log('Subscription salva!');
            });
        });
    } catch (err) {
      console.error('Erro ao criar subscription:', err);
    }
  }

  // Adicione um controle por sessionStorage
  private async shouldActivatePush(): Promise<boolean> {
    // Verifica se já ativou push nesta sessão
    const hasActivated = sessionStorage.getItem('push_activated');

    if (hasActivated) {
      console.log('✅ Push já foi ativado nesta sessão');
      return false;
    }

    // Verifica se usuário está logado
    const isLoggedIn = this.id_prestador ? this.id_prestador : false;

    if (!isLoggedIn) {
      console.log('⏭️ Usuário não está logado, pulando ativação de push');
      return false;
    }

    // Verifica permissão
    if (Notification.permission === 'denied') {
      console.log('⏭️ Permissão para notificações foi negada');
      return false;
    }

    return true;
  }

  // Método público para ativar (com controle)
  async activatePushIfNeeded() {
    if (await this.shouldActivatePush()) {
      await this.activatePush();
      sessionStorage.setItem('push_activated', 'true');

      // Limpa ao fechar a aba (opcional)
      window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('push_activated');
      });
    }
  }

  applyFilter() {
    this.cards = [];
    this.offset = 0;
    this.paginaAtual = 0;
    this.finalDaLista = false;
    this.showFilters = false;
    this.listCards('publicado');
  }
  cleanFilter() {
    this.cards = [];
    this.offset = 0;
    this.paginaAtual = 0;
    this.finalDaLista = false;
    this.showFilters = false;

    this.filters.dataInicial = '';
    this.filters.dataFinal = '';
    this.filters.valorMin = null;
    this.filters.valorMax = null;
    this.filters.categorias = [] as string[];

    this.stateManagement.clearAllState();
    this.listCards('publicado');
  }

  listCards(status_pedido: any) {
    if (this.carregandoMais || this.finalDaLista) {
      return;
    }

    this.isLoading = true;

    this.offset = this.paginaAtual * this.limitePorPagina;
    const currentState = this.stateManagement.getState(status_pedido);

    const filtrosAtivos =
      this.filters.dataInicial ||
      this.filters.dataFinal ||
      this.filters.valorMin !== null ||
      this.filters.valorMax !== null ||
      (this.filters.categorias && this.filters.categorias.length > 0);

    // if (filtrosAtivos) {
    //   offset = 0;
    // }

    // Se houver filtros ativos, resetar cards e paginação
    if (this.offset === 0 && filtrosAtivos) {
      this.cards = [];
      this.paginaAtual = 0;
      this.finalDaLista = false;
    }

    // Restaurar do cache na primeira chamada apenas se não houver filtros
    if (this.offset === 0 && currentState.cards.length > 0 && !filtrosAtivos) {
      this.cards = currentState.cards;
      this.paginaAtual = currentState.pagina;
      this.finalDaLista = currentState.finalDaLista;
      this.counts = currentState.counts;
      this.updateHeaderCounts();

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, currentState.scrollY);
        document.documentElement.style.scrollBehavior = '';
      }, 0);

      this.isLoading = false;
      return;
    }

    const filterParams: any = {};

    if (this.filters.dataInicial) {
      filterParams.dataInicial = moment(this.filters.dataInicial).format(
        'YYYY-MM-DD'
      );
    }
    if (this.filters.dataFinal) {
      filterParams.dataFinal = moment(this.filters.dataFinal).format(
        'YYYY-MM-DD'
      );
    }
    if (this.filters.valorMin !== null) {
      filterParams.valorMin = this.filters.valorMin;
    }
    if (this.filters.valorMax !== null) {
      filterParams.valorMax = this.filters.valorMax;
    }
    if (this.filters.categorias.length > 0) {
      filterParams.categoria = this.filters.categorias;
    }

    this.carregandoMais = true;

    this.cardService
      .getCards(status_pedido, this.offset, this.limitePorPagina, filterParams)
      .subscribe({
        next: (response: { cards: CardOrders[]; counts: any }) => {
          const novosCards = response.cards.map((card) => {
            const placeholderDataHora =
              card.candidaturas?.[0]?.horario_negociado !==
                card.horario_preferencial && card.candidaturas.length > 0
                ? moment(card.candidaturas?.[0]?.horario_negociado).format(
                    'DD/MM/YYYY - HH:mm'
                  )
                : moment(card.horario_preferencial).format(
                    'DD/MM/YYYY - HH:mm'
                  );

            const valorFormatted =
              card.candidaturas?.[0]?.valor_negociado ?? card.valor;

            const candidaturas =
              card.candidaturas?.map((candidatura) => ({
                ...candidatura,
                valor_negociado: candidatura.valor_negociado
                  ? card.valor
                  : candidatura.valor_negociado,
              })) ?? [];

            return {
              ...card,
              icon: this.cardService.getIconByLabel(card.categoria) || '',
              renegotiateActive: !card.valor_negociado,
              calendarActive: false,
              placeholderDataHora,
              valorFormatted,
              candidaturas,
            };
          });

          if (
            novosCards.length === 0 ||
            novosCards.length < this.limitePorPagina
          ) {
            this.finalDaLista = true;
            if (!filtrosAtivos) currentState.finalDaLista = true;
          } else {
            this.finalDaLista = false;
          }

          if (this.offset === 0) {
            this.cards = novosCards;
          } else {
            this.cards = [...this.cards, ...novosCards];
          }

          this.paginaAtual++;

          if (filtrosAtivos) {
            currentState.cards = this.cards;
            currentState.pagina = this.paginaAtual;
            currentState.finalDaLista = this.finalDaLista;
            currentState.scrollY = window.scrollY;
            currentState.counts = response.counts;
          }

          this.counts = response.counts;
          this.updateHeaderCounts();

          this.isLoading = false;
          this.carregandoMais = false;
        },
        error: (error) => {
          this.carregandoMais = false;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.carregandoMais = false;
        },
      });
  }

  // Lógica para seleção de categorias
  onCategoryChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const category = checkbox.value;

    if (checkbox.checked) {
      this.filters.categorias.push(category);
    } else {
      this.filters.categorias = this.filters.categorias.filter(
        (cat) => cat !== category
      );
    }
    console.log('Categorias selecionadas:', this.filters.categorias);
  }
  // Função para alternar a visibilidade dos filtros
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  updateCard(card: CardOrders): Observable<CardOrders> {
    this.isLoadingBtn = true;

    const horario_negociado_formatted = moment(
      card.placeholderDataHora,
      'DD/MM/YYYY - HH:mm'
    ).format('YYYY-MM-DD HH:mm');

    // Obtém a candidatura do prestador atual (se existir)
    const candidaturaAtual = card.candidaturas?.find(
      (c) => c.prestador_id === this.id_prestador
    );

    const valor = formatDecimal(Number(card.valor));
    const valorNegociadoRaw = formatDecimal(Number(card.valor_negociado));

    const formatValorNegociado = !candidaturaAtual
      ? valorNegociadoRaw && valorNegociadoRaw !== valor
        ? valorNegociadoRaw
        : card.valor
      : candidaturaAtual.valor_negociado !== card.valor
      ? candidaturaAtual.valor_negociado
      : card.valor;

    const valorNegociado = formatValorNegociado?.toString();
    // Determina o status com base nas negociações
    // const statusPedido =
    //   valorNegociado !== card.valor ||
    //   (horario_negociado_formatted &&
    //     horario_negociado_formatted !== card.horario_preferencial)
    //     ? 'publicado'
    //     : 'pendente';
    const statusPedido = 'publicado';

    const isAceito =
      valorNegociado === card.valor &&
      horario_negociado_formatted === card.horario_preferencial;

    const payloadCard: any = {
      id_cliente: Number(card.id_pedido),
      id_prestador: isAceito ? Number(this.id_prestador) : null,
      categoria: card.categoria,
      status_pedido: statusPedido, // Usa o status calculado
      subcategoria: card.subcategoria,
      valor: card.valor,
      horario_preferencial: card.horario_preferencial,
      data_finalizacao: card.data_finalizacao || null,

      cep: card.address.cep,
      street: card.address.street,
      neighborhood: card.address.neighborhood,
      city: card.address.city,
      state: card.address.state,
      number: card.address.number,
      complement: card.address.complement,

      candidaturas: [
        {
          prestador_id: Number(this.id_prestador),
          valor_negociado: valorNegociado,
          horario_negociado: horario_negociado_formatted,
          status: 'negociacao',
          // statusPedido === 'pendente' || isAceito ? 'aceito' : 'negociacao',
        },
      ],
    };

    // const flow =
    //   payloadCard.candidaturas[0].valor_negociado !== payloadCard.valor ||
    //   payloadCard.candidaturas[0].horario_negociado !==
    //     payloadCard.horario_preferencial
    //     ? 'emAndamento'
    //     : 'pendente';

    // const route: string = flow === 'pendente' ? 'progress' : '/home';

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: (response) => {
        this.modalSentProposal(true);
        this.isLoadingBtn = false;

        // Limpa todos os estados antes de navegar
        // if (route === '/home') {
        //   this.stateManagement.clearAllState(); // Limpa todos os estados antes de navegar
        //   this.selectItem(1); // Atualiza a lista de cartões após a atualização
        // } else {
        //   this.stateManagement.clearAllState(); // Limpa todos os estados antes de navegar
        //   this.selectItem(3); // Atualiza a lista de cartões após a atualização
        // }
      },
      error: (error) => {
        this.isLoadingBtn = false;
        this.modalSentProposal(false);
      },
      complete: () => {},
    });

    return of();
  }

  renegotiateActive(card?: any): void {
    // this.renegotiate = !this.renegotiate;
    const cardInfo = this.cards.find((c) => c.id_pedido === card.id_pedido);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive; // Alterna o estado

      if (cardInfo.renegotiateActive === true) {
        // const minhaCandidatura = cardInfo.candidaturas?.find(
        //   (c) => c.prestador_id.toString() === this.id_prestador
        // );
        // if (minhaCandidatura) {
        //   card.valor_negociado = `R$${cardInfo.valor}`;
        // }
        card.valor_negociado = `R$${cardInfo.valor}`;
      } else if (cardInfo.renegotiateActive === false) {
        // card.valorFormatted = cardInfo.valor_negociado.toString();
      }
    }
  }

  // No seu componente TypeScript
  openCalendar(card: any): void {
    if (!card.calendarActive) {
      this.overlay = true;
      card.calendarActive = true;
    }
  }

  // Adicione esta função ao seu componente pai
  toggleCalendar(card: any, event?: Event) {
    let dateTimeFormatted: string = '';

    if (event) {
      event.stopPropagation(); // Impede que o evento chegue ao document.click
    }
    card.calendarActive = !card.calendarActive;

    if (card) {
      const formattedDate = moment(card.horario_preferencial).format(
        'DD/MM/YYYY'
      );
      const formattedTime = moment(card.horario_preferencial).format('HH:mm');
      dateTimeFormatted = `${formattedDate} - ${formattedTime}`;

      if (card.calendarActive === false) {
        card.placeholderDataHora = dateTimeFormatted;
      }
    }
  }

  // Adicione este handler para quando o calendário emitir o evento de fechar
  onCalendarClose(card: any) {
    this.hideCalendarDays = false;

    if (card.placeholderDataHora !== this.dateTimeFormatted) {
      card.calendarActive = true;
    } else {
      card.calendarActive = false;
    }
  }

  onDateSelected(cardId: any, date: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.horario_preferencial;
    }

    if (card) {
      const time = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[1]
        : card.dateTime; // Mantém a hora se já existir

      card.placeholderDataHora = `${date} - ${time}`;
    }
  }

  onTimeSelected(cardId: any, time: string) {
    const card: any = this.cards.find((c) => c.id_pedido === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.horario_preferencial;
    }
    if (card) {
      const date = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[0]
        : moment(card.dateTime).format('DD/MM/YYYY'); // Mantém a data se já existir

      card.placeholderDataHora = `${date} - ${time}`;
    }
  }

  updateHeaderCounts() {
    this.headerPageOptions = [
      `Serviços(${this.counts.publicado})`,
      `Em andamento(${this.counts.andamento})`,
      // `Finalizados(${this.counts.finalizado})`,
    ];
  }

  goToDetails(card: any): void {
    const currentStatus = 'publicado'; // Ou obtenha o status atual de alguma forma
    const currentState = this.stateManagement.getState(currentStatus);
    currentState.scrollY = window.scrollY;
    currentState.counts = this.counts;

    if (
      card.candidaturas.length > 0 &&
      card.candidaturas[0].status === 'recusado'
    ) {
      this.flow = 'recusado';
    }

    this.route.navigate(['/home/detail'], {
      queryParams: {
        param: 'professional',
        id: card.id_pedido,
        flow: this.flow,
      },
    });
  }

  openNotifications(): void {
    this.route.navigate(['/home/notifications'], {
      queryParams: {
        param: 'professional',
      },
    });
  }

  flowNavigate(): void {
    let routeSelected: number = 0;
    if (this.homeFlow) {
      switch (this.homeFlow) {
        case 'publicado':
          routeSelected = 0;
          break;
        case 'finalizado':
          routeSelected = 1;
          break;
        case 'seeProposal':
          routeSelected = 1;
          break;
        default:
          routeSelected = 0;
          break;
      }
      this.selectItem(routeSelected);
      this.cleanActualRoute();
    } else {
      this.selectItem(routeSelected);
    }
  }
  selectItem(index: number): void {
    // Limpa os estados antes de trocar de aba, se necessário
    if (this.selectedIndex !== index) {
      this.cards = [];
      this.paginaAtual = 0;
      this.finalDaLista = false;
    }
    this.selectedIndex = index;
    this.showFilters = false;

    switch (index) {
      case 0:
        this.listCards('publicado');
        this.flow = 'publicado';
        this.cleanActualRoute();

        // this.homeFlow === 'publicado' ? this.selectedIndex === 0 : '';
        break;
      case 1:
        this.listCards('andamento');
        this.flow = 'andamento';
        this.cleanActualRoute();

        // this.homeFlow === 'andamento' ? this.selectedIndex === 0 : '';
        break;
      case 2:
        this.listCards('finalizado');
        this.flow = 'finalizado';
        this.cleanActualRoute();

        // this.homeFlow === 'finalizado' ? this.selectedIndex === 0 : '';
        break;
      case 3:
        // Salva o estado atual antes de navegar
        if (
          this.flow === 'publicado' ||
          this.flow === 'finalizado' ||
          this.flow === 'andamento'
        ) {
          const currentState = this.stateManagement.getState(this.flow);
          currentState.scrollY = window.scrollY;
        }
        this.route.navigate(['/tudu-professional/progress']);
        break;
    }
  }

  cleanActualRoute(): void {
    this.route.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        homeFlow: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  makeNewPorposal(card: CardOrders): void {
    this.updateCard(card);
  }

  modalSentProposal(indicator: boolean): void {
    if (indicator) {
      const modalElement = document.getElementById('alertModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      // Caso queira fechar o modal via código
      const modalElement = document.getElementById('errorModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    }
  }

  closeModalAndUpdate(): void {
    const modalElement = document.getElementById('alertModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        this.stateManagement.clearAllState();
        this.selectItem(0);
      }
    }
  }
  goToMyProposals() {
    this.stateManagement.clearAllState();

    // Limpar o array local
    this.cards = [];
    this.paginaAtual = 0;
    this.finalDaLista = false;

    this.selectItem(1);
  }

  newPorposalBtnValidator(card: CardOrders): boolean {
    // const valor = Number(card.valorFormatted);
    // const negociado = Number(card.valor_negociado);

    // if (isNaN(valor) || isNaN(negociado)) {
    //     return true; // ou false
    // }

    if (card.placeholderDataHora !== card.horario_preferencial) {
      return true; // Retorna true se forem diferentes
    } else {
      return false; // Retorna false se forem iguais
    }

    // return valor !== negociado; // Retorna true se forem diferentes
  }
  getStatusText(card: any): string {
    if (!card.candidaturas || card.candidaturas.length === 0) {
      return this.titleCasePipe.transform(card.status_pedido);
    }

    const primeiraCandidatura = card.candidaturas[0];

    switch (primeiraCandidatura.status) {
      case 'recusado':
        return this.titleCasePipe.transform(primeiraCandidatura.status);
      case 'negociacao':
        return 'Em Negociação';
      default:
        return this.titleCasePipe.transform(card.status_pedido);
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const posicao = window.innerHeight + window.scrollY;
    const alturaMaxima = document.body.offsetHeight;

    if (posicao >= alturaMaxima - 200) {
      this.listCards(this.flow); // ou o status atual selecionado
    }
  }
  goToShowcase() {
    this.route.navigate(['/']);
  }
}
