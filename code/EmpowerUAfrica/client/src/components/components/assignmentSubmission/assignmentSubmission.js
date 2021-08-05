import React, { Component } from 'react'; 
import './assignmentSubmission.css';

/**
 *  @prop {object} submission: holds all the information of the submission. 
 *  @prop {object} deliverable: holdsa all the information of the deliverable. 
 */
export default class AssignmentSubmission extends Component{

    state = {
        grade: null,
        comment: null,
        submission: null
    }

    submit = async() => {

    }

    componentDidMount = () => {
        this.setState({
            submission: this.props.submission
        }); 
    }

    render() {

        const {submission, deliverable, getControlFunc} = this.props; 
        const controlFuncs = getControlFunc(); 

        return (
            <div className="assignmentSubmission_component">
                    <iframe id="embedded_file_window" src={submission.media} title="embedded file browser" frameBorder="0"></iframe>
                    <span></span>
                <br />
                <div>
                <div className="submission-content-p">
                    <p>{submission.content}</p>
                </div>
                <table className='grade_section'>
                    <colgroup>
                        <col style={{width: '15%'}}></col>
                        <col style={{width: '60%'}}></col>
                        <col style={{width: '25%'}}></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <h3 style={{alignItems: 'top'}}>Score</h3>
                            </td>
                            <td>
                                <input id="grade_score" type='number' max={deliverable.totalPoints} onChange={controlFuncs.makeChange}>
                                </input>
                                <span> / {deliverable.totalPoints}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Comment</h3>
                            </td>
                            <td>
                                <textarea id="grade_comment" onChange={controlFuncs.makeChange}></textarea>
                            </td>
                            <td className="grading-buttons">
                                <button onClick={controlFuncs.switchToPrevious}>Previous Submission</button>
                                <button>Submit Feedback</button>
                                <button>Submit and Move to Next</button>
                                <button onClick={controlFuncs.switchToNext}>Next Submission</button>
                                <button>Discard Feedback</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
}