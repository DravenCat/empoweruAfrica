import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import './calendar.css'

export default class calendar extends Component {

    state = {
        events: [
            { title: 'event 1 12:50', date: '2021-07-28' },
            { title: 'event 2', date: '2021-07-29' },
            { title: 'event 3', date: '2021-07-14' }
        ]
    }

    render() {

        const {events} = this.state

        return (
            <div className='calendar_page'>

                <div className='calendar_body'>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView="dayGridMonth"
                        events={{events}}
                    />
                </div>

            </div>
        )
    }
}
