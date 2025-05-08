import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus',
})
export class StatusFilterPipe implements PipeTransform {
  transform(cards: any[], selectedIndex: number, id_prestador: string): any[] {
    // if (!cards || !id_prestador) return [];

    // // Filtra apenas os cards com candidatura do prestador
    // const candidaturasDoPrestador = cards.filter((card) =>
    //   card.candidaturas?.some(
    //     (c: any) => c.prestador_id === Number(id_prestador)
    //   )
    // );

    // // Depois aplica o filtro de status com base na aba selecionada
    // switch (selectedIndex) {
    //   case 0: // Publicado
    //     return candidaturasDoPrestador.filter(
    //       (card) => card.status_pedido === 'ek'
    //     );
    //   case 1: // Em andamento
    //     return candidaturasDoPrestador;
    //   default:
    //     return candidaturasDoPrestador;
    if (!cards || !id_prestador) return [];

    const id = Number(id_prestador);

    switch (selectedIndex) {
      case 0: // Aba "Publicado"
        return cards.filter(
          (card) =>
            card.status_pedido === 'publicado' &&
            !card.candidaturas?.some((c: any) => c.prestador_id === id)
        );

      case 1: // Aba "Em andamento"
        return cards.filter((card) =>
          card.candidaturas?.some((c: any) => c.prestador_id === id)
        );

      default:
        return cards;
    }
  }
}
