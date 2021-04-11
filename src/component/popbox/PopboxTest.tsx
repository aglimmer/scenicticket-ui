import React, { useCallback, useRef, useState } from 'react';
import Popbox from '.';
// import ConfirmBox from '.';

const PopboxTest: React.FC = () => {
	console.log('PopboxTest..............')
	const [view, updateView] = useState(false)
	const viewRef = useRef(view);
	//显示弹窗

	const openRef = useRef<boolean>(false)
	//点击，触发控制弹窗显示
	const popView = (e: any) => {
		openRef.current = true;
		viewRef.current = !viewRef.current;
		updateView(viewRef.current);
	}
	const closeCallback = useCallback(
		() => {
			openRef.current = false;
			viewRef.current = !viewRef.current;
			updateView(viewRef.current);
		}, [])

	return (
		<div>
			<button onClick={popView} >弹出</button>
			{openRef.current && < Popbox msg={"请求处理成功！"} closeCallback={closeCallback} />}
		</div>
	);

}
export default PopboxTest;