import React, { Component} from 'react'; 
import './startToLearn.css';
import CourseOverview from '../../components/courseOverview/courseOverview';




export default class startToLearn extends Component{
    render() {

        return (
            <div className="start_to_learn">
                
                <div>
                    <h2>
                        All Courses
                    </h2>
                    <a href='/start_to_learn/my_course'>
                        See my courses
                    </a>
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