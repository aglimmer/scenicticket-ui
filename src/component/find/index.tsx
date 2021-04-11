import React, { useCallback, useEffect, useState } from 'react'
import Simple from '../simple';
import List from './list';
import PubSub from 'pubsub-js'
//订阅的频道
export const SEARCH_LIST = "SEARCH_LIST"
//测试PubSub用法
const Search:React.FC=()=>{
    let keyWordElement:any;
    console.log()
    let [data,setData] = useState<any[]>([])
    const [loading,setLoading] = useState(false)
    const searchInfo =() => {
        console.log("search...")
        //把输入信息用空格分隔并显示出来
        data = keyWordElement.value.split(' ')
        setLoading(true);
        const p = window.setInterval(() => {
               const param ={loading:loading,data:data,updateLogingState:updateLogingState}
               PubSub.publish(SEARCH_LIST,param)
            clearInterval(p)
         },1000)
    }
    
    //给子组件使用的回调函数，用于改变父组件状态
    let updateLogingState = (loading:boolean)=>{
        setLoading(loading)
    }
    return (
        <>
        <section>
            <input ref={e=>keyWordElement=e} type="text" placeholder="请输入关键字点击搜索" />&nbsp;
            <button onClick={searchInfo}>搜索</button>
            {loading && <h5>Loading...</h5>}
        </section>
        <List/>
       
        </>
    )
}
export default Search