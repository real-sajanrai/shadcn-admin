import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UnderhypeDashboard } from '@/features/underhype/dashboard'
export function Dashboard() {
  return <><Header><div className='me-auto hidden items-center gap-2 text-sm font-semibold sm:flex'><span className='grid size-7 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white'>UH</span>underhype.digital</div><Search/><ThemeSwitch/><ConfigDrawer/><ProfileDropdown/></Header><Main><UnderhypeDashboard/></Main></>
}
