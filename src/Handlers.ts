import {DateHourValidProps, Intake,IntakeHistory} from './Model';
import {Payload,Action} from './Action';
import {AppState} from './State';
import {ContainerProps,AppProps} from './Props';

import {builder,intakeHistory} from './Constants';
import React from 'react';
import { isBreakStatement } from 'typescript';

const initialArg:AppState = {
    database:intakeHistory,
    containers:{
        dataContainer:{'status':'ready','data':[]},
        submitContainer:{'status':'ready','data':[]},
        checkContainer:{'status':'ready','data':[]},
        nextContainer:{'status':'ready','data':[]},
        resetContainer:{'status':'ready','data':[]}
    }
}

function reducer(state:AppState,action:Action):AppState{
    console.log('state from reducer',state);
    console.log('action from reducer',action);
    const nextState:AppState = {...state};
    switch(action.id){
        case 'dataContainer':
            switch(action.type){
                case 'click' : 
                    nextState.containers.dataContainer.status='read';
                    nextState.containers.dataContainer.data = builder.enrich(nextState.database).toString();
                    break;
                default : 
                    console.error('Never type');
            }
            break;
        case 'submitContainer':
            switch(action.type){
                case 'click' : 
                    nextState.containers.submitContainer.status='open';
                    break;
                case 'submit' : 
                    nextState.containers.submitContainer.status='ready';
                    nextState.containers.checkContainer.status='ready';
                    nextState.database = builder.enrich(new IntakeHistory(nextState.database.intakes.concat([new Intake(action.payload)])));
                    nextState.database.sort();
                    nextState.containers.dataContainer.data = builder.enrich(nextState.database).toString();
                    nextState.containers.checkContainer.data = [];
                    nextState.containers.nextContainer.data = [builder.getNextValid(nextState.database).toString() as DateHourValidProps];
                    break;
                default : 
                    console.error('Never type');
            }
            break;
        case 'checkContainer':
            switch(action.type){
                case 'click' : 
                    nextState.containers.checkContainer.status='open';
                    break;
                
                case 'submit' : 
                    nextState.containers.checkContainer.status='openRead';
                    nextState.containers.checkContainer.data = builder.concatEnrichRecent(nextState.database,new Intake(action.payload)).toString();
                    break;
                default : 
                    console.error('Never type');
                
            }      
            break;
        case 'nextContainer':
            switch(action.type){
                case 'click' : 
                    nextState.containers.nextContainer.status='read';
                    nextState.containers.nextContainer.data=[builder.getNextValid(nextState.database).toString() as DateHourValidProps];
                    break;
                default : 
                    console.error('Never type');
                
            }
            break;
        case 'resetContainer':
            switch(action.type){
                case 'click' : 
                    nextState.containers.dataContainer = {'status':'ready','data':[]};
                    nextState.containers.submitContainer = {'status':'ready','data':[]};
                    nextState.containers.checkContainer = {'status':'ready','data':[]};
                    nextState.containers.nextContainer = {'status':'ready','data':[]};
                    nextState.containers.resetContainer = {'status':'ready','data':[]};
                    break;
                default : 
                    console.error('Never type');
                
            }
            break;
        default:
            console.error('Never container');
    }
    return nextState;
}

function mapStateToProps(propsTemplate:AppProps,state:AppState,dispatch:React.Dispatch<Action>):AppProps{
    const appProps:AppProps = {...propsTemplate};
    const tmp0:ContainerProps[] = appProps.containers;

    tmp0[0].status = state.containers.dataContainer.status;
    tmp0[1].status = state.containers.submitContainer.status;
    tmp0[2].status = state.containers.checkContainer.status;
    tmp0[3].status = state.containers.nextContainer.status;
    tmp0[4].status = state.containers.resetContainer.status;

    tmp0[0].table.data = state.containers.dataContainer.data.map((x:DateHourValidProps,i:number)=>({...x,id:i.toString()}));
    tmp0[2].table.data = state.containers.checkContainer.data.map((x:DateHourValidProps,i:number)=>({...x,id:i.toString()}));
    tmp0[3].table.data = state.containers.nextContainer.data.map((x:DateHourValidProps,i:number)=>({...x,id:i.toString()}));

    const foo0:((x:ContainerProps)=>(()=>ReturnType<React.Dispatch<Action>>)) = x=>(()=>dispatch({id:x.id,type:'click'}));
    const foo1:((e:React.FormEvent<HTMLFormElement>)=>Payload) = (e=>{ e.preventDefault();return {date:e.target[0].value,hour:e.target[1].value}});
    const foo2:((x:ContainerProps)=>((e:React.FormEvent<HTMLFormElement>)=>ReturnType<React.Dispatch<Action>>)) = x=>(e=>dispatch({id:x.id,type:'submit',payload:foo1(e)}));
    const foo3:((x:ContainerProps)=>ContainerProps) = x=>({...x,button:{...x.button,clickHandler:foo0(x)}});
    const foo4:((x:ContainerProps)=>ContainerProps) = x=>({...x,form:{...x.form,submitHandler:foo2(x)}});
    const foo5:((x:ContainerProps)=>ContainerProps) = x=>('button' in x)?foo3(x):x;
    const foo6:((x:ContainerProps)=>ContainerProps) = x=>('form' in x)?foo4(x):x;

    const tmp1:ContainerProps[] = tmp0.map(foo5);
    const tmp2:ContainerProps[] = tmp1.map(foo6);
    appProps.containers = tmp2;
    return appProps;
}

export {initialArg,reducer,mapStateToProps};
