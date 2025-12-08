// agenda-chronology.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AgendaChronologyService {
  validateChronologicalOrder(services: any[]): any[] {
    if (!services || services.length === 0) return [];

    // Ordenar por horário
    const sortedServices = [...services].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    const now = new Date();
    const MARGIN_MINUTES = 15; // Margem de tolerância

    return sortedServices.map((service, index) => {
      const serviceTime = new Date(service.datetime);

      // Verificar se há serviços anteriores não iniciados
      const hasPendingPrevious = sortedServices
        .slice(0, index)
        .some(
          (s) =>
            s.status === 'pendente' ||
            s.status === 'publicado' ||
            s.status === 'confirmado'
        );

      // Calcular se está dentro da margem de tempo
      const timeDiff = serviceTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      const isWithinMargin =
        minutesDiff <= MARGIN_MINUTES && minutesDiff >= -MARGIN_MINUTES;

      // Verificar se já pode iniciar
      const canStart =
        !hasPendingPrevious && (isWithinMargin || now >= serviceTime);

      // Calcular status do temporizador
      const statusTemporizador = this.getTimerStatus(serviceTime, now);

      return {
        ...service,
        ordemCronologica: index + 1,
        bloqueado: !canStart,
        podeIniciar: canStart,
        statusTemporizador: statusTemporizador,
      };
    });
  }

  private getTimerStatus(serviceTime: Date, now: Date): string {
    const diff = serviceTime.getTime() - now.getTime();

    if (diff < 0) {
      const minutesLate = Math.floor(Math.abs(diff) / (1000 * 60));
      return `Atrasado ${minutesLate}min`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `Em ${hours}h${minutes}m`;
    } else if (minutes > 0) {
      return `Em ${minutes}min`;
    } else {
      return 'Agora';
    }
  }
}
