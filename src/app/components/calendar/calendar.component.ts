import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  currentDate = moment();
  days: moment.Moment[] = [];
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  selectedDate: moment.Moment | null = null;
  selectedTime: string = '';

  @Input() openCalendar: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() hasTime: boolean = false; // Array de datas no formato 'YYYY-MM-DD'
  @Input() markedDates: string[] = []; // Array de datas no formato 'YYYY-MM-DD'
  @Output() dateSelected = new EventEmitter<string>();
  @Output() timeSelected = new EventEmitter<string>();

  @Input() showWeekView: boolean = false;
  weekDays: { date: moment.Moment; isFirst: boolean }[] = [];

  constructor() {
    this.generateCalendar();
  }

  ngOnChanges() {
    this.generateCalendar();
    if (this.showWeekView && this.markedDates?.length > 0) {
      this.generateWeekDays();
    }
  }

  toggleCalendar(param?: string): void {
    this.openCalendar = !this.openCalendar;
  }
  closeCalendar() {
    this.openCalendar = false;
  }

  generateWeekDays() {
    const firstDate = moment(this.markedDates[0]);
    this.weekDays = [];

    // Gerar os 7 dias a partir da primeira data marcada
    for (let i = 0; i < 7; i++) {
      const currentDate = firstDate.clone().add(i, 'days');
      this.weekDays.push({
        date: currentDate,
        isFirst: i === 0,
      });
    }
  }

  getDisplayedDays() {
    const screenWidth = window.innerWidth;
    // Se a tela for menor que 380px, mostra 6 dias, senão mostra todos os 7
    return screenWidth < 380 ? this.weekDays.slice(0, 6) : this.weekDays;
  }

  getDayName(date: moment.Moment): string {
    return date.format('ddd');
  }

  generateCalendar() {
    this.days = [];

    // Primeiro dia do mês
    const startOfMonth = this.currentDate.clone().startOf('month');
    // Último dia do mês
    const endOfMonth = this.currentDate.clone().endOf('month');

    // Dia da semana do primeiro dia (0-6)
    const startDay = startOfMonth.day();

    // Dia da semana do último dia (0-6)
    const endDay = endOfMonth.day();

    // Data inicial (pode ser do mês anterior)
    const startDate = startOfMonth.clone().subtract(startDay, 'days');

    // Data final (pode ser do próximo mês)
    const endDate = endOfMonth.clone().add(6 - endDay, 'days');

    // Gerar todos os dias do calendário
    let date = startDate.clone();
    while (date.isBefore(endDate)) {
      this.days.push(date.clone());
      date.add(1, 'day');
    }
  }

  prevMonth() {
    this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  isMarked(date: moment.Moment): boolean {
    const dateStr = date.format('YYYY-MM-DD');
    return this.markedDates.includes(dateStr);
  }
  isSelected(date: moment.Moment): boolean {
    return !!this.selectedDate && date.isSame(this.selectedDate, 'day');
  }
  // isMarked(day: moment.Moment): boolean {
  //   const compromissos = [1];
  //   let dateStr: any;
  //   if (compromissos.length === 0) {
  //     dateStr = day.format('YYYY-MM-DD');
  //   }
  //   // return this.markedDates.includes(dateStr);

  //   return this.selectedDate ? day.isSame(this.selectedDate, 'day') : false;
  // }

  // selectDate(date: moment.Moment) {
  //   this.selectedDate = date;
  //   this.emitFormattedDateTime(); // Atualiza e emite a data e hora sempre que a data for selecionada
  // }

  // onTimeChange(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.selectedTime = inputElement.value; // Atualiza a variável de horário
  //   this.emitFormattedDateTime(); // Atualiza e emite a data e hora sempre que o horário for alterado
  // }

  // emitFormattedDateTime(): void {
  //   if (this.selectedDate && this.selectedTime) {
  //     const formattedDateTime = `${this.selectedDate.format('DD/MM/YYYY')} - ${this.selectedTime}`;
  //     this.dateTimeSelected.emit(formattedDateTime); // Emite o valor formatado para o componente pai
  //     console.log(formattedDateTime); // Apenas para debug
  //   }
  // }

  selectDate(date: moment.Moment) {
    this.selectedDate = date;
    this.dateSelected.emit(date.format('YYYY-MM-DD'));
    console.log(date.format('YYYY-MM-DD'));
  }
  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.timeSelected.emit(inputElement.value); // Emite o valor para o pai
  }
  isCurrentMonth(date: moment.Moment): boolean {
    return date.month() === this.currentDate.month();
  }

  getMonthYear(): string {
    return this.currentDate.format('MMMM YYYY');
  }
}
