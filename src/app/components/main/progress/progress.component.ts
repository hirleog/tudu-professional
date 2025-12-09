import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { StateManagementService } from '../../services/state-management.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada

  yourMarkedDatesArray = ['2025-03-24', '2025-03-25', '2025-03-27'];

  cards: CardOrders[] = [];
  isLogged: any = false;
  id_prestador: any;
  counts: any;
  isLoading: boolean = false;

  // para paginação
  paginaAtual = 0;
  limitePorPagina = 10;
  carregandoMais = false;
  finalDaLista = false;
  headerPageOptions: string[] = [];
  homeFlow: string = '';
  flow: string = '';
  offset: number = 0;

  selectedDate: Date = new Date();
  viewMode: 'calendar' | 'list' = 'calendar';

  filters = {
    dataInicial: '',
    dataFinal: '',
    valorMin: null,
    valorMax: null,
    categorias: [] as string[],
  };
  agendaCards: any;
  showAllServices: boolean = true;

  constructor(
    public cardService: CardService,
    public route: Router,
    private stateManagement: StateManagementService,
    private activeRoute: ActivatedRoute
  ) {
    this.id_prestador = localStorage.getItem('prestador_id');

    this.activeRoute.queryParams.subscribe((params) => {
      this.homeFlow = params['homeFlow'];
    });
  }

  ngOnInit() {
    this.listCards('pendente'); // Chama a função para listar os cartões ao iniciar o componente
  }

  listCards(flow: string) {
    // if (this.carregandoMais || this.finalDaLista) {
    //   return;
    // }

    this.isLoading = true;

    this.offset = this.paginaAtual * this.limitePorPagina;
    const currentState = this.stateManagement.getState(flow);

    // Verificar se há filtros ativos
    const filtrosAtivos =
      this.filters.dataInicial ||
      this.filters.dataFinal ||
      this.filters.valorMin !== null ||
      this.filters.valorMax !== null ||
      (this.filters.categorias && this.filters.categorias.length > 0);

    // Se houver filtros ativos, resetar cards e paginação
    if (this.offset === 0 && filtrosAtivos) {
      this.cards = [];
      this.paginaAtual = 0;
      this.finalDaLista = false;
      currentState.cards = []; // Limpa o cache para filtros
      currentState.finalDaLista = false;
    }

    // Restaurar do cache na primeira chamada apenas se não houver filtros
    if (this.offset === 0 && currentState.cards.length > 0 && !filtrosAtivos) {
      this.cards = currentState.cards;
      this.paginaAtual = currentState.pagina;
      this.finalDaLista = currentState.finalDaLista;
      this.counts = currentState.counts;
      // this.updateHeaderCounts();

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, currentState.scrollY);
        document.documentElement.style.scrollBehavior = '';
      }, 0);

      this.isLoading = false;
      return;
    }

    // Preparar parâmetros de filtro
    const filterParams: any = {};

    if (this.filters.valorMin !== null) {
      filterParams.valorMin = this.filters.valorMin;
    }
    if (this.filters.valorMax !== null) {
      filterParams.valorMax = this.filters.valorMax;
    }
    if (this.filters.categorias.length > 0) {
      filterParams.categoria = this.filters.categorias;
    }

    // Adicionar parâmetros de paginação
    filterParams.offset = this.offset;
    filterParams.limit = this.limitePorPagina;

    this.carregandoMais = true;

    this.cardService.getCards(flow).subscribe({
      next: (response: { cards: CardOrders[]; counts: any }) => {
        const novosCards = response.cards.map((card) => {
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

        // Atualizar cache apenas se não houver filtros ativos
        if (!filtrosAtivos) {
          currentState.cards = this.cards;
          currentState.pagina = this.paginaAtual;
          currentState.finalDaLista = this.finalDaLista;
          currentState.scrollY = window.scrollY;
          currentState.counts = response.counts;
        }

        this.counts = response.counts;
        // this.updateHeaderCounts();

        this.isLoading = false;
        this.carregandoMais = false;
      },
      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
        this.isLoading = false;
        this.carregandoMais = false;
      },
      complete: () => {
        this.isLoading = false;
        this.carregandoMais = false;
      },
    });
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.showAllServices = false;
  }

  showAllCards($event: any) {
    this.cards = [];
    this.selectedDate = null as any;
    this.showAllServices = true;
    this.listCards('pendente');
  }

  onViewModeChanged(mode: 'calendar' | 'list') {
    this.viewMode = mode;
  }

  onServiceStarted(card: CardOrders) {
    // Lógica para iniciar serviço
    this.startCard(card);
  }

  getMinhaCandidatura(card: CardOrders) {
    return card.candidaturas?.find((c) => c.prestador_id === this.id_prestador);
  }

  goToDetails(idPedido: any): void {
    const currentStatus = 'publicado'; // Ou obtenha o status atual de alguma forma
    const currentState = this.stateManagement.getState(currentStatus);
    currentState.scrollY = window.scrollY;
    currentState.counts = this.counts;

    this.route.navigate(['/home/detail'], {
      queryParams: {
        param: 'professional',
        id: idPedido,
        flow: 'progress',
      },
    });
  }

  // goToDetails(id_pedido: any): void {
  //   const currentStatus = 'publicado'; // Ou obtenha o status atual de alguma forma
  //   const currentState = this.stateManagement.getState(currentStatus);
  //   currentState.scrollY = window.scrollY;
  //   currentState.counts = this.counts;

  //   this.route.navigate(['/home/detail'], {
  //     queryParams: { param: 'professional', id: id_pedido, flow: this.flow },
  //   });
  // }

  startCard(card: any): void {
    this.route.navigate(['tudu-professional/progress-detail'], {
      queryParams: { id: card.id_pedido },
    });
  }

  selectItem(index: number): void {
    // Limpa os estados antes de trocar de aba, se necessário
    if (this.selectedIndex !== index) {
      this.cards = [];
      this.paginaAtual = 0;
      this.finalDaLista = false;
    }
    this.selectedIndex = index;
    // this.showFilters = false;

    switch (index) {
      case 0:
        this.listCards('pendente');
        this.flow = 'pendente';
        this.cleanActualRoute();

        // this.homeFlow === 'publicado' ? this.selectedIndex === 0 : '';
        break;
      case 1:
        this.listCards('cancelado');
        this.flow = 'cancelado';
        this.cleanActualRoute();

        // this.homeFlow === 'andamento' ? this.selectedIndex === 0 : '';
        break;
      case 2:
        // Salva o estado atual antes de navegar
        if (this.flow === 'pendente' || this.flow === 'cancelado') {
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    const posicao = window.innerHeight + window.scrollY;
    const alturaMaxima = document.body.offsetHeight;

    if (posicao >= alturaMaxima - 200) {
      this.listCards(this.flow); // ou o status atual selecionado
    }
  }
}
