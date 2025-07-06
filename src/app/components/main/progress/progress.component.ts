import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';
import * as moment from 'moment'; // Importando o Moment.js
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { StateManagementService } from '../../services/state-management.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  budgets: string[] = ['Em andamento(23)', 'Finalizados(5)']; // Lista dinâmica
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

  constructor(
    public cardService: CardService,
    public route: Router,
    private stateManagement: StateManagementService
  ) {
    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngOnInit() {
    this.listCards(); // Chama a função para listar os cartões ao iniciar o componente
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

  listCards() {
    if (this.carregandoMais || this.finalDaLista) {
      return;
    }
    this.isLoading = true;

    const offset = this.paginaAtual * this.limitePorPagina;
    const currentState = this.stateManagement.getState('pendente');

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

    this.cardService.getCards('pendente').subscribe({
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
            // this.updateHeaderCounts();
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
          // this.updateHeaderCounts();
        }

        this.isLoading = false;
      },

      // next: (response: { cards: CardOrders[]; counts: any }) => {
      //   this.cards = response.cards.map((card) => ({
      // ...card,
      // icon: this.cardService.getIconByLabel(card.categoria) || '',
      // renegotiateActive: true,
      // calendarActive: false,
      // horario_preferencial: card.horario_preferencial,
      // placeholderDataHora: '',
      //   }));

      //   this.stateManagement.cards = this.cards;
      //   this.stateManagement.counts = this.counts;

      //   this.counts = response.counts; // Armazena os contadores recebidos
      //   this.selectItem(0);
      //   this.isLoading = false;
      // },

      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
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
    this.selectedIndex = index; // Atualiza o item selecionado
  }
}
