import {DateHour} from './Model';
import {ContainerId} from './State';

type ActionType = 'click'|'submit';
type Payload = DateHour;

interface Action {
    id:ContainerId;
    type:ActionType;
    payload?:Payload;
}

export type {ActionType,Payload,Action};