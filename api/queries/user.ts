import { AxiosResponse } from 'axios';
import { UseQueryResult } from '@tanstack/react-query/src/types';
import { useQuery } from '@tanstack/react-query';
import request from '../request';
import Endpoints from '../endpoints';
import { User } from '@/types/user';

export const useGetUserProfile: () => UseQueryResult<
  AxiosResponse<{ user: User }>,
  unknown
> = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => request.get(Endpoints.user.profile),
  });
};

export const useGetMetrics: () => UseQueryResult<
  AxiosResponse<{
    total_amount: string;
    total_count: number;
  }>,
  unknown
> = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => request.get(Endpoints.metrics.root),
  });
};
