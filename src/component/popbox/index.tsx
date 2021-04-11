import React, { useEffect, useState } from 'react';
import "./index.css"
const Popbox: React.FC<{ msg: string, closeCallback: Function }> = (props) => {
	console.log("popbox...................")
	const { msg, closeCallback } = props;
	// let [seconds, updateSeconds] = useState(3)
	//定时器，3 S 后清除

	// useEffect(() => {
	// 	// console.log("effect------------------")
	// 	let handler: any;
	// 	if (seconds > 0) {
	// 		// console.log(">0++++++++++++++++++", seconds)
	// 		handler = setInterval(() => {
	// 			updateSeconds(seconds - 1)
	// 		}, 1000)
	// 	} else {
	// 		// console.log("close===========")
	// 		closeCallback()
	// 	}
	// 	return () => {
	// 		//seconds改变后每次渲染都会清除上一次的定时器
	// 		clearInterval(handler);
	// 		// console.log("clear..........")
	// 	}
	// }, [closeCallback, seconds])
	return (
			<div className="popbox">
				<table style={{ width: '100%', height: '100%' }}>
					<tbody>
						<tr><td align="center">{msg}</td></tr>
						<tr><td align="center"><button className="close_btn" onClick={()=>closeCallback()}>关闭</button></td></tr>
					</tbody>
				</table>
			</div> 
	)
}


export default Popbox;