// agenda-service-list.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CardOrders } from 'src/interfaces/card-orders';
import { AgendaChronologyService } from '../../services/agenda-chronology.service';
import { CardService } from '../../services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StateManagementService } from '../../services/state-management.service';

@Component({
  selector: 'app-agenda-service-list',
  templateUrl: './agenda-service-list.component.html',
  styleUrls: ['./agenda-service-list.component.scss'],
})
export class AgendaServiceListComponent implements OnInit, OnChanges {
  @Input() cards: CardOrders[] = [];
  @Input() selectedDate: Date = new Date();
  @Input() isLoadingMore: boolean = false;
  @Input() hasMoreCards: boolean = true;
  @Input() showAllServices: boolean = true; // Inicia mostrando todos os serviços

  @Output() serviceStarted = new EventEmitter<CardOrders>();
  @Output() loadMoreRequested = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<CardOrders>();
  @Output() contactClient = new EventEmitter<CardOrders>();

  cardFiltered: any[] = [];
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
  isLoading: boolean = false;
  counts: any;
  displayCards: any[] = [];

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
    private chronologyService: AgendaChronologyService,
    public cardService: CardService,
    public route: Router,
    private stateManagement: StateManagementService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filterAndProcessCards();
  }

  ngOnChanges() {
    this.filterAndProcessCards();
  }

  filterAndProcessCards() {
    if (this.showAllServices) {
      // MODO: Mostrar todos os serviços
      this.cardFiltered = [...this.cards];

      // Ordenar por data (mais próximo primeiro)
      this.cardFiltered.sort((a, b) => {
        return (
          this.getServiceDateTime(a).getTime() -
          this.getServiceDateTime(b).getTime()
        );
      });

      // Aplicar validação cronológica por data (agrupa por dia)
      this.cardFiltered = this.groupAndValidateByDate(this.cardFiltered);
    } else {
      // MODO: Filtrar por data selecionada
      this.cardFiltered = this.cards.filter((card) => {
        const serviceDate = this.getServiceDateTime(card);
        return this.isSameDay(serviceDate, this.selectedDate);
      });

      // Aplicar validação cronológica
      this.cardFiltered = this.chronologyService
        .validateChronologicalOrder(
          this.cardFiltered.map((card) => ({
            ...card,
            datetime: this.getServiceDateTime(card),
            status: card.status_pedido,
          }))
        )
        .map((validatedCard, index) => ({
          ...this.cardFiltered[index],
          bloqueado: validatedCard.bloqueado,
          podeIniciar: validatedCard.podeIniciar,
          statusTemporizador: validatedCard.statusTemporizador,
          ordemCronologica: validatedCard.ordemCronologica,
        }));

      // Ordenar por horário
      this.cardFiltered.sort((a, b) => {
        return (
          this.getServiceDateTime(a).getTime() -
          this.getServiceDateTime(b).getTime()
        );
      });

      this.displayCards = this.cardFiltered;
    }
  }

  groupAndValidateByDate(cards: CardOrders[]): any[] {
    // Agrupar cards por data
    const cardsByDate = new Map<string, CardOrders[]>();

    cards.forEach((card) => {
      const dateKey = this.getDateKey(this.getServiceDateTime(card));

      if (!cardsByDate.has(dateKey)) {
        cardsByDate.set(dateKey, []);
      }
      cardsByDate.get(dateKey)!.push(card);
    });

    // Para cada data, ordenar por horário
    const result: any[] = [];

    cardsByDate.forEach((cardsInDay, dateKey) => {
      // Ordenar cards do dia por horário
      const sortedCards = cardsInDay.sort((a, b) => {
        return (
          this.getServiceDateTime(a).getTime() -
          this.getServiceDateTime(b).getTime()
        );
      });

      // Adicionar com flag indicando agrupamento por data
      result.push(
        ...sortedCards.map((card) => ({
          ...card,
          groupedByDate: true,
          dateGroup: dateKey,
        }))
      );
    });

    return result;
  }
  getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  getServiceDateTime(card: CardOrders): Date {
    // Prioridade: horário negociado > horário preferencial
    const negotiatedCandidatura = card.candidaturas?.find(
      (c) => c.horario_negociado
    );

    if (negotiatedCandidatura?.horario_negociado) {
      return new Date(negotiatedCandidatura.horario_negociado);
    }

    // Tenta parsear o horário preferencial
    try {
      return new Date(card.horario_preferencial);
    } catch {
      // Fallback: se não conseguir parsear, usa data atual
      return new Date();
    }
  }

  getServiceTime(card: CardOrders): Date {
    return this.getServiceDateTime(card);
  }

  canStartService(card: CardOrders): boolean {
    return (
      card.status_pedido?.toLowerCase() === 'pendente' ||
      card.status_pedido?.toLowerCase() === 'publicado'
    );
  }

  getPreviousCard(currentIndex: number): any {
    return currentIndex > 0 ? this.cardFiltered[currentIndex - 1] : null;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  loadMore() {
    this.loadMoreRequested.emit();
  }

  startCard(card: any): void {
    this.route.navigate(['tudu-professional/progress-detail'], {
      queryParams: { id: card.id_pedido },
    });
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

  goToHome() {
    this.route.navigate(['/tudu-professional/home'], {
      queryParams: {
        param: 'professional',
      },
    });
  }
}
