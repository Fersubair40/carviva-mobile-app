import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import request from '../request';
import Endpoints from '../endpoints';
import { ReportResponse } from '@/types/reports';

export const useGetHistory: (params: {
  page: number;
  limit: number;
}) => UseQueryResult<AxiosResponse<ReportResponse>, unknown> = ({ page, limit }) => {
  return useQuery({
    queryKey: ['reports', page, limit],
    queryFn: () =>
      request.get(Endpoints.report.root, {
        params: {
          page,
          limit,
        },
      }),
  });
};
