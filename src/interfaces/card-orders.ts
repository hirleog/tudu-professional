export interface CardOrders {
    id: number;
    icon: string;
    serviceName: string;
    description: string;
    address: string;
    price: string;
    editedPrice?: string;
    dateTime: string;
    hasQuotes: boolean; // Se há orçamentos disponíveis
}