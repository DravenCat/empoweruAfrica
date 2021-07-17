import { ExpectationFailed } from 'http-errors';
import React, { Component} from 'react'; 
import './addCourse.css';

const createCourseURL = '/learning/createCourse'; 
const startToLearnURL = '/start_to_learn';


export default class addCourse extends Component{
    state = {
        error: null,
        mode: 'create',
        courseName: null
    }
    discard = () => {
        if (!window.confirm('Discard current input? ')) {
            return; 
        }
        window.location.href = startToLearnURL;
    }
    submit = async () => {
        const name = document.getElementById('new-course-name').value;
        const instructor = document.getElementById('new-course-instructor').value;
        const description = document.getElementById('new-course-description').value;
        const { mode } = this.state; 
        let method; 

        if (name.length === 0 || instructor.length === 0 || description.length === 0) {
            return; 
        }
        if (mode === 'create') {
            method = 'PUT';
        }
        else if (mode === 'edit') {
            method = 'POST';
        }
        else {
            return; 
        }

        let res;
        try {
            res = await fetch(
                createCourseURL,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name,
                        instructor,
                        description
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
        catch (err) {
            console.error(err);
            alert('Internet Failure'); 
        }
        let body = await res.json(); 
        if (res.ok) {
            window.location.href = startToLearnURL;
        }
        else {
            this.setState({
                error: body.message
            })
        }
    }

    componentDidMount() {
        let mode;
        if (this.props.match !== undefined) {
            mode = 'edit';
        } else {
            mode = 'create';
        }
        this.setState({mode}); 
    }
 
    render() {
        let mode; 
        let courseName = null; 
        if (this.props.match !== undefined) {
            mode = 'edit';
            courseName = this.props.match.params.course_name; 
        } else {
            mode = 'create';
        }
        return (
            <div className="add_course page">
                <div className='add_course_form'>
                    <h1>
                        {
                            mode === 'create'? 
                                <>Create New Course</>:
                                <>Edit Course</>
                        }
                    </h1><br />
                    <span className="warningMsg">{this.state.error}</span>
                    <div>
                        <h2>Name</h2>
                        {
                            mode === 'create'? 
                            <input type='text' id="new-course-name"></input>:
                            <input type='text' id="new-course-name" value={courseName} disabled></input>
                        }
                        <br />
                        <span>
                            This will be used as the unique identifier of the course and cannot be changed later. 
                        </span>
                    </div>
                    <hr />
                    <div>
                        <h2>Instructor</h2>
                        <input type='text' id="new-course-instructor"></input><br />
                        <span>Username of the course instructor</span>
                    </div>
                    <hr />
                    <div>
                        <h2>Description</h2>
                        <textarea id="new-course-description">

                        </textarea>
                    </div>

                    <div className="create-course-footer">
                        <button onClick={this.discard}>
                            <h3>Discard</h3>
                            <span className='add_course_mask'></span>
                        </button>

                        <button onClick={this.submit}>
                            <h3>Sumbit</h3>
                            <span className='add_course_mask'></span>
                        </button>

                    </div>
                </div>
            
            </div>
        )
        
    }
}