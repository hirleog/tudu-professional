import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Carousel } from 'bootstrap';
import { CardOrders } from 'src/interfaces/card-orders';
import { HistoricModel } from 'src/interfaces/historic.model';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  @ViewChild('carouselOrders') carousel: any;
  bsCarousel!: Carousel;

  headerPageOptions: string[] = [
    'Serviços(23)',
    'Em andamento(3)',
    'Finalizados(5)',
  ]; // Lista dinâmica
  overlay: boolean = false;
  dateTimeFormatted: string = '';

  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
  placeholderDataHora: string = '';

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
      dateTime: '2025-08-08T10:00:00',
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
      dateTime: '2025-10-10T10:00:00',
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
  constructor(private route: Router) {
    moment.locale('pt-br');
    this.placeholderDataHora =
      moment().add(1, 'days').format('DD/MM/YYYY') + ' - 12:00'; // Data de amanhã às 12:00

    this.cards.forEach((card) => {
      let dateTimeFormatted: string = '';

      if (card.dateTime) {
        const formattedDate = moment(card.dateTime).format('DD/MM/YYYY');
        const formattedTime = moment(card.dateTime).format('HH:mm');
        dateTimeFormatted = `${formattedDate} - ${formattedTime}`;

        card.placeholderDataHora = dateTimeFormatted;
      }

      if (card.editedPrice) {
        card.editedPrice = card.price;
      }
    });
  }
  ngAfterViewInit() {
    this.bsCarousel = new Carousel(this.carousel.nativeElement, {
      interval: false,
      touch: true, // Habilita o arrasto
    });

    // Listen to slide events
    this.carousel.nativeElement.addEventListener(
      'slid.bs.carousel',
      (event: any) => {
        this.selectedIndex = event.to;
      }
    );
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

  // Adicione esta função ao seu componente pai
  toggleCalendar(card: any, event?: Event) {
    let dateTimeFormatted: string = '';

    if (event) {
      event.stopPropagation(); // Impede que o evento chegue ao document.click
    }
    card.calendarActive = !card.calendarActive;

    if (card) {
      const formattedDate = moment(card.dateTime).format('DD/MM/YYYY');
      const formattedTime = moment(card.dateTime).format('HH:mm');
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
    let dateTimeFormatted: string = '';

    if (index >= 0 && index <= 2 && index !== this.selectedIndex) {
      this.selectedIndex = index;

      // Adicione esta verificação para garantir que o carrossel está inicializado
      if (this.bsCarousel) {
        // Força uma transição suave
        const carouselElement = this.carousel.nativeElement;
        carouselElement.classList.remove('slide'); // Remove temporariamente a classe de transição

        this.bsCarousel.to(index);

        // Restaura a classe após um pequeno delay
        setTimeout(() => {
          carouselElement.classList.add('slide');
        }, 50);
      }
    }

    this.cards.forEach((card) => {
      if (card.dateTime) {
        const formattedDate = moment(card.dateTime).format('DD/MM/YYYY');
        const formattedTime = moment(card.dateTime).format('HH:mm');
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

      if (card.editedPrice) {
        card.editedPrice = card.price;
        card.renegotiateActive = true; // desabilita campo de edição de valor
      }
    });
  }
  // Método para quando o carrossel muda via navegação
  onSlideChanged(event: any) {
    this.selectedIndex = event.to;
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
