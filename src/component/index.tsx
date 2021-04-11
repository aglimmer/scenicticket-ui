
import React, { useContext } from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import Home from './home';
import Login from './login';
import './css/base.css'
import {UserContext} from './login'
import Top from './top';
const Component: React.FC = () => {
	console.log("component.......")
	const context = useContext(UserContext)
	const isLogin = context.isLogin;
	return (
		<div className="content">
			 <div><Top /></div>
			
			<div style={{margin:'0 auto',textAlign:'center',fontFamily:"Times,serif"}}>景点门票系统</div>
			<BrowserRouter>
				<Switch>
					<Route path="/login" component={Login}></Route>
					<Route path="/home" component={Home}></Route>
					{isLogin ? <Redirect to='/home' /> : <Redirect to='/login' />}
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default Component;