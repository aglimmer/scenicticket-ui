import React, { useCallback, useContext, useEffect, useState } from 'react'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom'
// import Scenic from '../scenic'
// import Simple from '../simple'
import '../css/base.css'
import Order from '../order'
import Refund from '../order/refund'
import Scenic, { ScenicStyleContext, UStyle } from '../scenic'
import Addition from '../scenic/addition'
// import Detail from '../scenic/detail'
// import Simple from '../simple'
import User from '../user'
import {UserContext} from '../login'



const Home: React.FC = (props:any) => {
	console.log("home------------------")
	console.log("props=",props)
	const BasePath = props.match.path;
	const context = useContext(UserContext);
	if(!context.isLogin){
		return <Redirect to="/login"/>
	}
	return (
			<div>
				<div className="nav">
					<NavLink to={BasePath+"/user"} className="list-item"  activeClassName="activeLink">个人中心</NavLink>
					<NavLink to={BasePath+"/scenic"} className="list-item" activeClassName="activeLink">景点门票</NavLink>
					<NavLink to={BasePath+"/order"} className="list-item"  activeClassName="activeLink">销售详情</NavLink>
					<NavLink to={BasePath+"/addition"} className="list-item"  activeClassName="activeLink">添加景点</NavLink>
					<NavLink to={BasePath+"/refund"} className="list-item" activeClassName="activeLink">退票统计</NavLink>
				</div>
				<div className="content">
					<Switch>
						<Route path={BasePath+"/user"} component={User}></Route>
						<Route path={BasePath+"/scenic"} component={Scenic}></Route>
						<Route path={BasePath+"/order"} component={Order}></Route>
						<Route path={BasePath+"/addition"} component={Addition}></Route>
						<Route path={BasePath+"/refund"} component={Refund}></Route>
						<Redirect to={BasePath+"/addition"}></Redirect>
					</Switch>
				</div>
			</div>
	)
}
export default Home