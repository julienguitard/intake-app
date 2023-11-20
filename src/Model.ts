interface StringRecord{
    [index : string]: string;
}

interface Stringable {
    toString:()=>string;
}

interface StringableRecord{
    [index : string]: Stringable;
}

type Many<T> = T | T[] | Record<string,T>;

interface DateHour {
    date:string;
    hour:string;
}

interface DateHourValid extends DateHour{
    valid:boolean;
}

interface DateHourValidProps extends DateHour{
    valid:string;
}

interface DateHourValidRk extends DateHourValid{
    rk:number;
}

interface DateTime {
    datetime:Date;
    time:number;
}

interface Converter{
    convertToString:(data:DateHour|DateHourValid)=>(DateHour|DateHourValidProps);
    convertFromString:(data:DateHour|DateHourValidProps)=>(DateHour|DateHourValid);
    convertToDateTime:(data:DateHour)=>DateTime;
    convertFromDate:(data:Date)=>DateHour;
}

class DateHourConverter implements Converter{

    constructor(){
    }

    convertToString(data:DateHour|DateHourValid):DateHour|DateHourValidProps{
        if('valid' in data){
            return {date:data.date,hour:data.hour,valid:data.valid.toString()} as DateHourValidProps; 
        }
        else {
            return {...data} as DateHour;
        }     
    }

    convertFromString(data:DateHour|DateHourValidProps):(DateHour|DateHourValid){
        if('valid' in data){
            return {date:data.date,hour:data.hour,valid:data.valid==='true'} as DateHourValid ; 
        }
        else {
            return {...data} as DateHour;
        }     
    }

    convertToDateTime(data:DateHour):DateTime{
        const d = new Date(`${data.date.split('/').reverse().join('-')}T${data.hour}`);
        return {datetime:d,time:Date.parse(d.toString())/1000}; 
    }

    convertFromDate(data: Date):DateHour{
        const year:string  = data.getFullYear().toString().padStart(4,'0');
        const month:string  = (data.getMonth()+1).toString().padStart(2,'0');
        const date_:string  = data.getDate().toString().padStart(2,'0');
        const hours :string = data.getHours().toString().padStart(2,'0');
        const minutes:string  = data.getMinutes().toString().padStart(2,'0');
        const seconds:string  = data.getSeconds().toString().padStart(2,'0');
        const date:string  =[date_,month,year].join('/');
        const hour:string  = [hours,minutes,seconds].join(':');

        return {date:date,hour:hour};

    }
}

class Intake implements DateHour, DateTime {
    date:string;
    hour:string;
    datetime:Date=new Date();
    time:number=Date.now();
    converter:DateHourConverter= new DateHourConverter();

    constructor(dateHour:DateHour){
        try{
            this.date = dateHour.date;
            this.hour = dateHour.hour;
            const d = this.converter.convertToDateTime(dateHour);
            this.datetime=d.datetime;
            this.time=d.time;

        }
        catch(err){
            console.error('Bad constructor input:',err,'...because:',dateHour);
        } 
    }

    toString():DateHour{
        return this.converter.convertToString({date:this.date,hour:this.hour});
    }
}

class RichIntake extends Intake implements DateHourValidRk {
    valid=false;
    rk=0;

    constructor(dateHourValidRk:DateHourValidRk){
        super(dateHourValidRk);
        this.valid = dateHourValidRk.valid;
        this.rk = dateHourValidRk.rk;
    }

    toString():DateHour|DateHourValidProps{
        return this.converter.convertToString({date:this.date,hour:this.hour,valid:this.valid});
    }
}

class IntakeHistory {
    sorted:boolean;
    intakes:Intake[];

    constructor(intakes:DateHour[]){
        this.sorted = false;
        this.intakes = intakes.map((x:DateHour)=>new Intake(x));
    }

    static compare(intake0:Intake,intake1:Intake):number{
        try{
            const tmp0:number = intake1.time - intake0.time;
            console.log(tmp0);
            return tmp0;
        }
        catch(err){
            console.error(err);
        }
    }

    sort():void{
        console.log(this.intakes);
        this.intakes.sort(IntakeHistory.compare);
        console.log(this.intakes);
        this.sorted = true;
    }

    getLatest(i:number):Intake{
        if(!this.sorted){
            this.sort();
        }
        try {
            return this.intakes[i];
        }
        catch(err) {
            console.error('Not enough intakes!');
        }
    }

    toString():DateHour[]{
        return this.intakes.map((x:Intake)=>x.toString());
    }
}

class RichIntakeHistory extends IntakeHistory {

    constructor(intakes:DateHourValidRk[]){
        super(intakes);
        this.intakes = intakes.map((x:DateHourValidRk)=>new RichIntake(x));
    }

    toString():DateHourValidProps[]{
        return this.intakes.map((x:RichIntake)=>x.toString() as DateHourValidProps);
    }
}

interface Rule{
    duration: number;
    number:number;
}

class IntakeRules {
    rules:Rule[];
    initialValue:number[]; 

    static isValid(rules:Rule[]):boolean{
        return rules.map((x:Rule)=>('duration' in x)&&('number' in x)).reduce((acc,val)=>acc&&val,true);   
    }

    static reducer(acc:number[],val:number[]):number[]{
        return acc.map((x:number,i:number)=>x+val[i]);
    }

    constructor(rules:Rule[]) {
        try {
            if(IntakeRules.isValid(rules)){
                this.rules= rules;
                this.initialValue = this.rules.map((x:Rule)=>0).concat(0);
            }
            else {
                throw('Not a rule')
            }
        }
        catch(err){
            console.error(err);
        }
    }

    checkOrder(intake0:Intake,intake1:Intake):number{
        //to encapsulate the Intakehistory
        return IntakeHistory.compare(intake0,intake1);
    };

    sortIntakes(intakes:IntakeHistory):void{
        //to encapsulate the Intakehistory
        intakes.sort();
    }

    getLatest(intakes:IntakeHistory,i:number):Intake{
        //to encapsulate the Intakehistory
        return intakes.getLatest(i);
    }

    checkOrderRules(intake0:Intake, intake1:Intake) :boolean[]{
        const dtime:number = intake1.time - intake0.time;
        const tmp0:boolean = dtime>0;
        const tmp1:boolean[] = this.rules.map(x => tmp0 && dtime<=x['duration']);
        const tmp2:boolean[] = [tmp0].concat(tmp1);
        return tmp2;
    }

    checkNumbers(x:number,i:number):boolean{
        return x<=this.rules[i]['number'];
    }

}

class Builder {
    rules : IntakeRules;
    constructor(rules:IntakeRules){
        this.rules = rules ;
    }

    concat(intakeHistory0:IntakeHistory,intakeHistory1:IntakeHistory):IntakeHistory{
        const intakeHistory2 = new IntakeHistory(intakeHistory0.intakes.concat(intakeHistory1.intakes));
        intakeHistory2.sort();
        return intakeHistory2;
    }

    enrich_(intakeHistory0:IntakeHistory,intakeHistory1:IntakeHistory):RichIntakeHistory{
        this.rules.sortIntakes(intakeHistory0);
        this.rules.sortIntakes(intakeHistory1);
        const tmp0:[Intake,boolean[][]][] = intakeHistory0.intakes.map((x:Intake)=>[x,intakeHistory1.intakes.map((y:Intake)=>this.rules.checkOrderRules(x,y))]);
        const tmp1:[Intake,number[][]][] = tmp0.map((x:[Intake,boolean[][]])=>[x[0],x[1].filter((y:boolean[])=>y[0]).map((y:boolean[])=>y.map((z:boolean)=>Number(z)))]);
        const tmp2:[Intake,number[]][] = tmp1.map((x:[Intake,number[][]])=>[x[0],x[1].reduce(IntakeRules.reducer,this.rules.initialValue)]);
        const tmp3:[Intake,number,boolean[]][] = tmp2.map(x=>[x[0],x[1][0],x[1].slice(1).map((x,i)=>this.rules.checkNumbers(x,i))]);
        const tmp4:[Intake,number,boolean][] = tmp3.map(x=>[x[0],x[1],x[2].reduce((acc,val)=>acc&&val,0===0)]);
        const tmp5:RichIntake[] = tmp4.map((x:[Intake,number,boolean])=>new RichIntake({date:x[0].date,hour:x[0].hour,valid:x[2],rk:x[1]}));
        const richIntakeHistory0 = new RichIntakeHistory(tmp5);
        richIntakeHistory0.sort();
        console.log('enrich_',tmp0,tmp1,tmp2,tmp3,tmp4,tmp5);
        return richIntakeHistory0;
    }

    enrich(intakeHistory0:IntakeHistory):RichIntakeHistory{
        return this.enrich_(intakeHistory0,intakeHistory0);
    }

    enrichRecent(intakeHistory0:IntakeHistory,intake:Intake):RichIntakeHistory{
        const intakeHistory1 = new IntakeHistory(intakeHistory0.intakes.filter(x=>IntakeHistory.compare(x,intake)>=0));
        return this.enrich_(intakeHistory1,intakeHistory1);
    }

    concatEnrichRecent(intakeHistory0:IntakeHistory,intake:Intake):RichIntakeHistory{
        const intakeHistory1 = this.concat(intakeHistory0,new IntakeHistory([intake]));
        return this.enrichRecent(intakeHistory1,intake);
    }

    getNow():Intake{
        const tmp1 = new Date(Date.now());
        const year:string = tmp1.getFullYear().toString().padStart(4,'0');
        const month:string  = tmp1.getMonth().toString().padStart(2,'0');
        const date_:string  = tmp1.getDate().toString().padStart(2,'0');
        const hours:string  = tmp1.getHours().toString().padStart(2,'0');
        const minutes:string  = tmp1.getMinutes().toString().padStart(2,'0');
        const seconds:string  = tmp1.getSeconds().toString().padStart(2,'0');
        const date:string  =[date_,month,year].join('/');
        const hour:string  = [hours,minutes,seconds].join(':');
        
        return new Intake({date:date,hour:hour});
    }

    getNextValid(intakeHistory0:IntakeHistory):RichIntake{
        if(!intakeHistory0.sorted){
            intakeHistory0.sort(); 
        }
        const tmp0:number[] = this.rules.rules.map((x:Rule)=>1000*(intakeHistory0.getLatest(x['number']-1).time+x['duration']));
        const tmp1 = new Date(tmp0.reduce((acc:number,val:number) => Math.max(acc,val),Date.now()));
        const year:string  = tmp1.getFullYear().toString().padStart(4,'0');
        const month:string  = (tmp1.getMonth()+1).toString().padStart(2,'0');
        const date_:string  = tmp1.getDate().toString().padStart(2,'0');
        const hours :string = tmp1.getHours().toString().padStart(2,'0');
        const minutes:string  = tmp1.getMinutes().toString().padStart(2,'0');
        const seconds:string  = tmp1.getSeconds().toString().padStart(2,'0');
        const date:string  =[date_,month,year].join('/');
        const hour:string  = [hours,minutes,seconds].join(':');
        
        return new RichIntake({date:date,hour:hour,valid:true,rk:intakeHistory0.intakes.length+1});
    }
}

export type {DateHour,DateTime,DateHourValid,DateHourValidProps,DateHourValidRk,Converter};
export {DateHourConverter,Intake,RichIntake,IntakeRules,IntakeHistory,RichIntakeHistory,Builder};