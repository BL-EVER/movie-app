import React from 'react';
import MyCalendar from "./MyCalendar";
import BookingService from "../../services/BookingService";
import {useOidcAccessToken} from "@axa-fr/react-oidc";

const ProfilePage = () => {

    const { accessToken, accessTokenPayload } = useOidcAccessToken();

    const [tickets, setTickets] = React.useState([]);
    React.useEffect(() => {
        const owner = accessTokenPayload.sub;
        BookingService.getBookings(`?owner=${owner}&populate=movie,movieTheater`)
            .then(res => {
                setTickets(res.data.sort(function(a,b){
                    return new Date(b.date) - new Date(a.date);
                }))
            })
            .catch(err => {
                console.log(err)
            });

    }, []);

    return (
        <div>
            <br/>
            <br/>
            <MyCalendar tickets={tickets}/>
        </div>
    );
};

export default ProfilePage;