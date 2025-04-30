import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import request from '../request';
import Endpoints from '../endpoints';

export const useLogin: () => UseMutationResult<
  AxiosResponse<any>,
  AxiosError<any>,
  { phone_number: string; password: string },
  unknown
> = () =>
  useMutation({
    mutationFn: (params) => request.post(Endpoints.auth.login, params),
  });

