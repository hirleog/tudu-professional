import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardOrders } from 'src/interfaces/card-orders';

@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css'],
})
export class AppHomeComponent implements OnInit {
  renegotiate: boolean = true;
  faPencil = 'fas fa-pencil-alt';
  faTimes = 'fas fa-times';

  cards: CardOrders[] = [
    {
      id: 102,
      icon: 'fas fa-car', // Ícone FontAwesome
      serviceName: 'Lavagem Automotiva',
      description: 'Lavagem completa com polimento para meu carro...',
      address: 'Rua doutor paulo de andrade arantes, 52',
      price: '150,00',
      editedPrice: '',
      renegotiateActive: true,
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: false,
    },
    {
      id: 103,
      icon: 'fas fa-paint-roller',
      serviceName: 'Pintura Residencial',
      description: 'Preciso pintar a sala e os quartos do apartamento...',
      address: 'Rua doutor antonio lobo sobrinho, 123',
      price: '150,00',
      editedPrice: '',
      renegotiateActive: true,
      dateTime: '2021-08-10T10:00:00',
      hasQuotes: true,
    },
  ];

  constructor(private route: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola suavemente para o topo
  }

  renegotiateActive(card?: any): void {
    this.renegotiate = !this.renegotiate;
    const cardInfo = this.cards.find((c) => c.id === card.id);
    if (cardInfo) {
      cardInfo.renegotiateActive = !cardInfo.renegotiateActive; // Alterna o estado

      if (cardInfo.renegotiateActive === true) {
        cardInfo.editedPrice = cardInfo.price;
      }
    }
  }

  goToShowcase() {
    this.route.navigate(['/']);
  }
}
