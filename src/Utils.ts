type Star = '*';
type Starred<Type> = Type|Star;
type FType<Type0,Type1> = ((x:Type0)=>Type1);
type UnionFType<Type0,Type1> = FType<Type0,Type1>|FType<Type1,Type1>;
type StarredUnionFType<Type0,Type1> = UnionFType<Type0,Type1>|Starred<Type1>;

function isStar<Type0,Type1>(value:StarredUnionFType<Type0,Type1>): value is Star{
    return value==='*';
}

function isUnionfType<Type0,Type1>(value:StarredUnionFType<Type0,Type1>): value is UnionFType<Type0,Type1>{
    return true;
}

function zip<Type0,Type1>(l:[Array<Type0>,Array<Type1>]):Array<[Type0,Type1]>{
    return l[0].map((x:Type0,i:number)=>[x,l[1][i]]);
}

function unzip<Type0,Type1>(l:Array<[Type0,Type1]>):[Array<Type0>,Array<Type1>]{
    return [l.map((x:[Type0,Type1])=>x[0]),l.map((x:[Type0,Type1])=>x[1])];
}

function objectify<Type>(l:[Array<string>,Array<Type>]):Record<string,Type>{
    return Object.fromEntries(new Map(zip(l)));
}

function listify<Type>(obj:Record<string,Type>):[Array<string>,Array<Type>]{
    return [Object.keys(obj),Object.values(obj)];
}


function constantIdentity<Type>(value:Starred<Type>):(y:Type)=>Type{
    return (value==='*')?((x:Type)=>x):((x:Type)=>value);
}


function constantFunction<Type0,Type1>(value:StarredUnionFType<Type0,Type1>):UnionFType<Type0,Type1>{
    if(isStar(value)){

        return ((x:Type1)=>x);
    }
    else if(isUnionfType(value)){
        return value;
    }
    else {
        return ((x:Type0|Type1)=>value);
    }
}

function objectMap(f:FType<any,any>,keys:Array<string>):(obj:Record<string,any>)=>Record<string,any>{
    if(keys.length===0){
        return f;
    }
    else {
        function g(obj:Record<string,any>):Record<string,any>{
            if(keys[0] in obj){
                //return {...obj};
                return {...obj,[keys[0]]:objectMap(f,keys.slice(1))(obj[keys[0]])};
            }
            else{
                return {...obj};
            }
        }

        return g;
    }

}

export type {Star,Starred,FType,UnionFType,StarredUnionFType};
export {zip, unzip,objectify,listify,constantFunction,constantIdentity,objectMap};
