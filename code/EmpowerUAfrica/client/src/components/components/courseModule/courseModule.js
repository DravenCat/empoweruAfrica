import React, { Component} from 'react'; 
import { Reading, Video, Deliverable } from '../courseModuleContent/courseModuleContent';
import CreateMaterial from '../../pages/createMaterial/createMaterial';
import './courseModule.css';

/*
    props:
        - view: 'teacher' | 'student'
        - module: object
*/


export default class CourseModule extends Component{

    state = {
        expand: true,
        createMaterial: false,
        editModule: false
    }

    toggleExpand = () => {
        this.setState({
            expand: !this.state.expand
        }); 
    }

    expandCreateMaterialPanel = () => {
        this.setState({
            createMaterial: true
        })
    }
    collapseCreateMaterialPanel = () => {
        this.setState({
            createMaterial: false
        })
    }

    editModule = () => {
        this.setState({
            editModule: true 
        }); 
    }
    discardEditModule = () => {
        this.setState({
            editModule: false 
        }); 
    }

    render() {
        const { expand, createMaterial, editModule } = this.state; 
        const { view, courseModule } = this.props; 
        const contents = courseModule.contents.map(
            content => {
                switch (content.type) {
                    case 'reading': return <Reading content={content} key={content.id}/>;
                    case 'video': return <Video content={content} key={content.id}/>;
                    case 'deliverable': return <Deliverable content={content} key={content.id}/>; 
                    default: return <></>
                }
            }
        ); 

        return (
            <div className="module_deliver">
                <div style={{cursor: 'pointer'}}>
                    <div onClick={this.toggleExpand}>
                        
                        {
                            editModule === true? 
                            <EditModule collapse={this.discardEditModule}/>
                            :
                            <>
                            <h2>{courseModule.name}</h2>
                            {
                                view === 'instructor'? 
                                <img 
                                alt="edit module" 
                                src="/icons/edit.png"
                                className="edit-module-icon"
                                onClick={(event) => {this.editModule(); event.stopPropagation()}}
                                ></img>: null
                            }
                            </>
                            
                        }
                        <button  className="toggle-expand-btn">
                            <div className={expand===true? 'triangle-left': 'triangle-down'}>

                            </div>
                        </button>
                    </div>
                </div>
                
                {expand === true ?
                    <div className='module_content'>
                        {contents}
                        { view === 'student' ? null :
                            createMaterial === true ?
                            <CreateMaterial module={courseModule} collapse={this.collapseCreateMaterialPanel}/>:
                            <button onClick={this.expandCreateMaterialPanel} id='add_deliver'>
                                +
                            </button>
                        }
                    </div>:
                    null
                    
                }
            </div>
        )
        
    }
}

class EditModule extends Component {
    render() {
        return (
            <div className="edit-module" onClick={(event)=> {event.stopPropagation()}}>
                <table style={{width: '100%', textAlign: 'right'}}>
                    <colgroup>
                        <col style={{width: '60%'}}></col>
                        <col style={{width: '20%'}}></col>
                        <col style={{width: '20%'}}></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <input placeholder="New Module Name" id="edit-module-name"></input>
                            </td>
                            <td>
                                <button 
                                className="cancel-btn"
                                onClick={this.props.collapse}
                                >
                                    <h2>Discard</h2>
                                </button>
                            </td>
                            <td>
                                <button 
                                className="confirm-btn"
                                onClick={this.submitNewModule}
                                >
                                    <h2>Done</h2>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>  
            </div>
        ); 
    }
}