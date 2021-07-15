import React, { Component} from 'react'; 
import './courseContent.css';
import CourseModule from '../../components/courseModule/courseModule';


export default class courseModule extends Component{

    state = {
        courseContent: null
    }


    getCourseContent = async () => {
        const course_name = this.props.match.params.course_name; 
        // TODO: ajax
        // on 403: window.history.back()
        let courseContent = {
            "name": "Course Name", 
            "instructor": "username",
            "description": "course description",
            "modules": [
                {
                    "name": "First Week!", 
                    "id": "Masdfajsdf", 
                    "contents": [
                        {
                            "type": "reading",
                            "id": "R001",
                            "name": "lec01 reading",
                            "description": "Read this", 
                            "path": "https://cmsweb.utsc.utoronto.ca/cscc01s21/project/AfricanImpactChallenge.pdf" 
                        }, 
                        {
                            "type": "video", 
                            "id": "V001",
                            "name": "lec01 video" ,
                            "description": "Watch this If wandered relation no surprise of screened doubtful. Overcame no insisted ye of trifling husbands. Might am order hours on found. Or dissimilar companions friendship impossible at diminution. Did yourself carriage learning she man its replying. Sister piqued living her you enable mrs off spirit really. Parish oppose repair is me misery. Quick may saw style after money mrs. ", 
                            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        },
                        {
                            "type": "deliverable",
                            "id": "D001",
                            "name": "Assignment 1",
                            "description": "Do this", 
                            "due": 1626187198
                        }
                    ]
                }
            ]
        }
        return courseContent; 
    }

    async componentDidMount() {
        const courseContent = await this.getCourseContent(); 
        this.setState({
            courseContent
        });
    }

    render() {

        const teacherOrStudent = 'teacher';
        const { courseContent, view } = this.state; 

        if (courseContent === null) {
            return <></>
        }

        let modules = courseContent.modules.map( 
            courseModule => <CourseModule courseModule={courseModule} view={view} key={courseModule.id}/>
        )

        return (
            <div className="courseModule page">
                
                <div className="course_content_header">
                    <h1>
                        {courseContent.name}
                    </h1>
                    <div>
                        <p>
                            Instructor: {courseContent.instructor}
                        </p>
                        <p>
                            {courseContent.description}
                        </p>
                    </div>
                </div>

                {
                    teacherOrStudent === 'student' ? null :
                    <div className='courseModule_create_module'>
                        <input type='text' placeholder='Type in module name'></input>
                        <button>Create a module</button>
                    </div>
                }

                <div className='course_module'>
                    {modules}
                </div>
            
            </div>
        )
        
    }
}