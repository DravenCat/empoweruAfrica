import React, { Component} from 'react'; 
import './createMaterial.css';

const supportedReadingFormat = ['txt', 'md', 'pdf'];

export default class CreateMaterial extends Component{
    state = {
        type: 'reading'
    }

    setInputType = () => {
        const newType = document.getElementById('create-material-type-select').value; 
        this.setState({type: newType}); 
    }

    render() {
        const { type } = this.state; 
        let contentUpload = null;
        
        switch (type) {
            case 'reading': 
                contentUpload =
                <>
                    <h2>Reading file: </h2>
                    <input type="file"></input>
                </>;
                break;
            case 'video':
                contentUpload =
                <>
                    <h2>YouTube link: </h2>
                    <input type="text"></input>
                </>;
                break;
            case 'deliverable':
                contentUpload =
                <>
                    <h2>Deadline: </h2>
                    <input type="datetime-local"></input>
                </>;
                break;
            default: 
                contentUpload =  <></>;
        }

        return (
            <div className="addDeliver">
                
                <div>
                    <h2>Name</h2>
                    <input type='text'></input>
                </div>

                <div style={{marginTop: '.7em'}}>
                    <h2>Type</h2>
                    <select onInput={this.setInputType} id="create-material-type-select">
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
                        <textarea>

                        </textarea>     
                    </div>
                </div><br />
                
                <div className="create-material-content">
                    {contentUpload}
                </div><br />

                <div className="create-material-footer">

                    <button
                    className='discard-btn'>Discard</button>

                    <button 
                    id='create-material-submit-btn' 
                    className='submit-btn'>Submit</button>
                </div>
                

            
            </div>
        )
        
    }
}