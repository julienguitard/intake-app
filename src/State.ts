import {DateHourValidProps,IntakeHistory} from './Model';

type ContainerId = 'dataContainer'|'submitContainer'|'checkContainer'|'nextContainer'|'resetContainer';
type Status = 'ready'|'read'|'open'|'openRead';
type DatabaseState = IntakeHistory;

interface StatusDataState {
    status:Status;
    data:DateHourValidProps[];
}

type ContainerState = Record<ContainerId,StatusDataState>;

interface AppState {
    database:DatabaseState;
    containers:ContainerState;
}

export type {ContainerId,Status,DatabaseState,ContainerState,AppState}; 