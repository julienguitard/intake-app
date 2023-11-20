import React, {useReducer,FC} from 'react';
import ReactDOM from 'react-dom/client';
//import './App.css';
import {GenericButton, DateHourValidTable, PageContainer} from './Components';
import {ContainerProps,AppProps} from './Props';
import {initialArg, reducer,mapStateToProps} from './Handlers';
import {appPropsTemplate} from './Props';
import ErrorBoundary from './ErrorBoundary';
//import { on } from 'events';

const App:any=()=>{

  console.log(Date.now());
  const intakes =  fetch('/data/intakes.json').then((response) => response.json());
  //states

  console.log('initialArg',initialArg);
  const [state, dispatch] = useReducer(reducer, initialArg);
  console.log('appPropsTemplate',appPropsTemplate);
  console.log('state',state,dispatch);

  //props
  const appProps:AppProps = mapStateToProps(appPropsTemplate,state, dispatch);
 
  //return 
  //  <div>
  //    <ErrorBoundary>
  //   {appProps.containers.map((x:ContainerProps)=><PageContainer {...x}/>)}
  //  </ErrorBoundary>
  //  </div>
  ;
  return   <div>{ appProps.containers.map((x:ContainerProps)=><PageContainer {...x}/>)} </div>
  ;

  
}

export default App;
