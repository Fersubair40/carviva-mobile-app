import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import request from '../request';
import Endpoints from '../endpoints';

export const useVerifyFuelToken: () => UseMutationResult<
  AxiosResponse<any>,
  AxiosError<any>,
  { fuel_token: string },
  unknown
> = () =>
  useMutation({
    mutationFn: (params) => request.post(Endpoints.fuelTokens.verify, params),
  });

export const useDispsenseFuelToken: () => UseMutationResult<
  AxiosResponse<any>,
  AxiosError<any>,
  { dispense_token: string; service: string },
  unknown
> = () =>
  useMutation({
    mutationFn: (params) => request.post(Endpoints.fuelTokens.dispense, params),
  });
