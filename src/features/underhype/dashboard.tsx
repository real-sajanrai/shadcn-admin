import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Activity, ArrowDownToLine, ArrowUpRight, BriefcaseBusiness, CalendarClock, CircleDot, Mail, MessageSquare, RefreshCw, Users } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { adminApi } from './api'
import { downloadCsv, formatDate, initials, statusTitle } from './format'
import { useAdminIdentity, useAdminOverview } from './use-admin'

export function UnderhypeDashboard() {
  const identity = useAdminIdentity()
  const overview = useAdminOverview()
  const queryClient = useQueryClient()
  const [downloading, setDownloading] = useState(false)
  const data = overview.data
  const chart = useMemo(() => {
    const rows = data ? [...data.recentContacts.map(row => ({ day: row.submitted_at.slice(0, 10), contacts: 1, hiring: 0 })), ...data.recentHiring.map(row => ({ day: row.submitted_at.slice(0, 10), contacts: 0, hiring: 1 }))] : []
    const grouped = new Map<string, { day: string; contacts: number; hiring: number }>()
    rows.forEach(row => { const current = grouped.get(row.day) || { day: row.day, contacts: 0, hiring: 0 }; current.contacts += row.contacts; current.hiring += row.hiring; grouped.set(row.day, current) })
    return [...grouped.values()].sort((a, b) => a.day.localeCompare(b.day))
  }, [data])
  async function exportAll() {
    setDownloading(true)
    try {
      const result = await adminApi.export('all')
      downloadCsv(`underhype-submissions-${new Date().toISOString().slice(0, 10)}.csv`, [...result.contacts.map(row => ({ type: 'Contact', ...row })), ...result.hiring.map(row => ({ type: 'Hiring', ...row }))])
      toast.success('Export downloaded')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Export failed') }
    finally { setDownloading(false) }
  }
  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ['underhype-admin'] })
    toast.success('Dashboard refreshed')
  }
  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'><Badge className='border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300'>STAGING</Badge><span className='text-xs text-muted-foreground'>Underhype.digital / Workspace</span></div>
          <h1 className='text-3xl font-semibold tracking-tight'>Your studio, in focus.</h1>
          <p className='text-sm text-muted-foreground'>A live view of contact enquiries and new talent.</p>
          {identity.data && <p className='text-xs text-muted-foreground'>Signed in as {identity.data.email} · {identity.data.role}</p>}
          {identity.isError && <p className='text-xs text-destructive'>Access verification failed: {identity.error.message}</p>}
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={refresh}><RefreshCw className='mr-2 size-4'/>Refresh</Button>
          <Button onClick={exportAll} disabled={downloading}><ArrowDownToLine className='mr-2 size-4'/>{downloading ? 'Exporting…' : 'Export all data'}</Button>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Metric title='Contact enquiries' value={data?.stats.contacts} detail={`${data?.stats.newContacts ?? '—'} new · awaiting review`} icon={MessageSquare} loading={overview.isLoading}/>
        <Metric title='Hiring applications' value={data?.stats.hiring} detail={`${data?.stats.newHiring ?? '—'} new · awaiting review`} icon={BriefcaseBusiness} loading={overview.isLoading}/>
        <Metric title='Total submissions' value={data?.stats.contacts != null && data.stats.hiring != null ? data.stats.contacts + data.stats.hiring : undefined} detail='Across both website forms' icon={Users} loading={overview.isLoading}/>
        <Metric title='Latest activity' value={data ? data.recentContacts.length + data.recentHiring.length : undefined} detail='Recent records loaded' icon={Activity} loading={overview.isLoading}/>
      </div>
      <div className='grid gap-4 xl:grid-cols-7'>
        <Card className='xl:col-span-4'>
          <CardHeader><CardTitle>Submission activity</CardTitle><CardDescription>Recent records from the staging database. This preview is limited to the latest six in each category.</CardDescription></CardHeader>
          <CardContent className='h-[300px]'>
            {overview.isLoading ? <Skeleton className='h-full w-full'/> : chart.length ? <ResponsiveContainer width='100%' height='100%'><AreaChart data={chart}><defs><linearGradient id='contactFill' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#2563eb' stopOpacity={.24}/><stop offset='100%' stopColor='#2563eb' stopOpacity={0}/></linearGradient><linearGradient id='hiringFill' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#7c3aed' stopOpacity={.2}/><stop offset='100%' stopColor='#7c3aed' stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray='3 3' vertical={false}/><XAxis dataKey='day' tickLine={false} axisLine={false} fontSize={11}/><YAxis allowDecimals={false} width={30} tickLine={false} axisLine={false} fontSize={11}/><Tooltip/><Area type='monotone' dataKey='contacts' name='Enquiries' stroke='#2563eb' fill='url(#contactFill)' strokeWidth={2}/><Area type='monotone' dataKey='hiring' name='Applications' stroke='#7c3aed' fill='url(#hiringFill)' strokeWidth={2}/></AreaChart></ResponsiveContainer> : <Empty label='No recent submissions yet'/>}
          </CardContent>
        </Card>
        <Card className='xl:col-span-3'>
          <CardHeader><CardTitle>Quick access</CardTitle><CardDescription>Jump to the work that needs attention.</CardDescription></CardHeader>
          <CardContent className='space-y-3'>
            <QuickLink to='/contacts' icon={Mail} title='Manage enquiries' detail={`${data?.stats.newContacts ?? 0} new messages`}/>
            <QuickLink to='/hiring' icon={BriefcaseBusiness} title='Review candidates' detail={`${data?.stats.newHiring ?? 0} new applications`}/>
            <QuickLink to='/analytics' icon={Activity} title='Performance analytics' detail='Explore submissions and trends'/>
            <div className='rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground'><ShieldText/> Staging data is isolated from the live website and production database.</div>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 xl:grid-cols-2'>
        <RecentPanel title='Latest enquiries' description='Most recent contact-form submissions' loading={overview.isLoading} empty='No enquiries received yet.' rows={(data?.recentContacts || []).map(row => ({ id: row.id, name: row.name, detail: row.email, meta: row.services || 'General enquiry', date: row.submitted_at, status: row.status }))} to='/contacts'/>
        <RecentPanel title='Latest applications' description='People interested in joining the studio' loading={overview.isLoading} empty='No applications received yet.' rows={(data?.recentHiring || []).map(row => ({ id: row.id, name: row.full_name, detail: row.email, meta: row.role || 'Open application', date: row.submitted_at, status: row.status }))} to='/hiring'/>
      </div>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'><CircleDot className='size-3 text-emerald-500'/> Connected through the staging Worker · Cloudflare D1 preview database · Private R2 preview storage</div>
    </div>
  )
}
function Metric({ title, value, detail, icon: Icon, loading }: { title: string; value?: number; detail: string; icon: React.ElementType; loading: boolean }) {
 return <Card><CardContent className='p-5'><div className='flex items-center justify-between'><p className='text-sm text-muted-foreground'>{title}</p><span className='rounded-lg bg-blue-500/10 p-2 text-blue-600'><Icon className='size-4'/></span></div>{loading ? <Skeleton className='mt-3 h-8 w-20'/> : <p className='mt-2 text-3xl font-semibold tabular-nums'>{value ?? '—'}</p>}<p className='mt-1 text-xs text-muted-foreground'>{detail}</p></CardContent></Card>
}
function QuickLink({ to, icon: Icon, title, detail }: { to: '/contacts' | '/hiring' | '/analytics'; icon: React.ElementType; title: string; detail: string }) {
 return <Link to={to} className='flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent'><span className='rounded-lg bg-muted p-2'><Icon className='size-4'/></span><span className='min-w-0 flex-1'><span className='block text-sm font-medium'>{title}</span><span className='block text-xs text-muted-foreground'>{detail}</span></span><ArrowUpRight className='size-4 text-muted-foreground'/></Link>
}
function RecentPanel({ title, description, loading, empty, rows, to }: { title:string; description:string; loading:boolean; empty:string; rows:{id:string;name:string;detail:string;meta:string;date:string;status?:string|null}[];to:'/contacts'|'/hiring' }) {
 return <Card><CardHeader className='flex flex-row items-start justify-between gap-3'><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div><Button asChild size='sm' variant='outline'><Link to={to}>View all</Link></Button></CardHeader><CardContent className='space-y-4'>{loading ? Array.from({length:3},(_,i)=><Skeleton key={i} className='h-12 w-full'/>):rows.length?rows.slice(0,5).map(row=><div key={row.id} className='flex items-center gap-3'><div className='grid size-9 shrink-0 place-items-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-700 dark:text-blue-300'>{initials(row.name)}</div><div className='min-w-0 flex-1'><p className='truncate text-sm font-medium'>{row.name}</p><p className='truncate text-xs text-muted-foreground'>{row.detail} · {row.meta}</p></div><div className='hidden text-right sm:block'><Badge variant='secondary'>{statusTitle(row.status)}</Badge><p className='mt-1 text-[10px] text-muted-foreground'>{formatDate(row.date)}</p></div></div>):<Empty label={empty}/>}</CardContent></Card>
}
function Empty({label}:{label:string}) { return <div className='grid h-full min-h-36 place-items-center text-center text-sm text-muted-foreground'>{label}</div> }
function ShieldText(){return <><ShieldCheck className='mr-1 inline size-3.5'/>Protected preview environment.</>}
