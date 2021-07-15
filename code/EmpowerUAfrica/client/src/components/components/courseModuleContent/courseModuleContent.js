import React, { Component } from 'react'; 
import Utils from '../../../utils'; 
import './courseModuleContent.css';

/*
    props:
        - content
*/

const descAbbrivLen = 100; 

export class Reading extends Component {

    state = {
        expand: false
    }

    toggleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    render() {
        const reading = this.props.content; 
        const { expand } = this.state; 
        return (
            <div className="course-module-content">
                <div onClick={this.toggleExpand} style={{cursor: 'pointer'}}>
                    <h3 className="course-module-content-name">{reading.name}
                    
                    <button  className="toggle-expand-btn">
                        <div className={expand===true? 'triangle-left': 'triangle-down'}>
                            
                        </div>
                    </button>
                    <button onClick={(e) => {window.open(this.props.content.path); e.stopPropagation()}}>Open in new window</button>
                    </h3>
                    {
                        expand === true? 
                        <p className="course-content-full-description">{reading.description}</p>:
                        <span>{Utils.trimString(reading.description, descAbbrivLen)}</span>
                    }
                </div>
                <br />
                <div class="video-wrapper">
                {
                    expand === true? 
                    <iframe className="embedded-file-window" src={reading.path} title="embedded file browser" frameborder="0"></iframe>:
                    null
                }
                </div>
            </div>
        ); 
    }
}

export class Video extends Component {
    state = {
        expand: false
    }

    toggleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    render() {
        const video = this.props.content;
        const expand = this.state.expand; 
        const videoY2bId = 'dQw4w9WgXcQ'; 
        return (
            <div className="course-module-content">
                <div onClick={this.toggleExpand} style={{cursor: 'pointer'}}>
                    <h3 className="course-module-content-name">{video.name}
                    <button  className="toggle-expand-btn">
                        <div className={expand===true? 'triangle-left': 'triangle-down'}>

                        </div>
                    </button>
                    <button onClick={(e) => {window.open(this.props.content.path); e.stopPropagation()}}>Open in new window</button>
                    </h3>
                    {
                        expand === true? 
                        <p className="course-content-full-description">{video.description}</p>:
                        <span>{Utils.trimString(video.description, descAbbrivLen)}</span>
                    }
                </div>
                <br />
                <div class="video-wrapper">
                {
                    expand === true? 
                    <iframe className="embedded-video"  src={`https://www.youtube.com/embed/${videoY2bId}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>:
                    null
                }
                </div>
            </div>
        )
    }
}

export class Deliverable extends Component {
    render() {
        const deliverable = this.props.content; 
        const overdue = Math.round(Date.now() / 1000) > deliverable.due && !deliverable.submitted; 
        return (
            <div className="course-module-content">
                <h3 className="course-module-content-name">{deliverable.name}</h3>
                <span>{Utils.trimString(deliverable.description,descAbbrivLen)}</span><br />
                {
                    overdue === true? 
                    <span className="overdue">Due {Utils.timeStampToTime(deliverable.due)}</span>:
                    <span>Due {Utils.timeStampToTime(deliverable.due)}</span>
                }
                

            </div>
        )
    }
}