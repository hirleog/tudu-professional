export interface CardOrders {
    id: number;
    icon: string;
    serviceName: string;
    description: string;
    address: string;
    price: string;
    editedPrice?: string;
    renegotiateActive?: boolean;
    calendarActive?: boolean;
    dateTime: string;
    hasQuotes: boolean; // Se há orçamentos disponíveis
}