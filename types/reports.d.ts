export interface ReportResponse {
  meta: {
    page: number;
    total_count: number;
    limit: number;
  };
  transactions: Reports[];
}

export interface Reports {
  id: string;
  amount: string;
  created_at: string;
  fuel_stations: {
    id: string;
    name: string;
    active: boolean;
    hq_id: string;
    created_at: string;
    updated_at: string;
    icon: string | null;
    business_id: number | null;
  };
  fuel_stations_id: string;
  payments: {
    id: string;
    amount: string;
    approved: boolean;
    category: string;
    created_at: string;
    email: string;
    first_name: string;
    fuel_rate: number | null;
    fuel_token: {
      status: string;
    };
    initiated_by: {
      type: string;
      initiator_id: string;
      initiator_name: string;
    };
    last_name: string;
    mobile: string;
    product: string;
    product_type: string;
    quantity: number | string;
    ref: string;
    reg_number: string;
    reversal_reason: null;
    station_name: string;
    status: string;
    third_party_id: string | null;
    updated_at: string;
  };
  ref: string;
  service: string;
  transaction_id: string;
  updated_at: string;
  user: {
    id: string;
    status: string;
    role_id: string;
    last_name: string;
    first_name: string;
    phone_number: string;
    fuel_stations_id: string;
    station_manager_id: string;
  };
  user_id: string;
}
