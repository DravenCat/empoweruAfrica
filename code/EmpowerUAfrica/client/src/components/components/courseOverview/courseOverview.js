import React, { Component} from 'react'; 
import './courseOverview.css';





export default class courseOverview extends Component{

    enrol = async (enrol) => {
        // TODO: ajax
        console.dir(enrol); 
    }

    gotoCoursePage = () => {
        let courseURL = '/learning/course/' + this.props.course.name; 
        window.location.href = courseURL;
    }

    render() {
        const course = this.props.course; 

        return (
            <div className="courseOverview" onClick={this.gotoCoursePage}>
                
                <div>
                    <h3>{course.name}</h3>
                    {
                        course.enrolled === true?
                            <button 
                            onClick={(event)=>{this.enrol(false); event.stopPropagation();}}
                            className="drop-btn"
                            >Drop
                            </button>:
                            <button 
                            onClick={(event)=>{this.enrol(true); event.stopPropagation();}}
                            className="enrol-btn"
                            >Enrol
                            </button>
                    }
                    
                </div>
                <p>Instructor: {course.instructor}</p>
                <p>{course.description}</p>
            
            </div>
        )
        
    }
}