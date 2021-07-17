import React, { Component} from 'react'; 
import Utils from '../../../utils';
import './courseOverview.css';

const editCourseURL = '/learning/editCourse'; 

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
        const isAdmin = Utils.isAdmin(); 

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
                    {
                        isAdmin === true? 
                            <button
                            className="drop-btn">
                                Edit
                            </button>:
                            null
                    } 
                </div>
                <p>Instructor: {course.instructor}</p>
                <p>{course.description}</p>
                <span className='mask'></span>
            </div>
        )
        
    }
}