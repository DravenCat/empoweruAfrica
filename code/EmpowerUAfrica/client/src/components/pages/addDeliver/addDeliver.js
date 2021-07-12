import React, { Component} from 'react'; 
import './addDeliver.css';




export default class addDeliver extends Component{
    render() {

        return (
            <div className="addDeliver">
                
                <div>
                    <h2>Material Title</h2>
                    <input type='text'></input>
                </div>

                <div>
                    <h2>Material Type</h2>
                    <label>Video</label>
                    <input type='radio' name='type'></input>
                    <label>Reading</label>
                    <input type='radio' name='type'></input>
                    <label>Assignment</label>
                    <input type='radio' name='type'></input>
                </div>

                <div>
                    <h2>Description</h2>
                </div>
                <div>
                    <div>
                        <textarea>

                        </textarea>     
                    </div>
                </div>

                <div>
                    <button>Choose File</button>
                    <button>Confirm</button>
                </div>

            
            </div>
        )
        
    }
}