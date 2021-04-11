import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import './scenic.css'
import axios from '../util/axios'
import { BrowserRouter, BrowserRouter as Router, NavLink, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import Detail from './detail'
import Button, { ButtonType } from '../buttons/Button'
//控制父组件是否显示
export const UStyle = {
    show: {
        display: 'block'
    },
    unShow: {
        display: 'none'
    }
}
export const ScenicStyleContext = React.createContext<any>({})

// const simple: ScenicProp = {
//     closeTime: "01:00:00",
//     fee: 96,
//     id: 1,
//     openTime: "16:30:00",
//     remainSize: 3000,
//     scenicDiscription: "福州至今还保存相当一部分自唐宋以来形成的坊巷，成为历史名城的重要标志之一。这些坊巷中最为著名的要算\"三坊七巷\"街区。三坊七巷地处市中心，东临八一七北路，西靠通湖路，北接杨桥路，南达吉庇巷、光禄坊，占地约40公顷，现居民3678户，人口14000余人。 ",
//     scenicImg: "http://localhost:8080/scenicticket/img/scenic/1.png",
//     scenicName: "福州三坊七巷门票",
//     ticketSize: 3000
// }
export interface ScenicProp {
    id: string;
    scenicName: string;
    scenicImg: string;
    scenicDiscription: string;
    openTime: string;
    closeTime: string;
    fee: number;
    ticketSize: number;
    remainSize: number;
}



const Scenic: React.FC<any> = (props: any) => {
    console.log("scenic....................")
    const BasePath = props.match.path;
    console.log("BathPath=",BasePath)
    const [ans, saveAns] = useState<ScenicProp[]>([])
    const [currStyle, setCurrStyle] = useState(UStyle.show);
    //获取context
    const context = useContext(ScenicStyleContext)
    //设置是否可见,默认可见
    context.setVisible = ((opt: boolean) => opt ? setCurrStyle(UStyle.show) : setCurrStyle(UStyle.unShow))

    const queryAll = () => {
        let vs: ScenicProp[] = [];
        axios.get("/scenics/all").then((data:any) => {
            for (let tmp of data) {
                console.log(tmp);
                vs.push(tmp)
            }
            saveAns(vs)
        })
        return () => {
            setCurrStyle(UStyle.show);
            console.log("清除上一次状态")
        }
    }

    useEffect(queryAll, [])

    //控制搜索框显示
    const [info, updateInfo] = useState({ isLoading: false, isCorrect: true, msg: '' });
    //搜索框属性
    const inputRef = useRef<any>()
    //点击搜索景点
    const searchScenic = () => {
        const param = inputRef.current.value;
        console.log("param:", param)
        if (param === "") {
            updateInfo({ isLoading: false, isCorrect: false, msg: '输入不能为空' })
            return;
        }
        info.isCorrect=true;
        const urls = "/scenics/scenicName/" + encodeURIComponent(param);
        axios.get(urls).then((data:any) => {
            
            let vs: ScenicProp[] = [];
            for (let tmp of data) {
                console.log(tmp);
                vs.push(tmp)
            }
            if(vs.length<1){
                updateInfo({ isLoading: false, isCorrect: false, msg: '没有找到相关景点' })
            }else{
                saveAns(vs)
            }
        })
    }

    return (
        <>
            <div>
                <Switch>
                    <Route path="/home/scenic/detail" component={Detail} />
                </Switch>
            </div>
            <div style={currStyle}>
                <div>
                    <input type="text" ref={inputRef} placeholder="景点名称" className="input_search" /><button onClick={searchScenic} className="action_btn">搜索</button>
                    {!info.isCorrect &&
                        <p style={{ color: 'red' }}>{info.msg}</p>
                    }
                </div>
                <ul className="right-content">
                    {ans.map((name, index) => (
                        <li className="area" key={index}>
                            <img className="card" src={name.scenicImg} alt=''></img>
                            <label className="title">
                                <NavLink to={{ pathname: "/home/scenic/detail", state: ans[index] }} className="a_title">{name.scenicName}</NavLink>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {/* </ScenicStyleContext.Provider> */}
        </>
    )
}





// const Scenic: React.FC = (props: any) => {
//     console.log("scenic index..................")
//     // let info:ScenicProp={id:0,scenicName:'',scenicImg:'../images/profile.jpg',scenicDiscription:'详细信息',openTime:'',closeTime:'',fee:0,ticketSize:0,remainSize:0};
//     return (
//         // <ScenicItem />
//     )
// }
export default Scenic