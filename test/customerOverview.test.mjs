import { test } from 'node:test';
import assert from 'node:assert/strict';
import { customerOverview } from '../src/utils/customerOverview.ts';
const now = Date.parse('2026-09-11T00:00:00Z');
const appointment = (id, changes={}) => ({id,customerId:1,date:'2026-09-12',time:'14:00',status:'pending',...changes});
test('customer overview counts only future open bookings and real linked follow-ups', () => {
  const overview = customerOverview([appointment(1),appointment(2,{status:'Completed'}),appointment(3,{status:'cancelled'}),
    appointment(4,{date:'2026-09-01'}),appointment(5,{previousAppointmentId:1,status:'Confirmed'}),
    appointment(6,{customerId:2}),appointment(7,{time:'bad'}),appointment(8,{status:'no-show'})],1,now);
  assert.deepEqual(overview.upcoming.map(a=>a.id),[1,5]);
  assert.deepEqual(overview.completed.map(a=>a.id),[2]);
  assert.deepEqual(overview.followups.map(a=>a.id),[5]);
  assert.equal(overview.recent.length,7);
  assert.deepEqual(customerOverview([],1,now).upcoming,[]);
});
