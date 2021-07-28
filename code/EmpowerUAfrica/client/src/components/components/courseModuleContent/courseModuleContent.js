import React, { Component } from 'react'; 
import Utils from '../../../utils'; 
import './courseModuleContent.css';

/*
    props:
        - content
*/

const descAbbrivLen = 100; 
const deleteVideoURL = '/learning/deleteVideo';
const deleteDeliverableURL = '/learning/deleteDeliverable';
const deleteReadingURL = '/learning/deleteReading'; 

/**
 * 
 * @param {string} id    id of the content. 
 * @param {number} type  type of the content. 
 *    0: reading, 1: video, 2: deliverable
 * @returns 
 */
const deleteContent = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this content? ')) {
        return; 
    }
    let urls = [deleteReadingURL, deleteVideoURL, deleteDeliverableURL];
    let url = urls[type]; 
    if (url === undefined) {
        return; 
    }

    let res, body; 
    try {
        ({ res, body } = await Utils.ajax(
            url,
            {
                method: 'DELETE',
                body: JSON.stringify({
                    id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )); 
    }
    catch(err) {
        console.error(err); 
        alert('Internet Failure'); 
        return; 
    }
    if (!res.ok) {
        alert(body.message); 
        console.log(body); 
    }
    else {
        window.location.reload(); 
    }
}

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
                    <img 
                    alt="delete" 
                    className="icon" 
                    src="/icons/garbage.png" 
                    onClick={(event) => {deleteContent(reading.id, 0); event.stopPropagation()}}>
                    </img>
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

    openVideoInNewWindow = () => {
        window.open(`https://www.youtube.com/watch?v=${this.props.content.vid}`); 
    }

    render() {
        const video = this.props.content;
        const expand = this.state.expand; 
        const { source, vid } = video; 
        let embeddedVideo; 
        if (source === 'YouTube') {
            embeddedVideo = <iframe className="embedded-video"  src={`https://www.youtube.com/embed/${vid}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        }
        return (
            <div className="course-module-content">
                <div onClick={this.toggleExpand} style={{cursor: 'pointer'}}>
                    <h3 className="course-module-content-name">{video.name}
                    <img 
                    alt="delete" 
                    className="icon" 
                    src="/icons/garbage.png" 
                    onClick={(event) => {deleteContent(video.id, 1); event.stopPropagation()}}></img>
                    <button  className="toggle-expand-btn">
                        <div className={expand===true? 'triangle-left': 'triangle-down'}>

                        </div>
                    </button>
                    <button onClick={(e) => {this.openVideoInNewWindow(); e.stopPropagation()}}>Open in new window</button>
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
                    embeddedVideo:
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
                <h3 className="course-module-content-name">{deliverable.name}
                <img 
                    alt="delete" 
                    className="icon" 
                    src="/icons/garbage.png" 
                    onClick={(event) => {deleteContent(deliverable.id, 2); event.stopPropagation()}}></img>
                </h3>
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