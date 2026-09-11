import React from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import Dashboard from './src/features/customer/CustomerDashboard';
import Archives from './src/features/admin/ArchivesPage';
import {NotificationContext} from './src/hooks/useNotifications';
import {STORAGE_KEY} from './src/utils/auth';
import './src/index.css';
const originalGet = Storage.prototype.getItem;
Storage.prototype.getItem = function(key) { return key === STORAGE_KEY ? JSON.stringify({id:1,name:'Isabella Santos',role:'customer'}) : originalGet.call(this,key); };
const date = new Date(Date.now()+3*86400000).toISOString().slice(0,10);
const appointments = [
 {id:1,customerId:1,serviceName:'Signature facial',date,time:'2:00 PM',area:'Main branch',status:'confirmed',employeeName:'Aisha',createdAt:'2026-09-11'},
 {id:2,customerId:1,serviceName:'Lash refresh',date,time:'4:00 PM',area:'Main branch',status:'pending',previousAppointmentId:3,createdAt:'2026-09-10'},
 {id:3,customerId:1,serviceName:'Classic lash extensions',date:'2026-08-16',time:'10:00 AM',area:'Main branch',status:'completed',createdAt:'2026-08-14'},
 {id:4,customerId:1,serviceName:'Gel manicure',date:'2026-07-01',time:'10:00 AM',area:'Main branch',status:'completed',createdAt:'2026-06-28'}];
let archives = [{id:1,entity:'services',name:'Hydrating facial',detail:'Skin care',deletedAt:'2026-09-11T04:00:00Z',deletedByName:'Admin'},
 {id:2,entity:'users',name:'Maria Santos',detail:'customer',deletedAt:'2026-09-10T04:00:00Z',deletedByName:'Admin'},
 {id:3,entity:'appointments',name:'Classic lash extensions',detail:'Isabella Santos · Sep 8, 2026',deletedAt:'2026-09-09T04:00:00Z',deletedByName:'Admin'}];
window.fetch = async (url,options) => {
 if(options?.method==='POST') { const id=Number(String(url).split('/').at(-2));archives=archives.filter(a=>a.id!==id);return new Response('{}',{headers:{'Content-Type':'application/json'}}); }
 return new Response(JSON.stringify(String(url).includes('/archives')?archives:appointments),{headers:{'Content-Type':'application/json'}});
};
const notifications=[{id:1,appointmentId:1,kind:'booking',title:'Your appointment is confirmed',message:'Your signature facial is booked at the Main branch. We look forward to seeing you.',createdAt:date,readAt:null},{id:2,appointmentId:2,kind:'next-session',title:'Next session scheduled',message:'Your lash refresh is linked to your previous visit.',createdAt:date,readAt:null}];
createRoot(document.getElementById('root')!).render(<MemoryRouter><NotificationContext.Provider value={{notifications,unreadCount:2,loading:false,error:'',refresh:async()=>{},markRead:async()=>{}}}>{location.search.includes('archives')?<Archives/>:<Dashboard/>}</NotificationContext.Provider></MemoryRouter>);
