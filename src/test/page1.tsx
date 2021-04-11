import React from 'react';
import { Link } from 'react-router-dom';
 
const Page1:React.FC=()=>{
    console.log('Page1............')

		return(
			<div style={{
				// width:'200px',
				// height:'80px',
				backgroundColor:'pink',
				fontSize:'24px',
				textAlign:'center'
				}}
				>This is Page1!
                <Link to="/child">?????</Link>
			</div>
		);
}
 
export default Page1;