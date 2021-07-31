import React, { Component } from 'react'; 
import './submitAssignment.css';


export default class submitAssignment extends Component{
    render() {

        const courseInfo = {
            title: "Assignment title",
            description: "Assignment description"
        }

        return (
            <div className="sumbit_assignment_page">
                <div className='sumbit_assignment_form'>
                    <h1>
                        {courseInfo.title}
                    </h1>
                    <p>
                        {courseInfo.description}
                    </p>
                    <hr />

                    <table className='submit_file'>
                        <colgroup>
                            <col style={{width: '50%'}}></col>
                            <col style={{width: '50%'}}></col>
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <h3>Upload file to submit</h3>
                                </td>
                                <td>
                                    <input type="file" id='submit_file'></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="discard_assignment_btn">
                        <h3>Discard</h3>
                        <span className='sumbit_assignment_btn_mask'></span>
                    </button>
                        
                    <button className="sumbit_assignment_btn">
                        <h3>Submit</h3>
                        <span className='sumbit_assignment_btn_mask'></span>
                    </button>
                </div>
            
            </div>
        )
    }
}