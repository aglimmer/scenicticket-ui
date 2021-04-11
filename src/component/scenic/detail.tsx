
import React, { InputHTMLAttributes, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Scenic, { ScenicProp, ScenicStyleContext, UStyle } from '.';
import axios from '../util/axios'
import './scenic.css'
import Popbox from '../popbox';


export interface TicketTypeProps {
    id: string;
    scenicId: string;
    ticketType: string;
    discountRate: number;
}
//售票信息
//enterTime：景点开放时间
//leaveTime：景点关闭时间
//createDateTime：不用发送，后台自动创建
//varifyId: 游客登记的ID
//dealNote:默认为购票

export interface TicketRecordProps {
    id: string;
    scenicId: string;
    conductorId: string;
    varifyId: string;
    enterTime: string;
    leaveTime: string;
    createDateTime?: string;
    orderDate: string;
    ticketType: string;
    payMoney: number;
    ticketSize: number;
    dealNote?: "购票" | "退票";
    deleted?: true | false;
}
//游客登记信息
//id:后端生成，不用向后端传递
export interface CustomerVarifyProps {
    id?: string;
    realName: string;
    idNumber?: string;
    phone?: string;
}
/*
{id: 3, scenicName: "厦门鼓浪屿上船门票", scenicImg: "http://localhost:8080/scenicticket/img/scenic/3.png", scenicDiscription: "鼓浪屿是个宁静美丽的小岛，这里有着各种风格迥异、中西合壁的建筑，汇集了各种特色的食铺和商铺，充满了文…庄花园（含钢琴博物馆）、明代风格建筑的皓月园（内有郑成功石像）、风琴博物馆和国际刻字艺术馆等。
↵", openTime: "08:00:00", …}
*/

const getDaysWithNow = (datestr: string) => {
    //日期转换数字
    //const [year,month,day] = new Date().toLocaleDateString().split('-').map((o)=>parseInt(o));
    const now = new Date().getTime();
    const dates = new Date(datestr).getTime();
    let days = Math.ceil((dates - now) / 1000 / 60 / 60 / 24);
    return days;
}
//按景点ID查询门票，返回列表
const queryTicketById = (id: string, updateTicketList: Function) => {
    let vs: TicketTypeProps[] = [];
    const baseUrl = "/scenics/scenicId/" + id;
    axios.get(baseUrl).then((data:any) => {
        for (let tmp of data) {
            console.log(tmp);
            vs.push(tmp)
        }
        updateTicketList(vs);
    });
}
//添加购票记录，返回处理信息
const saveTicketRecord = (tickets: TicketRecordProps, updateResult: Function) => {
    const orderUrl = "/conductorTicketRecords/record";
    axios.post(orderUrl, tickets).then((res) => {
        updateResult("购票处理成功:",res)
    }).catch((e) => {
        updateResult("请求失败")
    })
}
const dateStringFormat = (datestr: string): string => {
    var now = new Date(datestr);
    //格式化日，如果小于9，前面补0
    var day = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    return today;
}


const Detail: React.FC = (props: any) => {
    console.log("detail...................")
    console.log(props.location.state)
    let scenic = props.location.state as ScenicProp;
    let { setVisible } = useContext(ScenicStyleContext);

    // const info:TicketTypeProps = {id:1,scenicId:1,ticketType:"成人票",discountRate:1}

    // const initParam: TicketTypeProps = { id: 1, scenicId: 1, ticketType: '', discountRate: 0 }

    const [view, changeView] = useState(false)
    const viewRef = useRef(view);
    //更新当前组件
    const updateView = useCallback(()=>{
        viewRef.current = !viewRef.current;
        changeView(viewRef.current);
    },[viewRef])

    //加载组件后，查询门票
    const ticketListRef = useRef<TicketTypeProps[]>([])
    const validRef = useRef('');
    const responseRef = useRef('');
    //首次加载组件时执行
    useEffect(() => {
        //根据景点ID获取票额
        queryTicketById(scenic.id, (res: TicketTypeProps[]) => {
            //返回数据
            ticketListRef.current = res;
            //子组件开始挂载，父组件隐藏
            setVisible(false)
            //更新当前组件
            updateView()
        });
        return () => {
            //恢复父组件状态
            setVisible(true)
            console.log("detail卸载。。。")
        }
    }, [])


    //保存身份信息
    const { current: obj } = useRef<CustomerVarifyProps>({ realName: 'xxx', idNumber: '530382199806122453', phone: '15329291231' })

    //保存订单信息,解构出对象并重名为ticketOrder
    const { current: ticketOrder } = useRef<TicketRecordProps>({
        id:'',
        scenicId: '',
        conductorId: '',
        varifyId: '',
        enterTime: scenic.openTime,
        leaveTime: scenic.closeTime,
        orderDate: dateStringFormat(new Date().toLocaleDateString()),
        ticketType: '',
        payMoney: 0,
        ticketSize: 0,
        dealNote: "购票"
    })

    //计算票价
    const calPrice = (discount: number) => {
        return Math.round(scenic.fee * discount * 100) / 100;
    }


    //检查输入信息
    const checkInput = () => {
        console.log(ticketOrder)
        console.log(obj)

        //获取选中的门票类型
        // let pay = ticketListRef.current.find((o) => o.ticketType === ticketOrder.ticketType)?.discountRate
        console.log(ticketOrder)
        console.log(obj)

        if (ticketOrder.ticketType === "") {
            return "请选择门票类型"
        }
        const days = getDaysWithNow(ticketOrder.orderDate);
        if (days < 0 || days > 30) {
            return "日期不能小于当前且不能超出未来30天"
        }

        console.log("size=", ticketOrder.ticketSize)
        if (ticketOrder.ticketType === "团体票" && ticketOrder.ticketSize < 10) {
            return "团体票购买票数必须大于等于10"
        }

        if (ticketOrder.ticketSize < 1 || ticketOrder.ticketSize > 100) {
            return "门票数量必须大于等于1且不能超过100";
        }

        //验证用户身份信息
        if (obj.idNumber === '' || obj.realName === '') {
            return "请正确输入用户信息";
        }
        console.log("pass===========================================")
        return "";
    }
    //完成订单：1.添加游客身份信息 2.添加订单
    const finishOrder = () => {
      
        const msg = checkInput();
        if (msg !== "") {
            validRef.current=msg;
            updateView()
            return;
        }
        let conductor = window.sessionStorage.getItem("conductor");
        let conductorId = conductor === null ? 1 : JSON.parse(conductor);
        ticketOrder.conductorId = conductorId;
        console.log("obj=======", obj)
        //购票人身份登记信息保存到数据库
        axios.post("customerVarifys/add", obj).then((data:any) => {
            console.log("res=", data)
            //然后，购票订单页也要保存到数据库
            ticketOrder.varifyId = data;
            saveTicketRecord(ticketOrder, (msg: string) => {
                console.log(msg)
            });
            responseRef.current= "购票处理成功"
            console.log(responseRef.current)
            updateView()
            // setTimeout(()=>{
            //     console.log("正在跳转")
            //     window.location.href="/home/scenic"
            // },3000)
        }).catch(() => {
            responseRef.current= "购票处理失败"
            updateView()
            console.log(responseRef.current)
        })
    }


    const changeObj = (e: any) => {
        console.log("changeObj....")
        const { name, value } = e.target
        obj[name] = value;
        console.log(name, value)
        validRef.current=checkInput()
        updateView()
    }
    const changeTicketOrder = (e: any) => {
        console.log("changeObj....")
        const { name, value } = e.target
        ticketOrder[name] = value;
        console.log(name, value)
        if (name === "ticketType" || name === "ticketSize") {
            let pay = ticketListRef.current.find((o) => o.ticketType === ticketOrder.ticketType)?.discountRate
            //首次加载，为undefined
            if (pay !== undefined) {
                ticketOrder.payMoney = calPrice(pay as number) * ticketOrder.ticketSize
                console.log("当前费用：", ticketOrder.payMoney)
            }
        }
        validRef.current=checkInput()
        updateView()
    }
    const changeOrderDate = (e: any) => {
        console.log("changeOrderDate....")
        ticketOrder.orderDate = dateStringFormat(new Date(e.target.value).toLocaleDateString())
        console.log(ticketOrder.orderDate)
        validRef.current=checkInput();
        updateView()
    }
    return (
        <>
            <div>
                {responseRef.current!=="" && <Popbox msg={responseRef.current} closeCallback={()=>{responseRef.current="";updateView()}}/>}
                <h3>{scenic.scenicName}</h3>
                <h4>开放时间</h4>
                <p>{scenic.openTime}~{scenic.closeTime}</p>
                <h4>门票类型</h4>
                <div>
                    <p>
                    {ticketListRef.current.map((name, index) => (
                        <label key={index}><b>{name.ticketType}</b>&nbsp;{calPrice(name.discountRate as number)}元
                            <input type="radio" name="ticketType" value={name.ticketType} onChange={changeTicketOrder} />
                        </label>
                    ))}
                    </p>
                </div>
                <h4>购票人信息</h4>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td><b>游客姓名 </b></td>
                                <td>  <input type="text" name="realName" onChange={changeObj} defaultValue={obj.realName}></input></td>
                            </tr>
                            <tr>
                                <td><b>身份证号</b></td>
                                <td>  <input type="password" name="idNumber" defaultValue={obj.idNumber} onChange={changeObj}></input></td>
                            </tr>
                            <tr>
                                <td><b>手机号</b></td>
                                <td>  <input name="phone" type="number" defaultValue={obj.phone} onChange={changeObj}></input></td>
                            </tr>
                            <tr>
                                <td><b>门票数量</b></td>
                                <td>  <input name="ticketSize" type="number" onChange={changeTicketOrder} defaultValue={ticketOrder.ticketSize}></input></td>
                            </tr>

                            <tr>
                                <td><b>使用日期</b></td>
                                <td><input type="date" onChange={changeOrderDate} defaultValue={ticketOrder.orderDate} />
                                </td>
                            </tr>
                            <tr>
                                <td><b>门票支付费用</b></td>
                                <td><b>{ticketOrder.payMoney}</b></td>
                            </tr>
                            <tr><td colSpan={2}><i>提示：团体票10人起，总费用 = 团体票价格 x 总人数</i></td></tr>
                            <tr>
                                <td colSpan={2}><button className="action_btn" onClick={finishOrder}>确认订票</button></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    {validRef.current !== '' && <div style={{ color: 'red' }}>{validRef.current}</div>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h4>景点介绍</h4>
                <div>
                    <p>{scenic.scenicDiscription}</p>
                    <img src={scenic.scenicImg} alt="无法显示"></img>
                </div>
            </div>
        </>
    )
}


export default Detail