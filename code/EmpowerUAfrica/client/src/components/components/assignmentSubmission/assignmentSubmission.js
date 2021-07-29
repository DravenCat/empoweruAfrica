import React, { Component } from 'react'; 
import './assignmentSubmission.css';

// This component is a tag button
/**
 *  @prop {object} submission: holds all the information of the submission. 
 *  @prop {object} deliverable: holdsa all the information of the deliverable. 
 */
export default class AssignmentSubmission extends Component{

    submit = async() => {

    }

    render() {
        const {assignmentURL} = this.props;

        return (
            <div className="assignmentSubmission_component">
                    <iframe id="embedded_file_window" src={assignmentURL} title="embedded file browser" frameborder="0"></iframe>
                    <span></span>
                <br />
                <div>

                <table className='grade_section'>
                    <colgroup>
                        <col style={{width: '20%'}}></col>
                        <col style={{width: '80%'}}></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <h3 style={{alignItems: 'top'}}>Score</h3>
                            </td>
                            <td>
                                <input id="grade_score" type='number'></input><span> / 20.4</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Comment</h3>
                            </td>
                            <td>
                                <textarea id="grade_comment"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button id='confirm_grade'>Confirm</button>

                </div>
            </div>
        )
    }
}