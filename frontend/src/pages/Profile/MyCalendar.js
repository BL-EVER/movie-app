import React from 'react';
import Calendar from "react-calendar";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import {Badge, IconButton, Typography} from "@mui/material";
import {getDate} from "../utils/getDate";
import MyTickets from "./MyTickets";

const MyCalendar = ({tickets}) => {
    const [dateSelected, setDateSelected] = React.useState(new Date());
    return (
        <div>
            <div style={{width: '350px', margin: '0 auto', textAlign: 'center'}}>
                <Typography variant="h6" component="div" > My Tickets</Typography>
                <Calendar
                    onChange={setDateSelected} value={dateSelected}
                    tileContent={
                        ({ activeStartDate, date, view }) => {
                            const count = tickets.map(t=> new Date(t.date))
                                .filter(d => d >= getDate(date))
                                .filter(d => d <= getDate(date))
                                .length;
                            return view === 'month'
                                && count > 0
                                ?
                                <ConfirmationNumberIcon sx={{ fontSize: 30 }}/>
                                :
                                    null;
                        }
                    }
                />
            </div>
            <br/>
            <br/>
            {
                tickets.map(t=> new Date(t.date))
                    .filter(d => d >= getDate(dateSelected))
                    .filter(d => d <= getDate(dateSelected))
                    .length > 0
                &&
                    <MyTickets
                        tickets={
                            tickets
                                .filter(d => new Date(d.date) >= getDate(dateSelected))
                                .filter(d => new Date(d.date) <= getDate(dateSelected))
                        }
                    />
            }
        </div>
    );
};

export default MyCalendar;