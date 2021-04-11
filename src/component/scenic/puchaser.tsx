
import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { ScenicProp } from '.';

interface SimpleCustomerProps {
    realName: string;
    idNumber?: string;
    phone?: string;
}


const Purchaser: React.FC = (props: any) => {
    const scenic = props.location.state as ScenicProp;
    let obj: SimpleCustomerProps = { realName: '' };
    console.log('sale............')
    return (
        <div>
            <table>
                <tbody>
                    {/* <tr>
                        <th colSpan={2}>游客购票信息</th>
                    </tr> */}
                    <tr>
                        <td>游客姓名：</td>
                        <td>  <input ref={(e) => obj.realName = (e == null ? obj.realName : e.value)} defaultValue="未知"></input></td>
                    </tr>
                    <tr>
                        <td>身份证号：</td>
                        <td>  <input ref={(e) => obj.idNumber = (e == null ? obj.idNumber : e.value)} defaultValue="530367199803022853"></input></td>
                    </tr>
                    <tr>
                        <td>手机号：</td>
                        <td>  <input ref={(e) => obj.phone = (e == null ? obj.phone : e.value)} defaultValue="18823432282"></input></td>
                    </tr>
                    <tr>
                        <td>费用：</td>
                        <td><b>{scenic.fee}</b></td>
                    </tr>
                    <tr>
                        <td>门票类型：</td>
                        <td><b>成人票</b></td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}

export default Purchaser;