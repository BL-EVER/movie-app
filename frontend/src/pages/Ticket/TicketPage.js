import React from 'react';
import {useParams} from "react-router-dom";
import MovieService from "../../services/MovieService";
import TicketForm from "../../components/forms/Ticket/TicketForm";

const TicketPage = () => {
    let { movieId } = useParams();
    const [movie, setMovie] = React.useState({});
    React.useEffect(() => {
        if(movieId) {
            MovieService.getMovie(movieId)
                .then(res => {
                    setMovie(res.data)
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }, []);
    return (
        <div style={{margin: '0 auto', width: '70vw'}}>
            <TicketForm movie={movie}/>
        </div>
    );
};

export default TicketPage;