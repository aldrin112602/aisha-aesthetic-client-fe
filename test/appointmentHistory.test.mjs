import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appointmentTime, customerHistory } from '../src/utils/appointmentHistory.ts';

const now = Date.parse('2026-09-10T06:00:00Z');
const booking = (id, changes = {}) => ({ id, customerId: 1, date: '2026-09-10', time: '1:00 PM', status: 'pending', ...changes });

test('history contains only the customer’s past or final-status records, newest first', () => {
  const rows = [booking(1), booking(2, { time: '3:00 PM' }), booking(3, { customerId: 2 }),
    booking(4, { status: 'Completed', time: '2:00 PM' }), booking(5, { status: 'cancelled', date: '2026-09-12' }),
    booking(6, { status: 'no-show', date: '2026-09-11' })];
  assert.deepEqual(customerHistory(rows, 1, now).map(row => row.id), [5, 6, 4, 1]);
  assert.equal(customerHistory(rows, 1, now).at(-1).status, 'pending');
  assert.deepEqual(customerHistory([], 1, now), []);
});

test('dates use Philippine time and invalid schedules do not become past appointments', () => {
  assert.equal(appointmentTime('2026-09-10', '2:00 PM'), now);
  assert.equal(appointmentTime('2026-09-10', '14:00'), now);
  assert.equal(appointmentTime('2026-09-10', '12:00 AM'), Date.parse('2026-09-09T16:00:00Z'));
  assert.ok(Number.isNaN(appointmentTime('2026-02-30', '9:00 AM')));
  assert.deepEqual(customerHistory([booking(1, { time: '' })], 1, now), []);
  assert.equal(customerHistory([booking(1, { time: '', status: 'completed' })], 1, now).length, 1);
});
