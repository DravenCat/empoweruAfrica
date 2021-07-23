import React, { Component } from 'react'; 
import './gradeAssignment.css';
import AssignmentSubmission from '../../components/assignmentSubmission/assignmentSubmission';


export default class gradeAssignment extends Component{

    state = {
        assignmentURL: 'https://cmsweb.utsc.utoronto.ca/cscc01s21/project/AfricanImpactChallenge.pdf'
    }

    switchStudent = () => {
        this.setState({
            assignmentURL: 'another url'
        })
    }

    render() {

        const {assignmentURL} = this.state;
        const studentInfo = {
            students: ["student1", "student2", "student3", "student4", "student4", "student4", "student4", "student4", "student4", "student4", "student4", "student4"]
        }
        
        let students = studentInfo.students.map( 
            student => <div className='switch_student_single' onClick={this.switchStudent}>{student}</div>
        )

        return (
            <div className="grade_assignment_page">
                <div className='grade_assignment_form'>
                    <div>
                        <h1>Submssions</h1>
                        <div className='switch_student'>
                            {students}
                        </div>
                    </div>

                    <div>
                        <AssignmentSubmission assignmentURL={assignmentURL}/>
                    </div>
                    
                </div>
            </div>
        )
    }
}