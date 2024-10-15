import { CalendarProps, Calendar as CalendarMantine } from '@mantine/dates'
import React from 'react'

const Calendar = (props: CalendarProps) => {
    return <CalendarMantine {...props} />
}

export default Calendar
