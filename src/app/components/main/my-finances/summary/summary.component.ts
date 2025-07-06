import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  cards = [
    {
      title: 'Saldo Disponível',
      value: 'R$ 12.345,67',
      icon: 'fa-wallet',
      color:
        ' bg-success-subtle dark:bg-green-900  dark:text-green-300 p-3 rounded-full',
      description: '+2.5% em relação ao mês passado',
    },
    {
      title: 'Recebimentos Pendentes',
      value: 'R$ 8.765,43',
      icon: 'fa-clock',
      color:
        'bg-info-subtle dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 p-3 rounded-full',
      description: '5 transações pendentes',
    },
    {
      title: 'Recebido no Mês',
      value: 'R$ 23.456,78',
      icon: 'fa-check-circle',
      // color: 'purple',
      color:
        'bg-primary-subtle dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 p-3 rounded-full',
      description: '+15% em relação ao mês passado',
    },
    {
      title: 'Próximo Repasse',
      value: 'R$ 5.678,90',
      icon: 'fa-calendar-day',
      color:
        'bg-warning-subtle dark:bg-red-900 text-yellow-600 dark:text-yellow-300 p-3 rounded-full',
      description: 'Previsto para 05/06/2023',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
