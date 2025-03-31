import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CardOrders } from 'src/interfaces/card-orders';
import { HistoricModel } from 'src/interfaces/historic.model';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Adicione isso
})
export class AppHomeComponent implements OnInit {
  calendarData: string = '';
  selectedTime: string = '12:00';
  initialDate = ['2023-11-15'];

  overlay: boolean = false;
  faPencil = 'fas fa-pencil-alt';
  faTimes = 'fas fa-times';
  headerPageOptions: string[] = [
    'Serviços(23)',
    'Em andamento(3)',
    'Finalizados(5)',
  ]; // Lista dinâmica
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
  dateTimeFormatted: string = '';

  cards: CardOrders[] = [
    {
      id: 102,
      icon: 'fas fa-car', // Ícone FontAwesome
      serviceName: 'Lavagem Automotiva',
      description: 'Lavagem completa com polimento para meu carro...',
      address: 'Rua doutor paulo de andrade arantes, 52',
      price: '150,00',
      editedPrice: '150,00',
      renegotiateActive: true,
      calendarActive: false,
      dateTime: '2021-08-10T10:00:00',
      placeholderDataHora: '',
      hasQuotes: false,
    },
    {
      id: 103,
      icon: 'fas fa-paint-roller',
      serviceName: 'Pintura Residencial',
      description: 'Preciso pintar a sala e os quartos do apartamento...',
      address: 'Rua doutor antonio lobo sobrinho, 123',
      price: '150,00',
      editedPrice: '',
      renegotiateActive: true,
      calendarActive: false,
      dateTime: '2021-08-10T10:00:00',
      placeholderDataHora: '',
      hasQuotes: true,
    },
  ];

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
  placeholderDataHora: string = '';

  constructor(private route: Router, private datePipe: DatePipe, private eRef: ElementRef) {
    moment.locale('pt-br');
    this.placeholderDataHora =
      moment().add(1, 'days').format('DD/MM/YYYY') + ' - 12:00'; // Data de amanhã às 12:00

    this.cards.forEach((card) => {
      if (card.dateTime) {
        const formattedDate = moment(card.dateTime).format('DD/MM/YYYY');
        const formattedTime = moment(card.dateTime).format('HH:mm');
        this.dateTimeFormatted = `${formattedDate} - ${formattedTime}`;

        card.placeholderDataHora = this.dateTimeFormatted;
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  renegotiateActive(card?: any): void {
    // this.renegotiate = !this.renegotiate;
    const cardInfo = this.cards.find((c) => c.id === card.id);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive; // Alterna o estado

      if (cardInfo.renegotiateActive === true) {
        cardInfo.editedPrice = cardInfo.price;
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

  toggleCalendar(card: any): void {
    this.overlay = true;
    card.calendarActive = !card.calendarActive;

    if (card.calendarActive === false) {
      card.placeholderDataHora = this.dateTimeFormatted;
    }
  }

  onDateSelected(cardId: number, date: string) {
    const card: any = this.cards.find((c) => c.id === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
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

  onTimeSelected(cardId: number, time: string) {
    const card: any = this.cards.find((c) => c.id === cardId);
    if (card.placeholderDataHora === '') {
      card.placeholderDataHora = card.dateTime;
    }
    if (card) {
      const date = card.placeholderDataHora
        ? card.placeholderDataHora.split(' - ')[0]
        : moment(card.dateTime).format('DD/MM/YYYY'); // Mantém a data se já existir

      card.placeholderDataHora = `${date} - ${time}`;
    }
  }

  
  

  selectItem(index: number): void {
    this.selectedIndex = index; // Atualiza o item selecionado
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
