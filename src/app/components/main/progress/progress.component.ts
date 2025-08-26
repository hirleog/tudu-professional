import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';
import * as moment from 'moment'; // Importando o Moment.js
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

    // Restaurar do cache na primeira chamada
    if (offset === 0 && currentState.cards.length > 0) {
      this.cards = currentState.cards;
      this.paginaAtual = currentState.pagina;
      this.finalDaLista = currentState.finalDaLista;
      this.counts = currentState.counts;

      // Aplica scroll sem animação
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, currentState.scrollY);
        document.documentElement.style.scrollBehavior = '';
      }, 0);

      this.isLoading = false;
      return;
    }

    this.carregandoMais = true;

    this.cardService.getCards(flow).subscribe({
      next: (response: { cards: CardOrders[]; counts: any }) => {
        const novosCards = response.cards.map((card) => {
          return {
            ...card,
            icon: this.cardService.getIconByLabel(card.categoria) || '',
            renegotiateActive: true,
            calendarActive: false,
            horario_preferencial: card.horario_preferencial,
            placeholderDataHora: '',
          };
        });

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
          return;
        }

        this.cards = [...this.cards, ...novosCards];
        this.paginaAtual++;

        // Atualiza o estado específico do status
        currentState.cards = this.cards;
        currentState.pagina = this.paginaAtual;
        currentState.finalDaLista = this.finalDaLista;
        currentState.scrollY = window.scrollY;

        this.counts = response.counts;
        if (offset === 0) {
          currentState.counts = this.counts;
          this.updateHeaderCounts();
        }

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateHeaderCounts() {
    this.headerPageOptions = [
      `Pendentes(${this.counts.pendente})`,
      `Cancelados(${this.counts.cancelado})`,
    ];
  }

  getMinhaCandidatura(card: CardOrders) {
    return card.candidaturas?.find((c) => c.prestador_id === this.id_prestador);
  }

  goToDetails(card: any): void {
    this.route.navigate(['tudu-professional/detail'], {
      queryParams: { id: card.id_pedido, flow: 'progress' },
    });
  }
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
}
