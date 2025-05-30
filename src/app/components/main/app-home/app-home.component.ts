import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
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

  constructor(
    private route: Router,
    public cardService: CardService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {
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

    this.location.subscribe(() => {
      this.flowNavigate(); // chama seu método back() quando clicar em voltar do navegador
    });
    this.flowNavigate();
  }

  listCards(step: string) {
    this.cardService.getCards(step).subscribe({
      next: (response: { cards: CardOrders[]; counts: any }) => {
        this.cards = response.cards.map((card) => {
          // const horario = card.horario_preferencial
          //   ? moment(card.horario_preferencial)
          //   : null;
          const placeholderDataHora =
            card.candidaturas?.[0]?.horario_negociado !==
              card.horario_preferencial && card.candidaturas.length > 0
              ? moment(card.candidaturas?.[0]?.horario_negociado).format(
                  'DD/MM/YYYY - HH:mm'
                )
              : moment(card.horario_preferencial).format('DD/MM/YYYY - HH:mm');

          // const placeholderDataHora =
          //   horario && [0, 1, 2].includes(this.selectedIndex)
          //     ? `${horario.format('DD/MM/YYYY')} - ${horario.format('HH:mm')}`
          //     : '';

          const valorFormatted =
            card.candidaturas?.[0]?.valor_negociado ?? card.valor;

          const candidaturas =
            card.candidaturas?.map((candidatura) => ({
              ...candidatura,
              valor_negociado: candidatura.valor_negociado
                ? card.valor
                : candidatura.valor_negociado,
            })) ?? [];

          // const renegotiateActive = candidaturas.some((c) => c.valor_negociado);

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

        this.counts = response.counts; // armazena os contadores
        this.updateHeaderCounts(); // atualiza o cabeçalho usando this.counts
      },
      error: (error) => console.error('Erro ao obter os cartões:', error),
      complete: () => console.log('Requisição concluída'),
    });
  }

  updateCard(card: CardOrders): Observable<CardOrders> {
    const horario_negociado_formatted = moment(
      card.placeholderDataHora,
      'DD/MM/YYYY - HH:mm'
    ).format('YYYY-MM-DD HH:mm');

    // Obtém a candidatura do prestador atual (se existir)
    const candidaturaAtual = card.candidaturas?.find(
      (c) => c.prestador_id === this.id_prestador
    );

    const valorNegociado = !candidaturaAtual
      ? card.valor_negociado && card.valor_negociado !== card.valor
        ? card.valor_negociado
        : card.valor
      : candidaturaAtual.valor_negociado !== card.valor
      ? candidaturaAtual.valor_negociado
      : card.valor;

    // Determina o status com base nas negociações
    const statusPedido =
      valorNegociado !== card.valor ||
      (horario_negociado_formatted &&
        horario_negociado_formatted !== card.horario_preferencial)
        ? 'publicado'
        : 'pendente';

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
          status:
            statusPedido === 'pendente' || isAceito ? 'aceito' : 'negociacao',
        },
      ],
    };

    //  status: valorNegociado !== card.valor || (horario_negociado_formatted && horario_negociado_formatted !== card.horario_preferencial)
    //         ? 'em negociacao' : 'pendente',

    const flow =
      payloadCard.candidaturas[0].valor_negociado !== payloadCard.valor ||
      payloadCard.candidaturas[0].horario_negociado !==
        payloadCard.horario_preferencial
        ? 'emAndamento'
        : 'pendente';

    const route: string = flow === 'pendente' ? 'progress' : '/home';

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: (response) => {
        // route === '/home' ? this.selectItem(1) : this.route.navigate([route]); // direciona para tela de em andamento se não vai para tela de progress
        if (route === '/home') {
          this.selectItem(1); // Atualiza a lista de cartões após a atualização
        } else {
          this.selectItem(3); // Atualiza a lista de cartões após a atualização
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar o cartão:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
    });

    return of();
  }

  renegotiateActive(card?: any): void {
    // this.renegotiate = !this.renegotiate;
    const cardInfo = this.cards.find((c) => c.id_pedido === card.id_pedido);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive; // Alterna o estado

      if (cardInfo.renegotiateActive === true) {
        const minhaCandidatura = cardInfo.candidaturas?.find(
          (c) => c.prestador_id === this.id_prestador
        );
        if (minhaCandidatura) {
          minhaCandidatura.valor_negociado = cardInfo.valor;
        }
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

      card.placeholderDataHora = dateTimeFormatted;

      if (card.calendarActive === false) {
        card.placeholderDataHora = dateTimeFormatted;
      }
    }
  }

  // Adicione este handler para quando o calendário emitir o evento de fechar
  onCalendarClose(card: any) {
    // this.clickOutside = true

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
        : moment(card.dateTime).format('HH:mm'); // Mantém a hora se já existir

      card.placeholderDataHora = `${moment(date).format(
        'DD/MM/YYYY'
      )} - ${time}`;
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
      `Finalizados(${this.counts.finalizado})`,
    ];
  }

  // navega para detail com o parametro guardado do fluxo atual
  goToDetails(id_pedido: any): void {
    this.route.navigate(['/tudu-professional/detail'], {
      queryParams: { id: id_pedido, flow: this.flow },
    });
  }

  // recebe o parametro 'flow' de volta para guardar qual fluxo estava (publicado, andamento ou finalizado)
  flowNavigate(): void {
    let routeSelected: number = 0;
    if (this.homeFlow) {
      switch (this.homeFlow) {
        case 'publicado':
          routeSelected = 0;
          break;
        case 'andamento':
          routeSelected = 1;
          break;
        case 'finalizado':
          routeSelected = 2;
          break;
        default:
          routeSelected = 0;
          break;
      }
      this.selectItem(routeSelected);
      //  remove o parâmetro da URL
      this.cleanActualRoute();
    } else {
      this.selectItem(routeSelected);
    }
  }

  selectItem(index: number): void {
    // if (this.selectedIndex === index) return;

    this.selectedIndex = index;

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
        this.route.navigate(['/tudu-professional/progress']);
        break;
    }
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

  cleanActualRoute(): void {
    this.route.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        homeFlow: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
