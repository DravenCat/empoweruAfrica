import React, { Component} from 'react'; 
import './startToLearn.css';
import CourseOverview from '../../components/courseOverview/courseOverview';




export default class startToLearn extends Component{
    state = {

    }
    getAllCourses = async () => {
        let courses = [
            {
                "instructor": "Dr. A", 
                "name": "Introduction to Software Engineering",
                "description": "This course will teach you how to become a software engineer. ",
                "enrolled": true
            }, 
            {
                "instructor": "Dr. A", 
                "name": "Introduction to Web Design",
                "description": "This course will teach you how to build a website from scratch. "
            }, 
            {
                "instructor": "Dr. A", 
                "name": "Introduction to software",
                "description": "This course will teach you how to become a software engineer. ",
                "enrolled": true
            }, 
            {
                "instructor": "Dr. A", 
                "name": "Introduction to Software Engineering",
                "description": "This course will teach you how to become a software engineer. "
            }, 
            {
                "instructor": "Dr. A", 
                "name": "Introduction to Software Engineering",
                "description": "This course will teach you how to become a software engineer. "
            }
        ]
        return courses; 
    
    }
    async componentDidMount() {
        const courses = await this.getAllCourses(); 
        this.setState({
            courses
        });
    }

    render() {
        if (this.state.courses === undefined) {
            return <></>
        }
        let courses = this.state.courses.map(course => <CourseOverview course={course} key={course.name}/>);

        return (
            <div className="start_to_learn">
                
                <div>
                    <h2>
                        All Courses
                    </h2>
                    <a href='/learning/my_courses'>
                        See my courses
                    </a>
                </div>

                <div className='course_enrol clearfix'>
                    {courses}
                </div>
            
            </div>
        )
        
    }
}