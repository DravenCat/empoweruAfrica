import React, { Component} from 'react'; 
import './myCourse.css';
import CourseOverview from '../../components/courseOverview/courseOverview';




export default class MyCourses extends Component{
    state = {

    }
    getMyCourses = async () => {
        // TODO: ajax
        let myCourses = [
            {
                "instructor": "Dr. A", 
                "name": "Introduction to Software Engineering",
                "description": "This course will teach you how to become a software engineer. ",
                "enrolled": true
            }, 
            {
                "instructor": "Dr. A", 
                "name": "Introduction to software",
                "description": "This course will teach you how to become a software engineer. ",
                "enrolled": true
            }
        ]
        return myCourses; 
    }
    async componentDidMount() {
        const courses = await this.getMyCourses();
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
            <div className="myCourse">
                
                <div>
                    <h2>
                        My Courses
                    </h2>
                </div>

                <div className='course_enrol clearfix'>
                    {courses}
                </div>
            
            </div>
        )
        
    }
}