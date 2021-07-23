import React, { Component} from 'react'; 
import './createMaterial.css';

const supportedReadingFormat = ['txt', 'md', 'pdf'];

export default class CreateMaterial extends Component{
    state = {
        type: 'reading'
    }

    setInputType = () => {
        const { id: moduleId } = this.props.module; 
        const newType = document.getElementById(`${moduleId}-new-content-type`).value; 
        this.setState({type: newType}); 
    }

    discard = () => {
        this.props.collapse(); 
    }
    submit = () => {

    }

    render() {
        const { type } = this.state; 
        const { id: moduleId } = this.props.module; 
        let contentUpload = null;
        
        switch (type) {
            case 'reading': 
                contentUpload =
                <>
                    <h2>Reading file: </h2>
                    <input type="file" id={`${moduleId}-new-reading-file`}></input>
                </>;
                break;
            case 'video':
                contentUpload =
                <>
                    <h2>YouTube link: </h2>
                    <input type="text" id={`${moduleId}-new-video-link`}></input>
                </>;
                break;
            case 'deliverable':
                contentUpload =
                <>
                    <h2>Deadline: </h2>
                    <input type="datetime-local" id={`${moduleId}-new-deliverable-due`}></input>
                </>;
                break;
            default: 
                contentUpload =  <></>;
        }

        return (
            <div className="addDeliver">
                
                <div>
                    <h2>Name</h2>
                    <input type='text' id={`${moduleId}-new-content-name`}></input>
                </div>

                <div style={{marginTop: '.7em'}}>
                    <h2>Type</h2>
                    <select onInput={this.setInputType} id={`${moduleId}-new-content-type`}>
                        <option key="reading" value="reading">Reading</option>
                        <option key="video" value="video">YouTube Video</option>
                        <option key="deliverable" value="deliverable">Deliverable</option>
                    </select>
                </div>

                <div style={{marginTop: '.7em'}}>
                    <h2>Description</h2>
                </div>
                <div>
                    <div>
                        <textarea id={`${moduleId}-new-content-description`}>

                        </textarea>     
                    </div>
                </div><br />
                
                <div className="create-material-content">
                    {contentUpload}
                </div><br />

                <div className="create-material-footer">

                    <button
                    className='discard-btn' onClick={this.discard}>Discard</button>

                    <button 
                    id='create-material-submit-btn' 
                    className='submit-btn' onClick={this.submit}>Submit</button>
                </div>
                

            
            </div>
        )
        
    }
}