// agenda-calendar-header.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda-calendar-header',
  templateUrl: './agenda-calendar-header.component.html',
  styleUrls: ['./agenda-calendar-header.component.scss'],
})
export class AgendaCalendarHeaderComponent implements OnInit {
  @Input() selectedDate: Date = new Date();
  @Input() services: any[] = []; // services: todos os serviços disponíveis

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() viewModeChanged = new EventEmitter<'calendar' | 'list'>();

  viewMode: 'calendar' | 'list' = 'calendar';
  weekDays: any[] = [];
  currentWeekNumber: number = 0;
  today: Date = new Date();
  currentWeekStart: Date = new Date(); // Data usada como referência para a semana atual

  ngOnInit() {
    // Inicializa a data de início da semana para a data selecionada (ou hoje)
    this.currentWeekStart = new Date(this.selectedDate);
    this.generateWeekDays();
  }

  // Inicia o primeiro dia no meio do calendario horizontal
  // generateWeekDays() {
  //   // Calcula o dia de início da exibição (3 dias antes da data central)
  //   const startOfWeekDisplay = new Date(this.currentWeekStart);
  //   startOfWeekDisplay.setDate(startOfWeekDisplay.getDate() - 3);

  //   this.weekDays = [];

  //   for (let i = 0; i < 7; i++) {
  //     const date = new Date(startOfWeekDisplay);
  //     date.setDate(startOfWeekDisplay.getDate() + i);

  //     this.weekDays.push({
  //       date: date,
  //       name: this.getDayName(date),
  //       number: date.getDate(),
  //     });
  //   }

  //   this.currentWeekNumber = this.getWeekNumber(this.currentWeekStart);
  // }
  // inicia a semana no primeiro dia do calendario horizontal
  generateWeekDays() {
    const date = new Date(this.currentWeekStart);

    const daysToSubtract = date.getDay() === 0 ? 6 : date.getDay() - 1; // Subtrai para chegar na Segunda (1ª)

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - daysToSubtract);

    this.weekDays = [];

    // 2. Popula os 7 dias a partir do início da semana
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);

      this.weekDays.push({
        date: dayDate,
        name: this.getDayName(dayDate),
        number: dayDate.getDate(),
      });
    }

    this.currentWeekNumber = this.getWeekNumber(this.currentWeekStart);
  }

  nextWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
  }

  previousWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
  }

  goToToday() {
    this.currentWeekStart = new Date(); // Volta o centro para hoje
    this.selectedDate = new Date(); // Seleciona hoje
    this.generateWeekDays();
    this.dateSelected.emit(this.selectedDate);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  // --- Funções de Utilitários de Data ---

  isSameDay(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;

    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // agenda-calendar-header.component.ts

  // ... [outras funções] ...

  getWeekRange(): string {
    if (this.weekDays.length === 0) return '';

    const firstDay = this.weekDays[0];
    const lastDay = this.weekDays[6];

    const isSameMonth = firstDay.date.getMonth() === lastDay.date.getMonth();
    const isSameYear =
      firstDay.date.getFullYear() === lastDay.date.getFullYear();

    // Definições de meses (podem ser movidas para fora do método se já existirem)
    const getShortMonthName = (date: Date): string => {
      const months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      return months[date.getMonth()];
    };

    const getMonthName = (date: Date): string => {
      const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ];
      return months[date.getMonth()];
    };

    // --- LÓGICA REFATORADA ---

    if (isSameMonth) {
      // Ex: Dezembro 2025
      let result = getMonthName(firstDay.date);
      if (!isSameYear) {
        result += ` ${firstDay.date.getFullYear()}`;
      }
      return result;
    } else {
      // Ex: Dez 2025 - Jan 2026
      let range = `${getShortMonthName(firstDay.date)}`;

      // Adiciona o ano do primeiro mês se for diferente do ano do último mês
      if (firstDay.date.getFullYear() !== lastDay.date.getFullYear()) {
        range += ``;
      }

      range += ` - ${getShortMonthName(lastDay.date)} `;

      return range;
    }
  }

  // ... [restante do código] ...

  getDayName(date: Date): string {
    const days = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    return days[date.getDay()];
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // --- Funções de Contagem de Serviços ---
  getServiceDate(service: any): Date | null {
    // Variável para armazenar o ID do prestador logado (Ajuste conforme seu contexto)
    const prestadorId = 18; // Use a variável real do prestador logado aqui

    let serviceDateTimeStr: string | undefined;

    // Encontra a candidatura aceita deste prestador
    const acceptedCandidacy = service.candidaturas?.find(
      (c: any) =>
        c.prestador_id === prestadorId && c.status?.toLowerCase() === 'aceito'
    );

    if (acceptedCandidacy && acceptedCandidacy.horario_negociado) {
      serviceDateTimeStr = acceptedCandidacy.horario_negociado;
    } else {
      serviceDateTimeStr = service.horario_preferencial;
    }

    if (!serviceDateTimeStr) return null;

    const date = new Date(serviceDateTimeStr);
    // Verifica se a data é válida antes de retornar
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Conta o total de serviços ativos na semana visível.
   */
  getTotalServicesCount(): number {
    if (
      !this.services ||
      this.services.length === 0 ||
      this.weekDays.length === 0
    )
      return 0;

    const weekStart = new Date(this.weekDays[0].date); // Início do primeiro dia
    const weekEnd = new Date(this.weekDays[6].date); // Fim do último dia

    // AJUSTE CRÍTICO: Configura o 'weekEnd' para 23:59:59.999 do último dia visível,
    // garantindo que todos os serviços agendados naquele dia sejam incluídos.
    weekEnd.setHours(23, 59, 59, 999);

    return this.services.filter((service) => {
      const serviceDate = this.getServiceDate(service);

      if (!serviceDate) return false;

      // 1. Filtra por intervalo de datas (inclusivo)
      const isInWeek = serviceDate >= weekStart && serviceDate <= weekEnd;

      // 2. Filtra por status ativo (pendente ou aceito)
      const isPendente = service.status_pedido?.toLowerCase() === 'pendente';
      const acceptedCandidacy = service.candidaturas?.some(
        (c: any) =>
          c.prestador_id === 18 && c.status?.toLowerCase() === 'aceito'
      );
      const isActive = isPendente || acceptedCandidacy;

      return isInWeek && isActive;
    }).length;
  }

  // ... [Certifique-se de ajustar 'getServicesCountForDate' para usar 'getServiceDate'] ...

  /**
   * Conta quantos serviços estão na data específica.
   */
  getServicesCountForDate(date: Date): number {
    if (!this.services || this.services.length === 0) return 0;

    return this.services.filter((service) => {
      const serviceDate = this.getServiceDate(service);

      if (!serviceDate) return false;

      const isCorrectDate = this.isSameDay(serviceDate, date);

      if (!isCorrectDate) return false;

      // A lógica de status ativo é a mesma:
      const isPendente = service.status_pedido?.toLowerCase() === 'pendente';
      const acceptedCandidacy = service.candidaturas?.some(
        (c: any) =>
          c.prestador_id === 18 && c.status?.toLowerCase() === 'aceito'
      );

      return isPendente || acceptedCandidacy;
    }).length;
  }
  /**
   * Verifica se há qualquer serviço na data (apenas para o indicador de ponto, que pode ser removido)
   */
  hasServicesOnDate(date: Date): boolean {
    return this.getServicesCountForDate(date) > 0;
  }

  /**
   * Conta os serviços na data de hoje.
   */
  getTodaysServicesCount(): number {
    return this.getServicesCountForDate(this.today);
  }
}
