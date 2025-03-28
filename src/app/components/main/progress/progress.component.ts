import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';
import * as moment from 'moment'; // Importando o Moment.js
import { CardOrders } from 'src/interfaces/card-orders';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  budgets: string[] = ['Em andamento(23)', 'Finalizados(5)']; // Lista dinâmica
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
 
  yourMarkedDatesArray = ['2025-03-24', '2025-03-25', '2025-03-27'];

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
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: true,
    },
  ];

  constructor() {}

  ngOnInit() {
  }

// Datas que devem ser marcadas no formato 'YYYY-MM-DD'

onDateSelected(date: string) {
  console.log('Data selecionada:', date);
  // Faça algo com a data selecionada
}

  selectItem(index: number): void {
    this.selectedIndex = index; // Atualiza o item selecionado
  }
}
