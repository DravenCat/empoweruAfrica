import React, { Component} from 'react'; 
import './addCourse.css';




export default class addCourse extends Component{
 
    render() {

        return (
            <div className="add_course">
                
                <div className='add_course_form'>
                    <div>
                        <h2>Course Name</h2>
                        <input type='text'></input>
                    </div>

                    <div>
                        <h2>Instructor Name</h2>
                        <input type='text'></input>
                    </div>

                    <div>
                        <h2>Description</h2>
                        <textarea>

                        </textarea>
                    </div>

                    <div>
    
                        <button>
                            <h3>Discard</h3>
                            <span className='add_course_mask'></span>
                        </button>

                        <button>
                            <h3>Sumbit</h3>
                            <span className='add_course_mask'></span>
                        </button>

                    </div>
                </div>
            
            </div>
        )
        
    }
}