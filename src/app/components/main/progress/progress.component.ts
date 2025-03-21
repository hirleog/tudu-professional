import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  budgets: string[] = ['Em andamento(23)', 'Pedidos aceitos(6)', 'Finalizados(5)']; // Lista dinâmica
  selectedIndex: number = 0; // Inicia a primeira opção já selecionada

  cards: ProgressCard[] = [
    {
      name: 'Aline',
      photo: '../../../../assets/aline.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Pintura Residencial',
      status: 'Aguardando prestador',
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Matheus',
      photo: '../../../../assets/matheus.PNG', // Ícone FontAwesome
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 15:00 - 15:30',
      dateTime: '' // Adicionamos esta propriedade
    },
    {
      name: 'Guilherme',
      photo: '../../../../assets/GUI.PNG',
      icon: 'fa-paint-brush',
      service: 'Lavagem de Automotiva',
      status: 'Hoje, 12:20 - 15:00',
      dateTime: '' // Adicionamos esta propriedade
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  
  selectItem(index: number): void {
    this.selectedIndex = index; // Atualiza o item selecionado
  }

}
