//# These are thoughts about algebra/typing of states that are not yet represented as a class in LC_tree https://app.diagrams.net/#G1ZSM6vc8c3kXj2dJsgMwiFueUG0O8tba9
//## To discuss...
//## ...when ok to be transformed into class-diagrammiofied and/or committed as a doc/conception file.

//# What should be the type of states and function upon them to manage variation in experiences?
//## As dense and 'finite' as possible...
//## ...but in practice volatile finite states...
//## ...capturing the variation that is then dispatched by events and their payloads to existing/created experiences

//#  That said what desirable properties should have such objects and functions, regarding factorization among other?
//## Internal factorization finite state by finite state
//## Factorization by grouping states and possibly events and possibly experiences in indepdant groupsgroups

//# Evnt and experience are supposed to be given and described here in LC_tree https://app.diagrams.net/#G1ZSM6vc8c3kXj2dJsgMwiFueUG0O8tba9 or its version here https://app.diagrams.net/#G1ana2coSh_YisA12dvbzFmZ_g7xAe_l5k
//## For explanations at the end of this snippet we assume events and experiences can be subdivided in 3 subtypes
//## Evnt name to avoid collision with Evnt DOM class
interface Evnt0 {};
interface Evnt1 {};
interface Evnt2 {};
type Evnt = Evnt0|Evnt1|Evnt2;
interface Experience0 {};
interface Experience1 {};
interface Experience2 {};
type Experience = Experience0| Experience1|Experience2;

//# We suggest states must be ID-less value objects as an an union cartesian products of a string and a given number of numbers by tag
//## Ideadlly we would have a finite set of states, that were mere strings
type FiniteState0 = 'state0'|'state1';
type FiniteState1 = 'state2'|'state3';
type FiniteState2 = 'state4'|'state5';
type FiniteState = FiniteState0|FiniteState1|FiniteState2;
//## But in practice we need some more flexibility like a counter (add to cart) or a multiplier like the proba in Easter eggs campaigns
interface State  {state:FiniteState,params:number[]}
//### Ideally the size of the params is fixed for a given state, in this snippet I suggested in the constructors belows
class State0 implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state0',this.params=[]}
}
class VolatileState1 implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state1',this.params=[0]}
}
class State2 implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state2',this.params=[]}
}
class VolatileState3 implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state3',this.params=[0]}
}
class MoreVolatileState4 implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state4',this.params=[0,0]}
}
class  MostVolatileState5  implements State {
    state:FiniteState;params:number[];
    constructor(){this.state='state5',this.params=[0,0,0]}
}

//# Function-wise we have two main objects, not sure about the dispatch name
type Reduce = (e:Evnt,s:State)=>{state:State,experiences:Experience[],events:Evnt[]};
type Dispatch =(s:State,x:Experience[])=>Promise<Evnt>;
interface AbstractEngine {
    reduce:Reduce;
    dispatch:Dispatch;
}

//# Internal factorization
//## The type Reduce and Disptach are pretty general...
//## ...and we can restrict to union of simpler functions like a transition matrix joined with very simple reducer bewteen numbers
//### This is a typical finite automaton reduce
type TransitionMatrix = (e:Evnt,s:FiniteState)=>{state:FiniteState,experiences:Experience[],events:Evnt[]};
//### This a simple numeric reducer within a given finite state like +1 or +amount or an initialization
type SimpleReduce = (e:Evnt,p:number[])=>number[];
type SimpleReduceMatrix = (s0:FiniteState,s1:FiniteState)=>SimpleReduce;
//### This a just saying which numeric reducer for given transition from on states to the others
type FactorizedReduce = [TransitionMatrix,SimpleReduceMatrix];
//### (Not sure of the one below) Here the assumption is that the numeric part of a volatile state does not matter for the dispacthing of an event
type SimpleDispatch =(s:FiniteState,x:Experience[])=>Promise<Evnt>;
//## Nicer it looks, just using the bricks below
class Engine implements AbstractEngine {
    reduce:Reduce;
    dispatch:Dispatch;
    constructor(reduceCallback:FactorizedReduce,dispatchCallback:SimpleDispatch){
        this.reduce =(e,s)=>{
            const t:{state:FiniteState,experiences:Experience[],events:Evnt[]} = reduceCallback[0](e,s.state);
            const r:number[] = reduceCallback[1](s.state,t.state)(e,s.params);
            return {state:{state:t.state,params:r},experiences:t.experiences,events:t.events}
        }
        this.dispatch =(s,x)=>{
            return dispatchCallback(s.state,x);
        }   
    } 
} 

//# Factorization by grouping
//## In this case we can group states, events and experiences in 3 groups

type TransitionMatrix0 = (e:Evnt0,s:FiniteState0)=>{state:FiniteState0,experiences:Experience0[],events:Evnt0[]};
type SimpleReduce0 =(e:Evnt0,p:number[])=>number[]; 
type SimpleReduceMatrix0 = (s0:FiniteState0,s1:FiniteState0)=>SimpleReduce0;
type FactorizedReduce0 =[TransitionMatrix0,SimpleReduceMatrix0];;
type SimpleDispatch0 =(s:FiniteState0,x:Experience0[])=>Promise<Evnt0>;

type TransitionMatrix1 = (e:Evnt1,s:FiniteState1)=>{state:FiniteState1,experiences:Experience1[],events:Evnt1[]};
type SimpleReduce1 =(e:Evnt1,p:number[])=>number[]; 
type SimpleReduceMatrix1 = (s0:FiniteState1,s1:FiniteState1)=>SimpleReduce1;
type FactorizedReduce1 =[TransitionMatrix1,SimpleReduceMatrix1];;
type SimpleDispatch1 =(s:FiniteState1,x:Experience1[])=>Promise<Evnt1>;

type TransitionMatrix2 = (e:Evnt2,s:FiniteState2)=>{state:FiniteState2,experiences:Experience2[],events:Evnt2[]};
type SimpleReduce2 =(e:Evnt2,p:number[])=>number[]; 
type SimpleReduceMatrix2 = (s0:FiniteState2,s1:FiniteState2)=>SimpleReduce2;
type FactorizedReduce2 =[TransitionMatrix2,SimpleReduceMatrix2];;
type SimpleDispatch2 =(s:FiniteState2,x:Experience2[])=>Promise<Evnt2>;

//## So we have arrays of independant callbacks to build the engine above
type FactorizedReduceArray = [FactorizedReduce0,FactorizedReduce1,FactorizedReduce2];
type SimpleDispatchArray = [SimpleDispatch0,SimpleDispatch1,SimpleDispatch2];

///### Incomplete...
class FactorizedByGroupingEngine extends Engine {
    constructor(reduceCallback:FactorizedReduce,dispatchCallbackArray:SimpleDispatchArray){
        const dispatchCallback:SimpleDispatch = (s:FiniteState,x:Experience[])=>{
            const foo:FiniteState[][] = [['state0' as FiniteState0,'state1' as FiniteState0],['state2' as FiniteState1,'state3' as FiniteState1],['state4' as FiniteState2,'state5'as as FiniteState2]];
            const i:number = foo.findIndex(y=>y.includes(s));
            return dispatchCallbackArray[i](s,x);
        }
        super(reduceCallback,dispatchCallback)
    } 
} 


