import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import request from '../request';
import Endpoints from '../endpoints';

export const useBuyFuel: () => UseMutationResult<
  AxiosResponse<{
    payments: {
      id: string;
      amount: string;
      ref: string;
      approved: boolean;
      status: string;
      created_at: string;
      updated_at: string;
      product: string;
      product_type: string;
      mobile: string;
      email: string;
      station_name: string;
      first_name: string;
      last_name: string;
      initiated_by: null;
    };
    settings: {
      ignore_dispense_token: boolean;
    };
    message: string;
  }>,
  AxiosError<any>,
  {
    wallet_id: string;
    amount: number;
    pin: string;
  },
  unknown
> = () =>
  useMutation({
    mutationFn: (params) => request.post(Endpoints.buyFuel.attendants, params),
  });
