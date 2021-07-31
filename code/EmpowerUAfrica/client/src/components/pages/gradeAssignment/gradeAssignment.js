import React, { Component } from 'react'; 
import Utils from '../../../utils';
import './gradeAssignment.css';
import AssignmentSubmission from '../../components/assignmentSubmission/assignmentSubmission';


export default class gradeAssignment extends Component{

    state = {
        assignmentURL: 'https://cmsweb.utsc.utoronto.ca/cscc01s21/project/AfricanImpactChallenge.pdf',
        id: null,
        submissions: null,
        deliverable: null, 
        showLate: false,
        showOnlyLatest: true
    }

    setShowLate = () => {
        this.setState({
            showLate: document.getElementById('show-late').checked
        })
    }
    setOnlyShowLatest = () => {
        this.setState({
            showOnlyLatest: document.getElementById('show-only-latest').checked
        })
    }

    switchStudent = () => {
        this.setState({
            assignmentURL: 'another url'
        })
    }

    getDeliverableInfo = async () => {
        const { id: deliverableId } = this.props.match; 
        // TODO: ajax
        // Fake data
        let deliverable = {
            name: "Assignment 1",
            description: "Do this",
            due: 4000
        }
        
        return deliverable; 
    }

    getSubmissions = async () => {
        // TODO: ajax
        // Fake data
        
        let submissions = {
            onTime:[
                {
                    username: 'user1',
                    posted: 114514,
                },
                {
                    username: 'user2',
                    posted: 114514,
                    grade: 1919
                },
                {
                    username: 'user2',
                    posted: 114513
                },
                {
                    username: 'user4',
                    posted: 114514,
                    grade: 1919
                }
            ],
            late:[
                {
                    username: 'user5',
                    posted: 1919810
                },
                {
                    username: 'user6',
                    posted: 1919810
                },
                {
                    username: 'user7',
                    posted: 1919810,
                    grade: 514
                }
            ]
        }
        return submissions; 
    }

    componentDidMount = async () => {
        // Get deliverable id from url
        const { id } = this.props.match; 
        const [ submissions, deliverable ] = await Promise.all([this.getSubmissions(), this.getDeliverableInfo()]); 
        console.dir(submissions);
        this.setState({
            id,
            submissions,
            deliverable
        }); 
    }

    filterVisibleSubmissions = (submissions, showLate, showOnlyLatest) => {
        let visibleSubmissions = []; 
        let allSubmissions = [...submissions.onTime]; 

        if (showLate) {
            allSubmissions = [...allSubmissions, ...submissions.late]; 
        }

        if (showOnlyLatest) {
            // Leave only latest submission of a user
            let usernameToLatestSubmission = {}; 
            // username -> its latest submission (so far)
            for (const submission of allSubmissions) {
                const username = submission.username; 
                if ( !(username in usernameToLatestSubmission)) {
                    usernameToLatestSubmission[username] = submission; 
                }
                else {
                    if (usernameToLatestSubmission[username].posted < submission.posted) {
                        usernameToLatestSubmission[username] = submission; 
                    }
                }
            }
            
            // Collect every user's latest submission into visibleSubmission 
            for (const username in usernameToLatestSubmission) {
                visibleSubmissions.push(usernameToLatestSubmission[username]); 
            }
        }
        else {
            visibleSubmissions = allSubmissions; 
        }
        visibleSubmissions.sort( (a, b) => a.posted - b.posted ); 
        return visibleSubmissions; 
    }

    renderSwitchStudent() {
        const { submissions, deliverable, showLate, showOnlyLatest } = this.state;

        let visibleSubmissions = this.filterVisibleSubmissions(submissions, showLate, showOnlyLatest); 
        
        console.log(visibleSubmissions); 

    }

    render() {
        if (this.state.deliverable === null) {
            return null; 
        }
        const {assignmentURL} = this.state;
        
        let students = this.renderSwitchStudent(); 

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
                        <p style={{fontSize: '1.1em'}}></p>
                        <p style={{fontSize: '1.1em'}}>
                            <span><input onInput={this.setShowLate} type="checkbox" id="show-late"></input>Show late submissions</span><br />
                            <span><input onInput={this.setOnlyShowLatest} type="checkbox" id="show-only-latest"></input>Show only latest submission</span>
                        </p>
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
