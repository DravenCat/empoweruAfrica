import React, { Component} from 'react'; 
import './startToLearn.css';
import video from '../../../resource/icons/video.png'
import reading from '../../../resource/icons/reading.png'




export default class startToLearn extends Component{
    render() {

        return (
            <div className="start_to_learn">
                
                <div className="spliter clearfix">

                    <a className="video"  href='/start_to_learn/video'>
                        <img src={video} alt="video"/>
                        <span>Video</span>
                    </a>

                    <a className="reading"  href='/start_to_learn/video'>
                        <img src={reading} alt="video"/>
                        <span>Reading</span>
                    </a>

                </div>
            
            </div>
        )
        
    }
}