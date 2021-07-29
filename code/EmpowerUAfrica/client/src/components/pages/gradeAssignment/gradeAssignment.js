import React, { Component } from 'react'; 
import Utils from '../../../utils';
import './gradeAssignment.css';
import AssignmentSubmission from '../../components/assignmentSubmission/assignmentSubmission';


export default class gradeAssignment extends Component{

    state = {
        assignmentURL: 'https://cmsweb.utsc.utoronto.ca/cscc01s21/project/AfricanImpactChallenge.pdf',
        id: null,
        showLateSubmissions: false 
    }

    switchStudent = () => {
        this.setState({
            assignmentURL: 'another url'
        })
    }

    getSubmissions = async () => {
        let res, body; 
        // TODO: ajax
        // Fake data
        
        body = {
        }
        return body; 
    }

    async componentDidMount() {
        // Get deliverable id from url
        const { id } = this.props.match; 
        const submissions = await this.getSubmissions(); 
        this.setState({
            id
        }); 
    }

    render() {
        if (this.state.id === null) {
            return null; 
        }
        const {assignmentURL} = this.state;
        const studentInfo = {
            students: ["student1", "student2", "student3", "student4", "student4", "student4", "student4", "student4", "student4", "student4", "student4", "student4"]
        }
        
        let students = studentInfo.students.map( 
            student => <div className='switch_student_single ungraded late' onClick={this.switchStudent}>{student}</div>
        )

        return (
            <div className="grade_assignment_page">
                <div className='grade_assignment_form'>
                    <div className="grad-deliverable-info">
                        <h1>Deliverable Name</h1>
                        <div className="grade-deliverable-description">
                            <p>Description!</p>
                        </div>
                        <h3>Due: 1970-01-01 00:00</h3>
                        <hr />
                    </div>
                    <div>
                        <h1>Submssions</h1>
                        <p style={{fontSize: '1.1em'}}>Show late submissions<input type="checkbox"></input></p>
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