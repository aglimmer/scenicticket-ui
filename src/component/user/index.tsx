import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from '../util/axios'
import '../css/base.css'
import {UserContext} from '../login'
import { NavLink } from 'react-router-dom';
interface UserProp {
    id: number;
    realname: string;
    sex: string;
    profileImg: string;
    nickname: string;
    phone: string;
    mailbox: string;
    idNumber: string;
    registerTime: string;
    deleted: boolean;
}
// const BASE_URL = "http://localhost:8080/scenicticket/"


const User: React.FC = (props: any) => {
    console.log("user..................")
    let info: UserProp = { id: 0, realname: '', sex: '', profileImg: '/images/profile.jpg', nickname: '', phone: '', mailbox: '', idNumber: '', deleted: false, registerTime: '' };
    const classes = {
        isRead: 'input_read',
        isEdit: 'input_edit'
    }
    const CacheName = "user";
    let [userDetail, setuserDetail] = useState(info);
    /*保存用户信息*/
    const context = useContext(UserContext);
    const {userId} = context.data;
    const saveInfo = () => {
        setIsRead(true);
        setClsname(classes.isRead);
        console.log("保存信息：" + JSON.stringify(userDetail));
        const url = `/conductors/${userId}`;
        axios.put(url, userDetail).then((response) => {
            console.log("response=",response)
            session.setItem(CacheName, JSON.stringify(userDetail))
        }).catch((error) => {
            console.log(error)
        })
    }
    const editInfo = () => {
        setClsname(classes.isEdit);
        setIsRead(false);
    }
    let session = window.sessionStorage;
    useEffect(() => {
       
        let buff = session.getItem(CacheName);
        console.log("cacheName=",buff)
        // if (buff === undefined || buff === null) {
          const  userId = 1;
            axios.get(`/conductors/${userId}`).then((res:any) => {
                console.log("conductors=",res)
                if(res===""){
                    console.log("用户不存在")
                }else{
                    setuserDetail(res);
                    session.setItem(CacheName, JSON.stringify(res));
                }
            }).catch((error) => {
                console.log("请求失败！");
            });
        // } 
        // else {
        //     setuserDetail(JSON.parse(buff))
        // }
    }, []);


    const [isRead, setIsRead] = useState(true);
    let [clsname, setClsname] = useState(classes.isRead);
    return (
        <div>
            <div style={{ background: 'blue', height: '50px' }}>
                <div><img className="img_profile" alt='' src={userDetail.profileImg}></img></div>
            </div>
            <div>
                <ul>
                    <li>
                        <label>姓名</label>
                        <input className={clsname} defaultValue={userDetail.realname} readOnly={isRead} ref={(e) => userDetail.realname = (e == null ? userDetail.realname : e.value)}></input>
                    </li>
                    <li>
                        <label>性别</label>
                        <input className={clsname} readOnly={isRead} defaultValue={userDetail.sex} ref={(e) => userDetail.sex = (e == null ? userDetail.sex : e.value)}></input>
                    </li>
                    <li>
                        <label>昵称</label>
                        <input className={clsname} readOnly={isRead} defaultValue={userDetail.nickname} ref={(e) => userDetail.nickname = (e == null ? userDetail.nickname : e.value)}></input>
                    </li>
                    <li>
                        <label>手机号</label>
                        <input className={clsname} readOnly={isRead} defaultValue={userDetail.phone} ref={(e) => userDetail.phone = (e == null ? userDetail.phone : e.value)}></input>
                    </li>
                    <li>
                        <label>邮箱</label>
                        <input className={clsname} readOnly={isRead} defaultValue={userDetail.mailbox} ref={(e) => userDetail.mailbox = (e == null ? userDetail.mailbox : e.value)}></input>
                    </li>
                    <li>
                        <label>身份证号</label>
                        <input className={clsname} readOnly={isRead} defaultValue={userDetail.idNumber} ref={(e) => userDetail.idNumber = (e == null ? userDetail.idNumber : e.value)}></input>
                    </li>
                </ul>
            </div>
            <div>
                <button className="action_btn" onClick={editInfo}>修改资料</button>
                <button className="action_btn" onClick={saveInfo}>完成保存</button>
            </div>
        </div>
    )
}
export default User;