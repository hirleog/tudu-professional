import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';
import * as moment from 'moment'; // Importando o Moment.js

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  budgets: string[] = ['Em andamento(23)', 'Finalizados(5)']; // Lista dinâmica
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada
 
  yourMarkedDatesArray = ['2025-03-24', '2025-03-25', '2025-03-27'];

  cards: ProgressCard[] = [
    {
      name: 'Aline',
      photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Pintura Residencial',
      status: 'Aguardando prestador',
      dateTime: '', // Adicionamos esta propriedade
    },
    {
      name: 'Matheus',
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 15:00 - 15:30',
      dateTime: '', // Adicionamos esta propriedade
    },
    {
      name: 'Guilherme',
      photo: '../../../../assets/GUI.PNG',
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 12:20 - 15:00',
      dateTime: '', // Adicionamos esta propriedade
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
