import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardOrders } from 'src/interfaces/card-orders';
import { HistoricModel } from 'src/interfaces/historic.model';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  calendarData: string = '';
  selectedTime: string = '12:00';

  overlay: boolean = false;
  faPencil = 'fas fa-pencil-alt';
  faTimes = 'fas fa-times';
  headerPageOptions: string[] = [
    'Serviços(23)',
    'Em andamento(3)',
    'Finalizados(5)',
  ]; // Lista dinâmica
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada

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
      calendarActive: true,
      dateTime: '2021-08-10T10:00:00',
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
      calendarActive: true,
      dateTime: '2021-08-10T10:00:00',
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

  constructor(private route: Router) {
    moment.locale('pt-br'); // Define o idioma para português
    this.placeholderDataHora =
      moment().add(1, 'days').format('DD/MM/YYYY') + ' - 12:00'; // Data de amanhã às 12:00
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
  calendarActive(card?: any): void {
    this.overlay = true;

    // const cardInfo = this.cards.find((c) => c.id === card.id);
    const cardInfo = this.cards.find((c) => c.id === card.id);
    if (cardInfo) {
      cardInfo.calendarActive = !cardInfo.calendarActive; // Alterna o estado

      if (cardInfo.calendarActive === true) {
        cardInfo.editedPrice = cardInfo.price;
      }
    }
  }

  onDateSelected(date: string) {
    this.calendarData = date; // Atualiza a data no componente pai
    this.updatePlaceholder(); // Atualiza a string final
  }

  onTimeSelected(time: string) {
    this.selectedTime = time; // Atualiza o horário no componente pai
    this.updatePlaceholder(); // Atualiza a string final
  }

  updatePlaceholder(): void {
    if (this.calendarData && this.selectedTime) {
      const formattedDate = moment(this.calendarData).format('DD/MM/YYYY'); // Formata a data para padrão BR
      this.placeholderDataHora = `${formattedDate} - ${this.selectedTime}`;
    }
  }
  selectItem(index: number): void {
    this.selectedIndex = index; // Atualiza o item selecionado
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
