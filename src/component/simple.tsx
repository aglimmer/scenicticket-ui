
import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import Home from './home';
 
const Simple:React.FC=()=>{
    console.log('simple............')
		return(
			<div style={{
				// width:'200px',
				// height:'80px',
				backgroundColor:'red',
				fontSize:'24px',
				textAlign:'center'
				}}
				
				>This is child child..............
				 <NavLink to="/home">å›žåˆ°Home</NavLink>
			</div>
		);
}
 
export default Simple;