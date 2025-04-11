export interface CardServiceModel {
    id_pedido: string;
    id_cliente: number;
    id_prestador: number | null;
    categoria: string;
    subcategoria: string;
    valor: string;
    horario_preferencial: string;
    codigo_confirmacao?: string;
    data_finalizacao?: string;
    status_pedido: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
    complement?: string;
    createdAt: string;
    updatedAt: string;
  }