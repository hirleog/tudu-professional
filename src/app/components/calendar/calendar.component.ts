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
openCalendar = false;
  @Input() markedDates: string[] = []; // Array de datas no formato 'YYYY-MM-DD'
  @Output() dateSelected = new EventEmitter<string>();

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

  toggleCalendar():void {
    this.openCalendar = !this.openCalendar;
    // if (this.showWeekView && this.markedDates?.length > 0) {
      // this.generateWeekDays();
    // }f
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

  selectDate(date: moment.Moment) {
    this.dateSelected.emit(date.format('YYYY-MM-DD'));
  }

  isCurrentMonth(date: moment.Moment): boolean {
    return date.month() === this.currentDate.month();
  }

  getMonthYear(): string {
    return this.currentDate.format('MMMM YYYY');
  }
}
