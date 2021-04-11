import React, { useEffect, useRef, useState } from 'react';
import { RefundTicketProps } from '.';
import axios from "../util/axios"
import "./index.css"
import { CustomerVarifyProps, TicketRecordProps } from '../scenic/detail';
/*
const exemple=[
        {
          "conductorRefund": {
            "id": "1",
            "conductorRecordId": "46",
            "refundDate": "2021-01-03 20:33:39",
            "refundMoney": 35,
            "refundSize": 1,
            "conductorBillId": "0",
            "deleted": false
          },
          "customerVarify": {
            "id": "20210103004107286",
            "realName": "张三",
            "idNumber": "530382199806122453",
            "phone": "15329291231"
          },
          "conductorTicketRecord": {
            "id": "46",
            "scenicId": "0",
            "conductorId": "1",
            "varifyId": "20210103004107286",
            "enterTime": "00:00:00",
            "leaveTime": "23:59:59",
            "orderDate": 1609603200000,
            "createDateTime": "2021-01-03 20:33:33",
            "ticketType": "标准票",
            "payMoney": 35,
            "ticketSize": 1,
            "dealNote": "退票",
            "deleted": false
          }
        }
      ]
      */
//后端返回多个对象联合的json列表，必须按照返回值中给定关键字来定义接口     
interface RefundTicketView{
    conductorRefund:RefundTicketProps,
    conductorTicketRecord:TicketRecordProps,
    customerVarify:CustomerVarifyProps,
}     
const Refund: React.FC = (props) => {
    console.log("Refund...................")
    const [view, changeView] = useState(false);
 

    let refundTicketListRef = useRef<RefundTicketView[]>([])
    const sumItemRef = useRef({sumTicket:0,sumMoney:0})
    useEffect(() => {
        axios.get("/conductorRefunds/refundTicketView").then((data:any) => {
            refundTicketListRef.current = data as RefundTicketView[];
            console.log(data)
            console.log("=================")
            console.log(refundTicketListRef.current)
            console.log("=================")
            // refundTicketListRef.current.forEach((ticket,index)=>{
            //     sumItemRef.current.sumMoney += ticket.refundMoney;
            //     sumItemRef.current.sumTicket += ticket.refundSize;
            // })
            refundTicketListRef.current.forEach((obj,index)=>{
                let {conductorRefund} = obj;
                // console.log(conductorRefund)
                // console.log(conductorTicketRecord)
                // console.log(customerVarify)
                // console.log(obj)
                sumItemRef.current.sumMoney += conductorRefund.refundMoney
                sumItemRef.current.sumTicket += conductorRefund.refundSize
            })
            changeView(!view)
        })
    }, [])
    return (
        <div>
            <h1 className="title">{refundTicketListRef.current.length>0?
            <table className="line_table">
                <thead>
                    <tr>
                        <th>订单数量：{refundTicketListRef.current.length}</th>
                        <th>退票数量：{sumItemRef.current.sumTicket}</th>
                        <th>退款总额：{sumItemRef.current.sumMoney}</th>
                    </tr>
                </thead>
            </table>
            :
            "没有找到相应记录！"}
            </h1>
            <table className="list">
                <thead>
                   {refundTicketListRef.current.length>0 && 
                   <tr>
                        <th>账单ID</th>
                        <th>游客姓名</th>
                        <th>购票时间</th>
                        <th>退票数量</th>
                        <th>退款金额</th>
                        <th>退款日期</th>
                        <th>销售订单</th>
                    </tr>}
                </thead>
                <tbody>
                    {refundTicketListRef.current.map((obj, index) => (
                        <tr key={index}>
                            <td>{obj.conductorRefund.id}</td>
                            <td>{obj.customerVarify.realName}</td>
                            <td>{obj.conductorTicketRecord.createDateTime}</td>
                            <td>{obj.conductorRefund.refundSize}</td>
                            <td>{obj.conductorRefund.refundMoney}</td>
                            <td>{obj.conductorRefund.refundDate}</td>
                            <td>{obj.conductorTicketRecord.id}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}
export default Refund

