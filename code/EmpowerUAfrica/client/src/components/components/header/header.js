import React from 'react';
import './header.css';

const Header = (props) => {

    return (
        <div className="header">
            <span style={{fontSize:30, padding:60}}>EmpowerU Arica</span>
            <span style={{fontSize:15, padding:60}}>Community</span>
            <span style={{fontSize:15, padding:60}}>Start to Learn</span>
            <span style={{fontSize:15, padding:60}}>Calendar</span>
        </div>
    )

};

export default Header;



