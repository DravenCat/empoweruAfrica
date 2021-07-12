import React, { Component} from 'react'; 
import './courseOverview.css';





export default class courseOverview extends Component{
    render() {

        return (
            <div className="courseOverview">
                
                <a href='/courseModule'>
                    <div>
                        <h3>How to success</h3>
                        <button>Enrol</button>
                    </div>
                    <p>This course teaches you...</p>
                </a>
            
            </div>
        )
        
    }
}