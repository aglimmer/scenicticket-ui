
import React, { useEffect, useState } from 'react';
import "./index.css"
 //在body中追加一个窗口，3s后消除
 const ConfirmBox: React.FC<{confirmResponse:Function}> = (props) => {
	const {confirmResponse} = props;
	// const MStyle = {show:"pop_confirm",unShow:"unpop_confirm"}
	// const [popStyle,setPopStyle] = useState(MStyle.show)
	
    const changeSelect=(e:any)=>{
        console.log(e)
		console.log(e.target.name)
		let name = e.target.name;
		//返回boolean类型，true表示确定
		confirmResponse(name==="yes")
	}
	
	return (
		<div className="pop_confirm">
            <label className="tip_title">你确定要执行以下操作吗？</label>
			<button name="yes" className="action_ack_btn" onClick={changeSelect}>确定</button>
            <button name="no" className="action_cancel_btn" onClick={changeSelect}>取消</button>
		</div>
	)
}
export default ConfirmBox;