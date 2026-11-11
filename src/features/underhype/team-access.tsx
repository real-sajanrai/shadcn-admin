import {ShieldCheck,Users} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from '@/components/ui/card'
import {useAdminIdentity} from './use-admin'

export function TeamAccessPage(){
 const identity=useAdminIdentity()
 return <div className='space-y-5'>
  <div><Badge>ACCESS OVERVIEW</Badge><h1 className='mt-2 text-3xl font-semibold'>Team access</h1><p className='text-sm text-muted-foreground'>Authentication is enforced by Cloudflare Access and the staging Worker.</p></div>
  <Card><CardHeader><CardTitle className='flex items-center gap-2'><Users className='size-5'/>Current session</CardTitle><CardDescription>Identity returned by the authenticated staging Worker.</CardDescription></CardHeader><CardContent className='space-y-3'>
   {identity.isLoading?<p className='text-sm text-muted-foreground'>Verifying access…</p>:identity.isError?<p role='alert' className='text-sm text-destructive'>Unable to verify your identity. Team administration is unavailable.</p>:<><div className='rounded-lg border p-3'><p className='text-xs text-muted-foreground'>Signed in as</p><p className='font-medium'>{identity.data.email}</p><Badge className='mt-2' variant={identity.data.role==='owner'?'default':'secondary'}>{identity.data.role}</Badge></div><p className='text-sm text-muted-foreground'>Role and membership changes are disabled in this dashboard because the staging Worker currently exposes a read-only allowlist for team administration.</p></>}
  </CardContent></Card>
  <div className='flex gap-2 rounded-lg border p-3 text-xs text-muted-foreground'><ShieldCheck className='size-4 shrink-0 text-emerald-500'/>Cloudflare Access remains the outer authentication layer. Add or revoke team members through the reviewed access-management process, not this staging UI.</div>
 </div>
}
