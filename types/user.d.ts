export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: {
    name: string;
    role_type: string;
  };
  fuel_station_id: string;
  fuel_station: {
    active: boolean;
    hq_id: string;
    id: string;
    name: string;
    total_amount: string;
  };
}

export interface AuthState {
  token: string | null;
  isLoading: boolean;
}
