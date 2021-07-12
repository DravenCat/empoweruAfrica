import React, { Component} from 'react'; 
import './moduleDeliver.css';





export default class moduleDeliver extends Component{

    state = {
        display: 'none'
    }

    displayContent = () => {
        const {display} = this.state;
        if (display == 'block') {
            this.setState({display: 'none'});
        } else {
            this.setState({display: 'block'});
        }
    }

    render() {
        const {display} = this.state;
        const {type} = this.props.type;

        return (
            <div className="module_deliver">
                <div>
                    <h2>Module</h2>
                    {/* replace down with a down arrow */}
                    <button onClick={this.displayContent}>down</button>
                </div>
                
                {display == 'none' ? null:
                    <div className='module_content'>
                        <div>
                            Youtube Video
                        </div>

                        <div>
                            Book
                        </div>

                        <div>
                            Assignment
                        </div>
                        { type == 'student' ? null :
                            <a href='/courseModule/add_deliver' id='add_deliver'>
                                +
                            </a>
                        }
                    </div>
                    
                }
            </div>
        )
        
    }
}