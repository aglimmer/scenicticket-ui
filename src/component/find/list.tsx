import React, {useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import { SEARCH_LIST } from './index'
export interface ParamProps{
    data:any[]
    updateLogingState:Function;
}

const List:React.FC=()=>{
    //当前要显示的数据
    const [data,setData] = useState([])
    //PubSub.subscribe 第1个参数为主题，第2个参数为函数且其中函数参数第1个为主题，第2个为publish传递的对应的数据
    //PubSub.subscribe直接暴露在外部，会导致一个状态多次执行
    //而是应该放入useEffect(age0,[])中
    useEffect(()=>{
        console.log("useEffect....")
        PubSub.subscribe(SEARCH_LIST,(msg: any,param: { loading: any; data: any; updateLogingState: any })=>{
            //msg为主题的字符串search-list
            console.log(msg)
            const {loading,data,updateLogingState} = param
            //更新父组件状态
            updateLogingState(false)
            setData(data)
            console.log(data)
        })
        //组件卸载时调用函数将其取消订阅
        return cancel;
    },[])
    //当点击取消订阅时，不会再收到订阅信息
    const cancel = ()=>{
        PubSub.unsubscribe(SEARCH_LIST)
        console.log("取消订阅") 
        
    }
    return(
    <div>
        <p>显示区域 &nbsp;<button onClick={cancel}>取消订阅</button></p>
         {data.map((value,index)=>(<li key={index}>{value}</li>))}
    </div>
    )
}
export default List;