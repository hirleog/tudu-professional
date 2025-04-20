import { Component, OnInit } from '@angular/core';
import { ProgressCard } from 'src/interfaces/progress-card';
import * as moment from 'moment'; // Importando o Moment.js
import { CardOrders } from 'src/interfaces/card-orders';
import { CardService } from '../../services/card.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

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

  // cards: any[] = [
  //   {
  //     id: 102,
  //     icon: 'fas fa-car', // Ícone FontAwesome
  //     serviceName: 'Lavagem Automotiva',
  //     description: 'Lavagem completa com polimento para meu carro...',
  //     address: 'Rua doutor paulo de andrade arantes, 52',
  //     price: '150,00',
  //     editedPrice: '150,00',
  //     renegotiateActive: true,
  //     dateTime: '2021-08-10T10:00:00',
  //     hasQuotes: false,
  //   },
  //   {
  //     id: 103,
  //     icon: 'fas fa-paint-roller',
  //     serviceName: 'Pintura Residencial',
  //     description: 'Preciso pintar a sala e os quartos do apartamento...',
  //     address: 'Rua doutor antonio lobo sobrinho, 123',
  //     price: '150,00',
  //     editedPrice: '',
  //     renegotiateActive: true,
  //     dateTime: '2021-08-10T10:00:00',
  //     hasQuotes: true,
  //   },
  // ];

  constructor(public cardService: CardService, public route: Router) {}

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
    this.cardService.getCards().subscribe({
      next: (response) => {
        this.cards = (response as CardOrders[]).map((card) => ({
          ...card, // Mantém os campos existentes
          icon: this.cardService.getIconByLabel(card.categoria) || '', // Garante que o ícone nunca seja null
          renegotiateActive: true, // Adiciona o campo manualmente
          calendarActive: false, // Adiciona o campo manualmente
          horario_preferencial: card.horario_preferencial, // Usa o valor existente ou um padrão
          placeholderDataHora: '', // Adiciona o campo manualmente
        }));
        this.selectItem(0);
        console.log('progess', this.cards);

      },
      error: (error) => {
        console.error('Erro ao obter os cartões:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      },
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
