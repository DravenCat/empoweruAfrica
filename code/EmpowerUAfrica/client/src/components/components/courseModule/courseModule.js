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
        createMaterial: false
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

    render() {
        const { expand, createMaterial } = this.state; 
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
                        <h2>{courseModule.name}</h2>
                        {/* replace down with a down arrow */}
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
                            <button onClick={this.expandCreateMaterialPanel} id='add_deliver'>
                                +
                            </button>
                        }
                        {
                            createMaterial === true ?
                            <CreateMaterial />:
                            null
                        }
                    </div>:
                    null
                    
                }
            </div>
        )
        
    }
}