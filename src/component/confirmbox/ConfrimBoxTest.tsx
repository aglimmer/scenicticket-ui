import React, {useState } from 'react';
import ConfirmBox from '.';

//adsjlksdjksdk
const ConfirmBoxTest: React.FC = () => {
	console.log('ConfirmBoxTest..............')
    //ack为true，显示弹窗
	let [ack,setAck] = useState(false)

	//弹窗返回结果
	const confirmResponse = (res:boolean)=>{
		console.log("弹窗的选项结果：",res)
		//消除弹框
		setAck(false)
    }
    //点击，触发控制弹窗显示
	const popView = (e:any)=>{
		setAck(!ack);
	}
	return (
		<div>
				<button onClick={popView}>弹出</button>
				{ack && <ConfirmBox confirmResponse={confirmResponse}/>}
		</div>
	);

}
export default ConfirmBoxTest;