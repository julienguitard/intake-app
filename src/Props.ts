import {DateHourValidProps} from './Model';
import {ContainerId,Status} from './State';
import {Action} from './Action'; 
import React from 'react';

interface ButtonProps{
    id:string;
    text:string;
    clickHandler?:()=>ReturnType<React.Dispatch<Action>>;
}

interface FormProps{
    id:string;
    submitHandler?:(event:React.FormEvent<HTMLFormElement>)=>ReturnType<React.Dispatch<Action>>;
}

interface RowProps extends DateHourValidProps{
    id:string
}

interface TableProps{
    id:string;
    data:RowProps[];
}

interface ContainerProps{
    id:ContainerId;
    status:Status;
    button : ButtonProps;
    form?:FormProps;
    table?: TableProps;   
}

interface AppProps{
    id:string;
    containers:ContainerProps[];
}

const appPropsTemplate:AppProps = {
    id:'main',
    containers:[
        {id:'dataContainer',
        status:'ready',
        button:{
                id:'buttonDataContainer',
                text:'View data'
            },
        table:{
                id:'tableDataContainer',
                data:[]
            }
        },
        {id:'submitContainer',
        status:'ready',
        button:{
                id:'buttonSubmitContainer',
                text:'Submit intake'
            },
        form:{
                id:'formSubmitContainer'
            }
        },
        {id:'checkContainer',
        status:'ready',
            button:{
                id:'buttonCheckContainer',
                text:'Check Intake'
            },
        form:{
                id:'formCheckContainer'
            },
        table:{
                id:'tableCheckContainer',
                data:[]
            }
        },
        {id:'nextContainer',
        status:'ready',
        button:{
                id:'buttonNextContainer',
                text:'View next'
            },
        table:{
                id:'tableNextContainer',
                data:[]
            }
        },
        {id:'resetContainer',
        status:'ready',
        button:{
                id:'buttonResetContainer',
                text:'Reset'
            }
        }
    ]
}

export type {ContainerId,ButtonProps,FormProps,RowProps,TableProps,ContainerProps,AppProps};
export {appPropsTemplate};