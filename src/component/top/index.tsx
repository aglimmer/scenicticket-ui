import React from 'react'
import './top.css'
import topImg from './top.jpg'
const Top:React.FC=()=>{
    return (
        <img className="top" src={topImg} alt='无法获取图片'></img>
    )
}
export default Top;