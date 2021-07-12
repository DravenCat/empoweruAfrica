import React, { Component} from 'react'; 
import './courseModule.css';
import ModuleDeliver from '../../components/moduleDeliver/moduleDeliver';




export default class courseModule extends Component{

    render() {

        const courseName = 'Some course';
        const teacherOrStudent = 'teacher';

        return (
            <div className="courseModule">
                
                <div>
                    <h2>
                        {courseName}
                    </h2>
                </div>

                {
                    teacherOrStudent == 'student' ? null :
                    <div className='courseModule_create_module'>
                        <input type='text' placeholder='Type in module name'></input>
                        <button>Create a module</button>
                    </div>
                }

                <div className='course_module'>
                    <ModuleDeliver type='teacher'/>
                    <ModuleDeliver type='teacher'/>
                    <ModuleDeliver type='teacher'/>
                    <ModuleDeliver type='teacher'/>
                </div>
            
            </div>
        )
        
    }
}