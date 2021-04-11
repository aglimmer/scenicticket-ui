
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import axios from '../util/axios'
import "./index.css"
import "../css/button.css"
import { TicketRecordProps } from '../scenic/detail';
import Popbox from '../popbox';

export const VisibleContext = createContext<{ updateVisibleCallback: Function }>({ updateVisibleCallback: () => { } })
// "conductorId": 1,
// "varifyId": 20201228122820664,
// "enterTime": "00:00:00",
// "leaveTime": "23:59:59",
// "orderDate": "2020-12-28",
// "createDateTime": "2020-12-28T09:31:32.962+00:00",
// "ticketType": "团体票",
// "payMoney": 346.5,
// "ticketSize": 11,
// "dealNote": "购票",
// "deleted": false


interface CustomerProps {
    id?: number;
    realName?: string;
    idNumber?: string;
    phone?: string;
}
interface ResultProps extends CustomerProps {
    ticketList?: any[];
}
// export interface RechargeProps{
//     id:number|any;
//     customerId:number;
//     conductorId:number;
//     dealType:number;
// }

export interface RefundTicketProps {
    id?: string;
    conductorRecordId: string;
    refundMoney: number;
    refundDate: string;
    refundSize: number;
    conductorBillId: number;
    deleted?: true | false;
}

export const UStyle = {
    show: {
        display: 'block'
    },
    unShow: {
        display: 'none'
    }
}

const Ticket: React.FC = (props: any) => {

    console.log("props:", props)
    const id = props.location.state;
    const BasePath = props.match?.path;
    const { updateVisibleCallback } = useContext(VisibleContext);
    const ticketRecordRef = useRef<TicketRecordProps[]>([])

    // const ticketRecordLabel = useRef({
    //     orderDate: "订票日期",
    //     ticketSize: "订票数量",
    //     enterTime: "进入时间",
    //     leaveTime: "离开时间",
    //     ticketType: "门票类型",
    //     payMoney: "支付费用",
    //     dealNote: "备注类型",
    //     createDateTime: "创建时间",
    // }
    // )
    const [view, changeView] = useState(false);
    const viewRef = useRef<boolean>(view);
    const updateView = useCallback(() => {
        viewRef.current = !viewRef.current;
        changeView(viewRef.current);
    }, [viewRef])

    const reqRef = useRef("");
    const isSuccess = useRef(false);
    //查询所有订票
    const queryTicketByVarifyId = () => {
        const ticketUrl = "/conductorTicketRecords/varifyId/" + id;
        axios.get(ticketUrl).then((data:any) => {
            const ticketList = data as TicketRecordProps[];
            ticketRecordRef.current = ticketList;
            updateView()
        })
    }
    useEffect(() => {
        updateVisibleCallback(false)
        queryTicketByVarifyId()
        return () => {
            console.log("移除Ticket...")
            updateVisibleCallback(true)
        }
    }, [])


    const dealRefundTicket = (e: any) => {
        let index = parseInt(e.target.name)
        reqRef.current = "";
        isSuccess.current = false;
        const record = ticketRecordRef.current[index];
        const refundTicket: RefundTicketProps = {
            id: '',
            conductorRecordId: record.id,
            refundMoney: record.payMoney,
            refundDate: '',
            refundSize: record.ticketSize,
            conductorBillId: 0,
            deleted: false,
        }
   
        //发请求保存退票订单
        axios.post("conductorRefunds/conductorRefund", refundTicket).then((data: any) => {
            console.log(data)
            ticketRecordRef.current[index].dealNote = "退票";
            //发请求标记订单为退票状态
            updateOrder(index)
        }).catch((e) => {
            reqRef.current = "请求发送失败"
            console.log(reqRef.current)
            updateView()
        })
    }
    const updateOrder = (index: number) => {
       
        axios.post("/conductorTicketRecords/record", ticketRecordRef.current[index]).then((data) => {
            console.log(data)
            isSuccess.current = true;
            reqRef.current = "请求处理成功";
            updateView()
        }).catch(e => {
            console.log(e)
            reqRef.current = "请求发送失败"
            console.log(reqRef.current)
            updateView()
        })
    }
    const closeCallback = () => {
        if (isSuccess.current) {
            // window.location.reload()
            window.location.href="/home/refund"
        }
        reqRef.current = "";
        updateView();
    }

    return (

        <div>
            {ticketRecordRef.current.length > 0 ?
                <h1 className="title">总数：{ticketRecordRef.current.length}条</h1> :
                <h1 className="title">无相应记录！</h1>
            }
            <table className="list">

                {ticketRecordRef.current.length > 0 &&
                    <thead>
                        <tr>
                            <th>订票日期</th>
                            <th>订票数量</th>
                            <th>进入时间</th>
                            <th>离开时间</th>
                            <th>创建时间</th>
                            <th>支付费用</th>
                            <th>门票类型</th>
                            <th>备注信息</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                }
                <tbody>
                    {ticketRecordRef.current.map((ticketRecord, index) =>
                        <tr key={index}>
                            <td>{ticketRecord.orderDate}</td>
                            <td>{ticketRecord.ticketSize}</td>
                            <td>{ticketRecord.enterTime}</td>
                            <td>{ticketRecord.leaveTime}</td>
                            <td>{ticketRecord.createDateTime}</td>
                            <td>{ticketRecord.payMoney}</td>
                            <td>{ticketRecord.ticketType}</td>
                            <td>{ticketRecord.dealNote}</td>
                            <td align="center">{ticketRecord.dealNote === "购票" && <button className="action_btn" name={index.toString()} onClick={dealRefundTicket} >退票</button>}</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
            {reqRef.current !== "" && <Popbox msg={reqRef.current} closeCallback={closeCallback} />}
        </div >

    );
}

const Order: React.FC = (props: any) => {
    console.log("Order............")
    const BASE_URL = "http://localhost:8080/scenicticket/";
    const BasePath = props.match?.path === undefined ? "" : props.match.path;
    console.log("BasePath=", BasePath)
    //更新视图
    const [view, updateView] = useState(false);
    //父组件是否可见
    const [present, updatePresent] = useState<boolean>(true)
    const presentRef = useRef<boolean>(present)


    //共享的回调函数，用于改变状态
    const context = useContext(VisibleContext);
    const visibleRef = useRef<boolean>(true)
    //回调函数
    context.updateVisibleCallback = useCallback((visible: boolean) => {
        visibleRef.current = visible;
        presentRef.current = !presentRef.current;
        updatePresent(presentRef.current)
    }, [presentRef])

    //输入框内容
    const inputRef = useRef<any>();
    //点击事件通知
    const [info, updateInfo] = useState({ isLoaging: false, isCorrect: true, msg: '' });
    //下拉选择框选项
    const optionNamesRef = useRef([{ name: "phone", value: "手机号" }, { name: "realName", value: "姓名" }]);
    //选择框选中内容
    const selectItemRef = useRef<any>(optionNamesRef.current[0])

    //改变下拉框触发事件
    const changeSelectItem = (e: any) => {
        console.log(e.target.value)
        const param = optionNamesRef.current.find((obj, index) => obj.name === e.target.value)
        if (param !== undefined) {
            selectItemRef.current = param;
            console.log("selectItem=", selectItemRef.current)
        }
        updateView(!view)
    }
    //游客信息
    const resultRef = useRef<CustomerProps[]>([]);

    //查询游客信息
    const queryRocord = () => {
        console.log("phone:", inputRef.current)
        const urls = "/customerVarifys/" + selectItemRef.current.name + "/" + encodeURIComponent(inputRef.current.value)
        axios.get(urls).then((data:any) => {
            console.log("查询结果。。。")
            console.log(data)
            const customerList = data as CustomerProps[];
            resultRef.current = customerList;
            updateView(!view)
        })
    }
    //搜索用户
    const searchCustomer = () => {
        // console.log("search:",inputRef.current.value)
        const scenicName = inputRef.current.value;
        if (scenicName === "") {
            updateInfo({ isLoaging: false, isCorrect: false, msg: '输入内容不能为空' })
            return;
        }
        queryRocord()
    }
    useEffect(() => {
        console.log("father...")
        searchCustomer();
        // updateView(!view);
        return () => {

            console.log("father...clean")
            updateView(!view);
        }
    }, [])
    const userLabelListRef = useRef<any[]>(["ID", "姓名", "身份证号", "手机号", "详情"]);
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path={BasePath + "/ticket"} component={Ticket}></Route>
                </Switch>
                <div style={{ display: (visibleRef.current ? 'block' : 'none') }}>
                    {/* <div> */}
                    <div>
                        <input type="text" ref={inputRef} defaultValue="1" placeholder={"请输入" + selectItemRef.current.value} />
                        <select onChange={changeSelectItem} defaultValue={selectItemRef.current.value}>
                            {optionNamesRef.current.map((obj, index) => (
                                <option key={index} value={obj.name}>{obj.value}</option>
                            ))}
                        </select>
                        <button onClick={searchCustomer} className="action_btn">搜索</button>
                        {!info.isCorrect &&
                            <p style={{ color: 'red' }}>{info.msg}</p>
                        }
                    </div>
                    <div>
                        {resultRef.current?.length > 0 ?
                            <h2>总数：{resultRef.current.length}</h2> :
                            <h2>提示：没有找到相应记录！</h2>
                        }
                        <table className="list">
                            <thead>
                                {resultRef.current.length > 0 &&
                                    <tr>
                                        {userLabelListRef.current.map((name, index) =>
                                            <th key={index}>{name}</th>
                                        )}
                                    </tr>
                                }
                            </thead>
                            <tbody>
                                {resultRef.current?.map((obj, index) =>
                                    <tr key={index}>
                                        <td>{obj.id}</td>
                                        <td>{obj.realName}</td>
                                        <td>{obj.idNumber}</td>
                                        <td>{obj.phone}</td>
                                        <td align="center"><NavLink to={{ pathname: BasePath + "/ticket", state: obj.id }}>查看</NavLink></td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Order;