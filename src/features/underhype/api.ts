export type RecordType = 'contact' | 'hiring'
export type AdminRole = 'owner' | 'editor' | 'viewer'
export type ContactRecord = { id:string; name:string; email:string; phone?:string|null; services?:string|null; country?:string|null; state?:string|null; submitted_at:string; status?:string|null; message?:string|null }
export type HiringRecord = { id:string; full_name:string; email:string; phone?:string|null; role?:string|null; experience?:string|null; country?:string|null; state?:string|null; submitted_at:string; status?:string|null; resume_filename?:string|null; resume_key?:string|null }
export type OverviewData = { stats:{contacts:number;hiring:number;newContacts:number;newHiring:number}; recentContacts:ContactRecord[]; recentHiring:HiringRecord[] }
export type AnalyticsData = { range:string;stats:{contacts:number;hiring:number;people:number};countries:{country:string;contacts:number;applications:number;total:number}[];services:{services:string;count:number}[];daily:{day:string;contacts:number;hiring:number}[];roles:{role:string;count:number}[];statuses:{status:string;count:number}[] }
export type PageData<T> = {rows:T[];total:number;page:number;limit:number}
async function request<T>(path:string,init?:RequestInit):Promise<T>{
 const response=await fetch(path,{...init,credentials:'same-origin',cache:'no-store',headers:{...(init?.body?{'Content-Type':'application/json'}:{}),...init?.headers}})
 const payload=await response.json().catch(()=>({}))
 if(!response.ok||payload.ok===false)throw new Error(payload.error||`Request failed (${response.status})`)
 return payload as T
}
export const adminApi={
 me:()=>request<{email:string;role:AdminRole}>('/api/admin/me'),
 overview:()=>request<OverviewData>('/api/admin/overview'),
 analytics:(range:string)=>request<AnalyticsData>(`/api/admin/analytics?range=${encodeURIComponent(range)}`),
 contacts:(params:URLSearchParams)=>request<PageData<ContactRecord>>(`/api/admin/contacts?${params}`),
 hiring:(params:URLSearchParams)=>request<PageData<HiringRecord>>(`/api/admin/hiring?${params}`),
 status:(type:RecordType,id:string,status:string)=>request('/api/admin/status',{method:'PATCH',body:JSON.stringify({type,id,status})}),
 export:(type:'all'|RecordType)=>request<{contacts:ContactRecord[];hiring:HiringRecord[]}>(`/api/admin/export?type=${type}`),
 resumeUrl:(id:string)=>`/api/admin/resume?id=${encodeURIComponent(id)}`,
 archived:()=>request<{contacts:ContactRecord[];hiring:HiringRecord[]}>('/api/admin/archive'),
 restore:(type:RecordType,id:string)=>request('/api/admin/restore',{method:'POST',body:JSON.stringify({type,id})}),
 archive:(type:RecordType,ids:string[])=>request('/api/admin/archive',{method:'POST',body:JSON.stringify({type,ids})}),
 users:()=>request<{users:{email:string;role:AdminRole;created_at:string}[]}>('/api/admin/users'),
 addUser:(email:string,role:'editor'|'viewer')=>request('/api/admin/users',{method:'POST',body:JSON.stringify({email,role})}),
 revokeUser:(email:string)=>request('/api/admin/users/revoke',{method:'POST',body:JSON.stringify({email})}),
}
