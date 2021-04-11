import React, { HtmlHTMLAttributes, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
const Simple: React.FC = () => {
    const [count,updateCount] = useState(0);
    //当参数第二个参数data改变时，第一个参数指向的函数会被调用
    // callBack可当做一个函数，能够被点击事件调用
    useEffect(() => {
       console.log()
       return unmount;
    }, [])
   
    const unmount=()=>{
        ReactDOM.unmountComponentAtNode(document.getElementById("abc") as HTMLElement)
    }
    return (
        <div>
            <div id="abc">测试</div>
            <button onClick={unmount}>点击卸载当前组件</button>
        </div>
    )
}
export default Simple