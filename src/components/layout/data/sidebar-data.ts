import { Archive, BriefcaseBusiness, ChartNoAxesCombined, LayoutDashboard, MessageSquare, Settings, ShieldCheck, Users } from 'lucide-react'
import { type SidebarData } from '../types'
export const sidebarData: SidebarData = {
 user:{name:'Underhype Admin',email:'underhype.digital@gmail.com',avatar:'/avatars/shadcn.jpg'},
 teams:[{name:'Underhype.digital',logo:ShieldCheck,plan:'Creative agency workspace'}],
 navGroups:[
  {title:'WORKSPACE',items:[
   {title:'Overview',url:'/',icon:LayoutDashboard},
   {title:'Enquiries',url:'/contacts',icon:MessageSquare},
   {title:'Hiring',url:'/hiring',icon:BriefcaseBusiness},
   {title:'Archived',url:'/archived',icon:Archive},
  ]},
  {title:'INSIGHTS & ACCESS',items:[
   {title:'Analytics',url:'/analytics',icon:ChartNoAxesCombined},
   {title:'Team access',url:'/team',icon:Users},
   {title:'Settings',icon:Settings,items:[{title:'Appearance',url:'/settings/appearance'},{title:'Display',url:'/settings/display'}]},
  ]},
 ],
}
