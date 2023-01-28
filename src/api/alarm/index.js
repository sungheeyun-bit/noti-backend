import Router from 'koa-router';
import * as alarmCtrl from './alarm.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const alarm = new Router();

alarm.post(
  '/addToAlarm',
  checkLoggedIn,
  alarmCtrl.getUserInfo,
  alarmCtrl.addToAlarm,
);
alarm.get(
  '/listAlarms',
  checkLoggedIn,
  alarmCtrl.getUserInfo,
  alarmCtrl.listAlarms,
);
alarm.patch(
  '/changeFromAlarm',
  checkLoggedIn,
  alarmCtrl.getUserInfo,
  alarmCtrl.changeFromAlarm,
);

alarm.delete('/removeFromAlarm/:id', checkLoggedIn, alarmCtrl.removeFromAlarm);

export default alarm;
