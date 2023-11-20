import React, {FC} from 'react';
import './Components.css';
import {ButtonProps,FormProps,RowProps,TableProps,ContainerProps} from './Props';

const  GenericButton: FC<ButtonProps> = (props)=>{
  return <div><button onClick={props.clickHandler} className='button' id={props.id}> {props.text}</button></div>;  
}

const DateHourForm:FC<FormProps> = (props)=>{
    const dateId = `date-${props.id}`;
    const hourId = `hour-${props.id}`;

    return <form className='date-hour-form' id={props.id} onSubmit={props.submitHandler}>
    <label htmlFor="date">Date:</label>
    <input type="text" id={dateId} name="date"></input>
    <label htmlFor="hour">Hour:</label>
    <input type="text" id={hourId} name="hour" ></input>
    <input type="submit" value="Submit"></input>
    </form>  ;
}

const DateHourValidRow:FC<RowProps> = (props)=>{
    if (props.valid){
        return <tr id={props.id}><td>{props.date}</td><td>{props.hour}</td><td className='ok'>{props.valid.toString()}</td></tr>;  
    }
    else {
        return <tr id={props.id}><td>{props.date}</td><td>{props.hour}</td><td className='nok'>{props.valid.toString()}</td></tr>;       
    }
}

const DateHourValidTable:FC<TableProps>=(props)=>{
    const rows = props.data.map((x,i)=> <DateHourValidRow id={`${props.id}-${i}`} date={x.date} hour={x.hour} valid={x.valid}/> );
    return <div className="history-table" id={props.id}>
        <table>
            <thead>
            <tr><th>Date</th><th>Hour</th><th>Valid</th></tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    </div>;
 }

const PageContainer:FC<ContainerProps>=(props)=>{

    if (props.status==='ready'){
        return (<GenericButton {...props.button}/>);
    }
    else if (props.status==='open'){
        return (<DateHourForm {...props.form}/>);
    }
    else if (props.status==='read'){
        return (<DateHourValidTable {...props.table}/>);
    }
    else if (props.status==='openRead'){
        return (<div><DateHourForm {...props.form}/><DateHourValidTable {...props.table}/></div>);
    }
    else {
        return (<GenericButton {...props.button}/>);
    }
}

export {GenericButton, DateHourForm, DateHourValidRow, DateHourValidTable, PageContainer};