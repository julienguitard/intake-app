import {DateHour,DateHourConverter} from './Model';
import {IntakeRules,IntakeHistory,Builder} from './Model';

const rules = new IntakeRules([{duration:172800, number:1},{duration:604800, number:3}]);
const builder = new Builder(rules);

const converter = new DateHourConverter();
const intakes:DateHour[] = [{"date":"01/01/2023",
"hour":"21:00:00"},
{"date":"07/01/2023",
"hour":"09:00:00"},
{"date":"09/01/2023",
"hour":"10:00:00"},
{"date":"15/01/2023",
"hour":"10:20:00"},
{"date":"22/01/2023",
"hour":"21:35:00"},
{"date":"29/01/2023",
"hour":"13:30:00"},
{"date":"11/01/2023",
"hour":"23:55:00"},
{"date":"18/01/2023",
"hour":"08:55:00"}];
const intakeHistory= new IntakeHistory(intakes);

export {rules,builder,intakes,intakeHistory};