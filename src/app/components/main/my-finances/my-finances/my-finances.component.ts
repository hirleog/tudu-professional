import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialService } from 'src/app/financial.service';
import { TransactionModel } from 'src/interfaces/transaction-model';

@Component({
  selector: 'app-my-finances',
  templateUrl: './my-finances.component.html',
  styleUrls: ['./my-finances.component.scss'],
})
export class MyFinancesComponent implements OnInit {
  currentTab: string = 'overview';

  // transactions = [
  //   {
  //     id: '1',
  //     type: 'Pagamento recebido',
  //     transactionId: '#TRX-78945',
  //     client: 'Empresa ABC',
  //     amount: 'R$ 2.345,67',
  //     date: '28/05/2023',
  //     status: 'completed',
  //     statusText: 'Concluído',
  //     icon: 'fa-check-circle',
  //     iconClasses:
  //       'bg-success-subtle dark:bg-green-900 text-green-600 dark:text-green-300',
  //   },
  //   {
  //     id: '2',
  //     type: 'Pagamento pendente',
  //     transactionId: '#TRX-78944',
  //     client: 'Empresa XYZ',
  //     amount: 'R$ 1.234,56',
  //     date: '27/05/2023',
  //     status: 'processing',
  //     statusText: 'Processando',
  //     icon: 'fa-clock',
  //     iconClasses:
  //       'bg-info-subtle dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
  //   },
  //   {
  //     id: '3',
  //     type: 'Pagamento cancelado',
  //     transactionId: '#TRX-78943',
  //     client: 'Cliente A',
  //     amount: 'R$ 890,12',
  //     date: '25/05/2023',
  //     status: 'cancelled',
  //     statusText: 'Cancelado',
  //     icon: 'fa-times-circle',
  //     iconClasses:
  //       'bg-danger-subtle dark:bg-red-900 text-red-600 dark:text-red-300',
  //   },
  // ];

  transactions: TransactionModel[] = [];
  paginacao: any;
  id_prestador: any;

  constructor(
    private route: Router,
    private FinancialService: FinancialService
  ) {
    this.id_prestador = localStorage.getItem('prestador_id');
  }

  ngOnInit(): void {
    this.buscarPagamentos(this.id_prestador, 1, 10); // exemplo com id_cliente = 14
  }

  buscarPagamentos(id_prestador: any, page: number, limit: number) {
    this.FinancialService.buscarPagamentosPorClientePaginado(
      id_prestador,
      page,
      limit
    ).subscribe((res) => {
      this.paginacao = res.data.paginacao;

      const allTransactions = res.data.pagamentos.map(
        (transaction: TransactionModel) => {
          return {
            ...transaction,
            icon:
              transaction.status === 'APPROVED'
                ? 'fa-check-circle'
                : transaction.status === 'processing'
                ? 'fa-clock'
                : transaction.status === 'CANCELLED'
                ? 'fa-times-circle'
                : transaction.status === 'NOT APPROVED'
                ? 'fa-times-circle'
                : transaction.status === 'DENIED'
                ? 'fa-times-circle'
                : transaction.status === 'ERROR'
                ? 'fa-times-circle'
                : 'fa-question-circle',
          };
        }
      );
      this.transactions = allTransactions;
      // return {};
    });
  }

  setTab(tab: string) {
    this.currentTab = tab;
  }

  isActive(tab: string): boolean {
    return this.currentTab === tab;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'bg-success-subtle dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'processing':
        return 'bg-info-subtle dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'CANCELLED':
        return 'bg-danger-subtle dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'NOT APPROVED':
        return 'bg-danger-subtle dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'DENIED':
        return 'bg-danger-subtle dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'ERROR':
        return 'bg-danger-subtle dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  goHome(): void {
    this.route.navigate(['/tudu-professional/home']);
  }

  back(): void {
    this.route.navigate(['/profile'], {
      queryParams: { param: 'professional' },
    });
    // const route =
    //   this.flow === 'progress'
    //     ? '/tudu-professional/progress'
    //     : '/tudu-professional/home';

    // if (this.flow === 'progress') {
    //   this.route.navigate([route]);
    // } else {
    //   this.route.navigate([route], {
    //     queryParams: { homeFlow: this.flow },
    //   });
    // }
  }
}
