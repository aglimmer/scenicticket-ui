import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../home';
import './login.css'
// import axios from 'axios'
import axios from '../util/axios'
interface UserProps{
    id:string;
    userId:string;
    authcType:string;
    username:string;
    userpw:string;
    salt:string;
    userType:string;
    state:string;
}
export const UserContext = createContext<{data:UserProps,isLogin:boolean}>({data:{id:"1",userId:"1",authcType:"1",username:"用户名",userpw:"密码",salt:"盐",userType:"用户类型",state:"状态"},isLogin:false})
const Login: React.FC = () => {
    console.log("Login................")
    // 取一个类型别名
    type elem = HTMLInputElement | null;
    // 申明两个变量
    let username: elem, password: elem;
    let [view,updateView] = useState(false);
    // 函数
    const getUserInfo = (e: any) => {
        if (e) {
            //阻止表单默认行为
            e.preventDefault();
        }
        // 避免类型检查提示，进行一次判断
        if (username && password) {
            if (username.value === "") {
                username.focus();
                return;
            }
            if (password.value === "") {
                password.focus();
                return;
            }
            if (username.value !== "" && password.value !== "") {
                console.log("用户名：" + username.value + "密码：" + password.value)
                const params = {
                    username:username.value,
                    password:password.value
                }
                onLogin(params);
            }
        }
    }
    const context = useContext(UserContext);

    const onLogin=(params:{username:string,password:string})=>{
        console.log("prams=",params)
        axios.post("/users/login",params).then((res:any)=>{
            console.log("res=",res)
            if(res.success){
                context.data = res.data as UserProps;
                context.isLogin = true;
                updateView(!view);
                console.log("登录成功")
            }else{
                context.isLogin = false;
                console.log("用户或密码错误")
            }
        })
    }
    if(context.isLogin){
        console.log("context----")
        return <Redirect to='/home' />
    }
    return (
        <div>
            <div className="div_center">
                <form onSubmit={getUserInfo} >
                    <table>
                        <tbody>
                            <tr>
                                <td>工号</td>
                                <td>
                                    <input type="text" defaultValue="test" ref={(e) => { username = e }} />
                                </td>
                            </tr>
                            <tr>
                                <td>密码</td>
                                <td><input type="password" defaultValue="666666" ref={(e) => { password = e }} /></td>
                            </tr>
                            <tr>
                                <td colSpan={2} align="center"><input type="submit" className="action_btn" value="登录" /></td>
                                {/* <td><input type="submit" value="注册"/></td> */}
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>

    )

}
export default Login