export interface TransactionModel {
  id: number;
  id_pagamento: string;
  id_pedido: string;
  total_amount: number;
  origin_amount: number;
  auth_code: string | null;
  status: string;
  response_description: string;
  type: string;
  host: string;
  installments: number;
  installments_amount: number;
  authorization_date: string | null;
  capture_date: string | null;
  reversed_amount: number | null;
  icon: string;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}
