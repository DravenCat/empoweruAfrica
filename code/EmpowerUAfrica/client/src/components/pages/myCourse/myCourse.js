import React, { Component} from 'react'; 
import './myCourse.css';
import CourseOverview from '../../components/courseOverview/courseOverview';




export default class startToLearn extends Component{
    render() {

        return (
            <div className="myCourse">
                
                <div>
                    <h2>
                        My Courses
                    </h2>
                </div>

                <div className='course_enrol clearfix'>
                    <CourseOverview />
                    <CourseOverview />
                    <CourseOverview />
                    <CourseOverview />
                    <CourseOverview />
                    <CourseOverview />
                </div>
            
            </div>
        )
        
    }
}