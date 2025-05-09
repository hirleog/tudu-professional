import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Carousel } from 'bootstrap';
import { CardOrders } from 'src/interfaces/card-orders';
import { HistoricModel } from 'src/interfaces/historic.model';
import { Observable, of } from 'rxjs';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  headerPageOptions: string[] = [];
  overlay: boolean = false;
  dateTimeFormatted: string = '';

  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
  placeholderDataHora: string = '';

  id_prestador: any;

  cards: CardOrders[] = [];

  historicOrders: HistoricModel[] = [
    {
      id: 102,
      icon: 'fas fa-car', // Ícone FontAwesome
      serviceName: 'Lavagem Automotiva',
      description: 'Lavagem completa com polimento para meu carro...',
      price: '150,00',
      clientName: 'Guilherme',
      clientPhoto: '../../../../assets/GUI.PNG',
      clientAddress: 'Rua doutor paulo de andrade arantes, 52',
      dateTime: '2021-08-10T10:00:00',
    },
    {
      id: 103,
      icon: 'fas fa-paint-roller',
      serviceName: 'Pintura Residencial',
      description: 'Preciso pintar a sala e os quartos do apartamento...',
      price: '150,00',
      clientName: 'Matheus',
      clientPhoto: '../../../../assets/matheus.PNG',
      clientAddress: 'Rua doutor antonio lobo sobrinho, 123',
      dateTime: '2021-08-10T10:00:00',
    },
  ];
  isLogged: any = false;
  publicados: number = 0;
  emAndamento: number = 0;
  finalizados: number = 0;

  constructor(private route: Router, public cardService: CardService) {
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

    this.id_prestador = localStorage.getItem('prestador_id');
  }
  ngAfterViewInit() {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo

    this.selectItem(0);
    this.listCards();

    // id_prestador = localStorage.getItem('prestador_id');
    // console.log('User ID recebido do Shell:', userId);
  }

  listCards() {
    this.cardService.getCards('publicado').subscribe({
      next: (response) => {
        this.cards = (response as CardOrders[]).map((card) => ({
          ...card, // Mantém os campos existentes
          icon: this.cardService.getIconByLabel(card.categoria) || '', // Garante que o ícone nunca seja null
          renegotiateActive: true, // Adiciona o campo manualmente
          calendarActive: false, // Adiciona o campo manualmente
          horario_preferencial: card.horario_preferencial, // Usa o valor existente ou um padrão
          placeholderDataHora: '', // Adiciona o campo manualmente
        }));
        this.updateHeaderCounts(); // ATUALIZA A CONTAGEM
        this.selectItem(0);
      },
      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
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

    // Determina o valor negociado
    const valorNegociado = candidaturaAtual
      ? candidaturaAtual.valor_negociado === ''
        ? card.valor
        : candidaturaAtual.valor_negociado ?? card.valor
      : card.valor_negociado && card.valor_negociado !== card.valor
      ? card.valor_negociado
      : card.valor;

    // Determina o status com base nas negociações
    const statusPedido =
      valorNegociado !== card.valor ||
      (horario_negociado_formatted &&
        horario_negociado_formatted !== card.horario_preferencial)
        ? 'publicado'
        : 'pendente';

    const payloadCard: any = {
      id_cliente: Number(card.id_pedido),
      id_prestador: null,
      categoria: card.categoria,
      status_pedido: statusPedido, // Usa o status calculado
      subcategoria: card.subcategoria,
      valor: card.valor,
      horario_preferencial: card.horario_preferencial,

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
          status: 'ativa',
          data_finalizacao: '',
        },
      ],
    };

    const route: string =
      card.status_pedido === 'pendente' ? '/progress' : '/home';

    this.cardService.updateCard(card.id_pedido!, payloadCard).subscribe({
      next: (response) => {
        console.log('Card atualizado com sucesso:', response);
        route === '/home' ? this.selectItem(1) : this.route.navigate([route]); // direciona para tela de em andamento se não vai para tela de progress
      },
      error: (error) => {
        console.error('Erro ao atualizar o cartão:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
    });

    return of();
    // // if (this.isLogged) {
    // this.cardService
    //   .updateCard(card.id_pedido!, payloadCard) // Use non-null assertion
    //   .subscribe(() => {
    //     route === '/home' ? this.selectItem(1) : this.route.navigate([route]); // Atualiza a lista de cartões após a atualização
    //   });
    // // } else {
    // // this.route.navigate(['/']);
    // return of();
    // // }
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

  onDateSelected(cardId: string, date: string) {
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

  onTimeSelected(cardId: string, time: string) {
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
    const id = Number(this.id_prestador);

    this.publicados = this.cards.filter(
      (card) =>
        card.status_pedido === 'publicado' &&
        !card.candidaturas?.some((c: any) => c.prestador_id === id)
    ).length;

    this.emAndamento = this.cards.filter((card) =>
      card.candidaturas?.some((c: any) => c.prestador_id === id)
    ).length;

    this.finalizados = this.cards.filter(
      (card) => card.status_pedido === 'finalizado'
    ).length;

    this.headerPageOptions = [
      `Serviços(${this.publicados})`,
      `Em andamento(${this.emAndamento})`,
      `Finalizados(${this.finalizados})`,
    ];
  }

  selectItem(index: number): void {
    let dateTimeFormatted: string = '';

    this.selectedIndex = index;

    this.cards.forEach((card) => {
      if (card.horario_preferencial) {
        const formattedDate = moment(card.horario_preferencial).format(
          'DD/MM/YYYY'
        );
        const formattedTime = moment(card.horario_preferencial).format('HH:mm');
        dateTimeFormatted = `${formattedDate} - ${formattedTime}`;
      }

      if (
        this.selectedIndex === 0 ||
        this.selectedIndex === 1 ||
        this.selectedIndex === 2
      ) {
        card.placeholderDataHora = dateTimeFormatted;
        card.calendarActive = false; // desabilita campo de calendario
      }

      card.candidaturas?.forEach((candidatura) => {
        if (candidatura.valor_negociado) {
          candidatura.valor_negociado = card.valor;
          card.renegotiateActive = true; // ainda pode usar no card
        }
      });
    });
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
