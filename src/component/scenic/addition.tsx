
import React, { useCallback, useRef, useState } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { ScenicProp } from '.';
import axios from '../util/axios'
import './scenic.css'
import { TicketTypeProps } from './detail';
import { AssertionError } from 'assert';
import Popbox from '../popbox';
// import Home from './home';
//
// closeTime: "17:00:00"
// fee: 30
// id: 2
// openTime: "07:30:00"
// remainSize: "2000"
// scenicDiscription: "进灵隐寺，需要先进飞来峰景区，并先购买飞来峰景区门票。"
// scenicImg: "http://localhost:8080/scenicticket/img/scenic/2.png"
// scenicName: "杭州灵隐寺"
// ticketSize: "2000"
const Addition: React.FC = () => {
	const BasePath = ""
	const BaseUrl = "http://localhost:8080/scenicticket/"
	console.log('simple............')
	let { current: scenicInput } = useRef<ScenicProp>({
		id: '',
		scenicName: '',
		scenicImg: '',
		scenicDiscription: '',
		openTime: '',
		closeTime: '',
		fee: 0,
		ticketSize: 5000,
		remainSize: 5000,
	})
	const [view, changeView] = useState<boolean>(false);
	const viewRef = useRef<boolean>(view);
	const imgRef = useRef({ src: '', width: '', height: '' })
	const updateView = useCallback(
		() => {
			viewRef.current = !viewRef.current;
			changeView(viewRef.current)
		},
		[viewRef],
	)
	//上传图片事件函数
	const changeImg = (e: any) => {
		console.log(e.target.name)
		let file = e.target.files[0]

		//直接发送表单文件图片
		// const formData = new FormData();
		// formData.append("file",file);
		// const urls = "http://localhost:8080/scenicticket/img/upload";
		// const config = {
		// 	headers: { "Content-Type": "multipart/form-data" }
		// }
		// axios.post(urls,formData,config).then((e:any)=>{
		// 	console.log(e.data)
		// }).catch((e:any)=>console.log(e));

		console.log("file=", file)
		if (file === undefined) {
			imgRef.current.src = "";
			updateView()
			return;
		}
		if (window.FileReader) {
			const fr = new FileReader()
			fr.onloadend = (e: any) => {
				imgRef.current.src = e.target.result;
				// console.log(imgRef.current)
				let img = new Image();
				img.src = imgRef.current.src
				//加载图片后，按指定大小等比例调整
				img.onload = () => {
					console.log(img.width, img.height)
					const DefaultWidth = 640;
					let scale = img.width > DefaultWidth ? 1 / (img.width / DefaultWidth) : 1 + ((DefaultWidth - img.width) / img.width)
					imgRef.current.width = Math.floor(img.width * scale) + "px";
					imgRef.current.height = Math.floor(img.height * scale) + "px";
					console.log(Math.floor(img.width * scale), Math.floor(img.height * scale))
					updateView()
				}

			}
			fr.readAsDataURL(file)
			console.log("file........")
		}
	}
	console.log("name==", scenicInput.scenicName)
	const ticketTypeRef = useRef(["标准票", "儿童票", "老人票", "团体票"])
	const msgRef = useRef('')
	const reqRef = useRef('')
	const isSucces = useRef(false);
	//检查景点信息是否完整
	const isValid = () => {
		msgRef.current = '';
		const compareTime = (beginTime: string, endTime: string) => {
			const [h1, m1] = beginTime.split(':').map(o => parseInt(o))
			const [h2, m2] = endTime.split(":").map(o => parseInt(o))
			const sum1 = h1 * 3600 + m1 * 60;
			const sum2 = h2 * 3600 + m2 * 60;
			return sum2 - sum1;
		}
		if ((scenicInput.scenicName.length > 64 || scenicInput.scenicName === "")) {
			msgRef.current = "景点名称不能为空且不能超过64个字符"
			return false;
		}
		if (scenicInput.openTime === "") {
			msgRef.current = "起始时间不能为空"
			return false;
		}
		if (scenicInput.closeTime === "" || (scenicInput.closeTime !== "" && compareTime(scenicInput.openTime, scenicInput.closeTime) < 0)) {
			if (scenicInput.closeTime === "") {
				msgRef.current = "终止时间不能为空"
			} else {
				msgRef.current = "终止时间不能早于开始时间"
			}
			return false;
		}
		if (scenicInput.fee <= 0 || scenicInput.fee > 10000) {
			msgRef.current = "标准费用不能小于等于0且不能超过10000"
			return false;
		}
		if (scenicInput.ticketSize < 0 || scenicInput.ticketSize > 300000) {
			msgRef.current = "门票容量不能小于0且不能超过30万"
			return false;
		}
		if (scenicInput.scenicDiscription === "" || scenicInput.scenicDiscription.length > 10000) {
			msgRef.current = "景点介绍不能为空且不能超过10000字"
			return false;
		}
		return true;
	}
	//输入框选中事件处理函数
	const checkInput = (e: any) => {
		const { name, value } = e.target
		// let tmp = isNaN(Number(value)) ? value : parseFloat(value)
		scenicInput[name] = value;
		//检查每一个输入项
		isValid();
		updateView()
	}
	let { current: ticketTypeList } = useRef<TicketTypeProps[]>([])
	//检查是否填写完整
	const isValidForTicket = () => {
		msgRef.current = '';
		for (let k = 0; k < ticketTypeList.length; k++) {
			if (ticketTypeList[k].discountRate < 0 || ticketTypeList[k].discountRate > 1) {
				msgRef.current = "门票折扣必须在0.00-1.00之间"
				return false;
			}
		}
		if (ticketTypeList.length < 4) {
			msgRef.current = "门票折扣填写不完整"
			return false;
		}
		return true;
	}
	//门票类型输入框处理函数
	const checkInputTicket = (e: any) => {

		const { name, value } = e.target;
		let obj: TicketTypeProps = {
			id: '',
			scenicId: '',
			ticketType: name,
			discountRate: value === "" ? 0.0 : parseFloat(value)
		}
		let tag = false;
		for (let k = 0; k < ticketTypeList.length; k++) {
			if (ticketTypeList[k].ticketType === name) {
				ticketTypeList[k] = obj;
				tag = true;
				break;
			}
		}
		if (!tag) {
			ticketTypeList.push(obj);
		}
		isValidForTicket();
		updateView()
		console.log(ticketTypeList)
	}
	const saveTicketByScenicId = (scenicId: string) => {
		isSucces.current = false;
		if (scenicId != null) {
			for (let k = 0; k < ticketTypeList.length; k++) {
				ticketTypeList[k].scenicId = scenicId;
				console.log(ticketTypeList[k])
			}
			axios.post("/scenics/scenicTicket", ticketTypeList).then((data) => {
				console.log(data)
				reqRef.current = "请求处理成功";
				isSucces.current = true;
				updateView();
			}).catch(e => {
				console.log(e)
				reqRef.current = "服务器异常";
				updateView();
			})
		} else {
			reqRef.current = "请求处理异常";
			updateView()
		}
	}
	//完成请求
	const finishTask = (e: any) => {
		reqRef.current = ''
		isSucces.current = false;
		let ans = false;
		ans = isValid();
		scenicInput.scenicImg = imgRef.current.src;
		if(!(isValid() && isValidForTicket() &&  scenicInput.scenicImg !== "")){
			updateView();
			return;
		}
		console.log("scenic========",scenicInput)
		console.log("ticket========",ticketTypeList)
		if (ans) {
			let obj = scenicInput;
			obj.closeTime += ":00";
			obj.openTime += ":00";
			console.log(obj)
			axios.post("/scenics/scenic", obj).then((data: any) => {
				let scenicObj = data as ScenicProp;
				saveTicketByScenicId(scenicObj?.id)
			}).catch((e) => {
				reqRef.current = "请求处理失败"
				updateView();
			})
		}

	}
	let obj = useRef<ScenicProp>({
		closeTime: "18:48:00",
		fee: 12,
		id: '',
		openTime: "16:49:00",
		remainSize: 5000,
		scenicDiscription: "三生三世",
		scenicImg: "",
		scenicName: "想学习",
		ticketSize: 20000
	})
	const sendReq = () => {
		reqRef.current = "";
		isSucces.current=false;
		console.log(obj.current)
		obj.current.scenicImg = imgRef.current.src;
		axios.post("/scenics/scenic", obj.current).then((data:any) => {
			//如果后端返回null，则e.data为""
			if(data===""){
				reqRef.current="请求失败"
			}else{
				console.log(data)
				reqRef.current = "请求成功";
				isSucces.current=true;
			}
			updateView();

		}).catch(e => {console.log(e)
			reqRef.current="请求发生异常"
			updateView();
		})
		
		// console.log(isNaN(Number(aaa)));
		// const bbb:string = "123425"
		// console.log(isNaN(Number(bbb)))
	}
	const sendReqForTicketTest = () => {
		let scenicId = '100000000';
		saveTicketByScenicId(scenicId);
	}
	const closeCallback = (e:any)=>{
		reqRef.current="";
		updateView()
		if(isSucces.current){
			//重新加载
			//window.location.reload();
			window.location.href="/home/scenic";
		}
	}
	const testNumber=()=>{
		//长度17的数字，在js中丢失精度问题，得到的结果是不确定的
		let a1:number = 202101030041072819;
		console.log(a1);
		//202101030041072830
		let a2:string = "202101030041072819";
		console.log(parseInt(a2))
		//202101030041072830
	
		//长度17
		let b1:number = 205101030041072899;
		console.log(b1)
		//205101030041072900
		let b2:string = "205101030041072899"
		console.log(parseInt(b2));
		//205101030041072900
	}
	return (
		<div>
			{/* <button onClick={testNumber}>测试数字</button> */}
			{/* <button onClick={() => {
				sendReq()
			}}>测试Scenic请求
			</button>
			<button onClick={() => {
				sendReqForTicketTest()
				// sendReq()
			}}>测试Ticket请求
			</button> */}
			<table className="edit_table">
				<tbody>
					<tr>
						<th>景点名称</th>
						<td><input type="text" value={scenicInput.scenicName} name="scenicName" placeholder="不能超过64个字符" onChange={checkInput} /></td>
					</tr>
					<tr>
						<th>开放时间</th>
						<td><input type="time" value={scenicInput.openTime} name="openTime" pattern="[0-9]{2}:[0-9]{2}:00" onChange={checkInput} />~
						<input type="time" value={scenicInput.closeTime} name="closeTime" onChange={checkInput} /></td>
					</tr>
					<tr>
						<th>标准费用</th>
						<td><input type="number" min="0" max="10000" placeholder="0~10000" value={scenicInput.fee} name="fee" onChange={checkInput} /></td>
					</tr>
					<tr>
						<th>门票容量</th>
						<td><input type="number" placeholder="0-300000" value={scenicInput.ticketSize} name="ticketSize" onChange={checkInput}></input></td>
					</tr>
					<tr>
						<th>门票折扣</th>
						<td>
							<ul>{
								ticketTypeRef.current.map((name, index) => (
									<li key={index}>{name}&nbsp;<input name={name} type="number" placeholder="0.0~1.0" max="1" min="0" step="0.01" onChange={checkInputTicket}></input></li>
								))
							}
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
			{msgRef.current !== "" && <p style={{ color: 'red' }}>{msgRef.current}</p>}
			<div>
				<h4>景点介绍</h4>
				<textarea style={{ width: '640px', height: '240px' }} name="scenicDiscription" value={scenicInput.scenicDiscription} onChange={checkInput}></textarea>
				<h4>
					<b>图片上传</b><input type="file" name="imgFile" onChange={changeImg} style={{ color: 'blue' }}></input>
				</h4>
				<img src={imgRef.current.src} alt="" style={{ display: imgRef.current.src === '' ? 'none' : 'block', width: imgRef.current.width, height: imgRef.current.height }}></img>
			</div>
			<div><button onClick={finishTask} className="action_btn">完成添加</button></div>
			{ reqRef.current!=="" && <Popbox msg={reqRef.current} closeCallback={closeCallback}/>}
		</div>
	);
}

export default Addition;