import logo from '../Images/main_logo.svg'
import React from 'react'

export default function Header(){
    return (
        <div className="Header">
            <img src={logo}  alt="logo" width={300} 
            style={{
                paddingBottom: '25px',
                paddingLeft: '25px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'    
            }}/>
        </div>
    );
}