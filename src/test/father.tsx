import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';

export const VisibleContext = createContext<{ updateViewCallback: Function }>({ updateViewCallback: () => { } })
const set = new Set();

const Child: React.FC = (props: any) => {
	console.log("Child-------------------------------")
	const { id } = props.match.params;
	console.log("id=", id)
	//取出context中回调函数

	const [view, updateView] = useState(false);
	const { updateViewCallback } = useContext(VisibleContext);

	useEffect(() => {
		console.log("Child mount...")
		//进入当前组件，隐藏父组件
		updateViewCallback(false)
		return () => {
			console.log("当退回或移除Child组件，恢复父组件默认状态")
			console.log("Child clean...")
			updateViewCallback(true)
		}
	}, [])
	return (
		<div style={{ backgroundColor: 'red', fontSize: '24px', textAlign: 'center' }}>
			<h2>子组件显示区</h2>
			<button onClick={() => updateView(!view)}>更新子组件</button>
		</div>
	);
}

const Father: React.FC = (props: any) => {
	console.log("Father-----------------------------------")
	//用于当前组件更新状态
	const [view, updateView] = useState(false);
	//控制是否显示当前内容
	const visibleRef = useRef<boolean>(true);
	//用于子组件更新状态，要确保当present值改变时，presentRef的值与也要发生改变，因此不要单独使用changePresent
	let [present, changePresent] = useState(true);
	const presentRef = useRef<boolean>(present)

	//对于父组件A，且A中创建一个更新的当前状态的函数fn，该函数fn传递给子组件B，要让子组件B调用fn每次都能更新父组件A
	//	1.子组件B必须要改变fn中的状态函数才能更新
	//	2.对于父组件A中状态函数[present, changePresent] = useState(true)
	//	若仅仅只在父组件A中重新渲染组件，那么直接使用当前函数changePresent(!present)可以每次都能更新父组件A，那么present的值会随之改变
	//	但是，在子组件B中直接调用含有changePresent(!present)的fn函数，那么present保存的值则不会随之改变，因此可在fn中这样使用
	// 		present = !present;changePresent(present)
	//  这样present值才会每次更新，确保多次执行fn函数也能进行更新
	// 3.对于2中问题，推荐办法最好使用: const presentRef = useRef<boolean>(present);
	// 	在fn中再这样使用：
	//	presentRef.current = !presentRef.current;
	// 	changePresent(presentRef.current);


	//const callBack = useCallback(fn, deps) 用来保存在多次渲染中不需要重新加载的函数
	//第1个参数，指定函数fn；
	//第2个参数，指定依赖的变量deps，为列表
	//	通常取state变量、useRef变量，表示当依赖的变量发生改变并且组件重新渲染时，重新更新fn函数到内存
	//	如果只取useRef变量或者空列表，则只会在首次渲染组件时加载fn函数，并不会随着 .current值的改变而更新
	//	使用deps依赖，主要用来避免非必要渲染，即不需要每次渲染当前组件的时候都更新fn函数到内存
	//useCallBack并不能自动执行fn函数，即使首次渲染页不会执行，要要能够让其执行fn函数，必须要调用返回值callBack函数
	//当父组件需要传递函数给子组件时，就可以使用useCallback函数回调


	const updateViewCallback = useCallback(
		(visible: boolean) => {
			console.log("visible=", visible)
			console.log("size=", set.size)
			console.log("execute callBack()...")
			visibleRef.current = visible;
			presentRef.current = !presentRef.current;
			changePresent(presentRef.current)
		},
		[presentRef])
	//加入集合，判断返回的函数是否变更
	set.add(updateViewCallback);

	//context保存共享的数据，给子组件使用
	const context = useContext(VisibleContext);
	context.updateViewCallback = updateViewCallback;

	useEffect(() => {
		console.log("Father mount...")
		return () => {
			visibleRef.current = true;
			console.log("Father clean...")
		}
	}, [])

	return (
		<BrowserRouter >
			<Switch>
				<Route path="/child/:id" component={Child}></Route>
				{/* 当所有的路由都不匹配时，使用Redirect指定，注意 to="/xxx"必须先配置Route */}
				{/* <Redirect to="/xxx" ></Redirect> */}
			</Switch>
			{visibleRef.current &&
				<div>
					<div style={{ backgroundColor: 'orange', fontSize: '24px', textAlign: 'center' }}>
						<h2>父组件显示区</h2>
						<NavLink to={"/child/1001"} >点击跳转子组件</NavLink>
						<br/>
						<button onClick={() => updateView(!view)}>刷新当前组件</button>
					</div>
				</div>
			}
		</BrowserRouter>
	);

}
export default Father;