import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { StateManagementService } from '../../services/state-management.service';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss'],
})
export class HistoricComponent implements OnInit {
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

  filters = {
    dataInicial: '',
    dataFinal: '',
    valorMin: null,
    valorMax: null,
    categorias: [] as string[],
  };
  constructor(
    public cardService: CardService,
    public route: Router,
    private stateManagement: StateManagementService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {
    this.id_prestador = localStorage.getItem('prestador_id');

    this.activeRoute.queryParams.subscribe((params) => {
      this.homeFlow = params['homeFlow'];
    });
  }

  ngOnInit() {
    this.listCards('finalizado'); // Chama a função para listar os cartões ao iniciar o componente
  }

  // listCards() {
  //   this.cardService.getCards().subscribe({
  //     next: (response) => {
  //       this.cards = (response as CardOrders[]).map((card) => ({
  //         ...card, // Mantém os campos existentes
  //         icon: this.cardService.getIconByLabel(card.categoria) || '', // Garante que o ícone nunca seja null
  //         renegotiateActive: true, // Adiciona o campo manualmente
  //         calendarActive: false, // Adiciona o campo manualmente
  //         horario_preferencial: card.horario_preferencial, // Usa o valor existente ou um padrão
  //         placeholderDataHora: '', // Adiciona o campo manualmente
  //       }));
  //       this.selectItem(0);
  //     },
  //     error: (error) => {
  //       console.error('Erro ao obter os cartões:', error);
  //     },
  //     complete: () => {
  //       console.log('Requisição concluída');
  //     },
  //   });
  // }

  listCards(flow: string) {
    if (this.carregandoMais || this.finalDaLista) {
      return;
    }

    this.isLoading = true;

    const offset = this.paginaAtual * this.limitePorPagina;
    const currentState = this.stateManagement.getState(flow);

    // Verificar se há filtros ativos
    const filtrosAtivos =
      this.filters.dataInicial ||
      this.filters.dataFinal ||
      this.filters.valorMin !== null ||
      this.filters.valorMax !== null ||
      (this.filters.categorias && this.filters.categorias.length > 0);

    // Se houver filtros ativos, resetar cards e paginação E NÃO USAR CACHE
    if (filtrosAtivos && offset === 0) {
      this.cards = [];
      this.paginaAtual = 0;
      this.finalDaLista = false;
      currentState.cards = [];
      currentState.finalDaLista = false;
      currentState.pagina = 0;
    }

    // Restaurar do cache na primeira chamada apenas se não houver filtros
    if (offset === 0 && currentState.cards.length > 0 && !filtrosAtivos) {
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

    this.carregandoMais = true;

    // CORREÇÃO: Passar parâmetros individuais como no exemplo que funciona
    this.cardService
      .getCards(flow, offset, this.limitePorPagina, this.filters)
      .subscribe({
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

          // CORREÇÃO: Seguir exatamente a mesma lógica do exemplo que funciona
          if (
            novosCards.length === 0 ||
            novosCards.length < this.limitePorPagina
          ) {
            this.finalDaLista = true;
            currentState.finalDaLista = true;
            this.carregandoMais = false;

            if (offset === 0) {
              // Só limpa se realmente não vieram cards
              if (novosCards.length === 0) {
                this.cards = [];
                currentState.cards = [];
              } else {
                // Se vieram alguns cards, adiciona eles
                this.cards = novosCards;
                currentState.cards = novosCards;
              }

              this.counts = response.counts;
              currentState.counts = this.counts;
              this.updateHeaderCounts();
            }

            this.isLoading = false;
            return;
          }

          // CORREÇÃO: Adicionar cards e incrementar página (igual ao exemplo)
          this.cards = [...this.cards, ...novosCards];
          this.paginaAtual++;

          // Atualiza o estado específico do flow
          // CORREÇÃO: Sempre atualizar o cache, mas apenas se não houver filtros
          if (!filtrosAtivos) {
            currentState.cards = this.cards;
            currentState.pagina = this.paginaAtual;
            currentState.finalDaLista = this.finalDaLista;
            currentState.scrollY = window.scrollY;
          }

          this.counts = response.counts;
          // CORREÇÃO: Atualizar counts no cache apenas na primeira página
          if (offset === 0 && !filtrosAtivos) {
            currentState.counts = this.counts;
          }

          this.updateHeaderCounts();
          this.isLoading = false;
          this.carregandoMais = false;
        },
        error: (error) => {
          console.error('Erro ao obter os cartões:', error);
          this.carregandoMais = false;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.carregandoMais = false;
        },
      });
  }

  updateHeaderCounts() {
    this.stateManagement.clearAllState();

    this.headerPageOptions = [
      `Concluídos(${this.counts.finalizado})`,
      `Cancelados(${this.counts.cancelado})`,
    ];
  }

  getMinhaCandidatura(card: CardOrders) {
    return card.candidaturas?.find((c) => c.prestador_id === this.id_prestador);
  }

  goToDetails(idPedido: any): void {
    const currentStatus = 'finalizado'; // Ou obtenha o status atual de alguma forma
    const currentState = this.stateManagement.getState(currentStatus);
    currentState.scrollY = window.scrollY;
    currentState.counts = this.counts;

    this.route.navigate(['/home/detail'], {
      queryParams: { id: idPedido, flow: 'historic' },
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

  onDateSelected(date: string) {
    console.log('Data selecionada:', date);
    // Faça algo com a data selecionada
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
        this.listCards('finalizado');
        this.flow = 'finalizado';
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
        if (this.flow === 'finalizado' || this.flow === 'cancelado') {
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

  formatarHorario(pedido: any): string {
    const candidatura = pedido.candidaturas?.[0];
    let horario = pedido.horario_preferencial;

    if (
      candidatura &&
      candidatura.horario_negociado !== pedido.horario_preferencial
    ) {
      horario = candidatura.horario_negociado;
    }

    const data = moment(horario);
    const hoje = moment();

    if (data.isSame(hoje, 'day')) {
      return `Hoje, ${data.format('HH:mm')}`;
    }

    return data.format('DD/MM/YYYY - HH:mm');
  }

  back() {
    this.location.back();
  }

  goToHome(): void {
    this.route.navigate(['/tudu-professional/home']);
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
