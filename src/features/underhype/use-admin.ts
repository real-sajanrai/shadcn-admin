import {useQuery} from '@tanstack/react-query'
import {adminApi} from './api'
export const adminKeys={me:['underhype-admin','me'] as const,overview:['underhype-admin','overview'] as const,analytics:(range:string)=>['underhype-admin','analytics',range] as const}
export function useAdminIdentity(){return useQuery({queryKey:adminKeys.me,queryFn:adminApi.me,retry:false,staleTime:60000})}
export function useAdminOverview(){return useQuery({queryKey:adminKeys.overview,queryFn:adminApi.overview,refetchInterval:60000})}
export function useAdminAnalytics(range:string){return useQuery({queryKey:adminKeys.analytics(range),queryFn:()=>adminApi.analytics(range),refetchInterval:60000})}
