import React from 'react';
import MovieTheaterForm from "../../components/forms/MovieTheater/MovieTheaterForm";
import {Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import MovieTheaterService from "../../services/MovieTheaterService";

const MovieTheaterPage = () => {
    let { _id } = useParams();
    const [movieTheater, setMovieTheater] = React.useState(undefined);
    React.useEffect(() => {
        if(_id) {
            MovieTheaterService.getMovieTheater(_id)
                .then(res => {
                    setMovieTheater(res.data)
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }, []);

    return (
        <div style={{margin: '0 auto', width: '300px'}}>
            <br/>
            <Typography variant='h5'>{_id ? 'Update' : 'Create'} Movie theater</Typography>
            {!_id && <MovieTheaterForm />}
            {_id && movieTheater && <MovieTheaterForm movieTheater={movieTheater} />}

        </div>
    );
};

export default MovieTheaterPage;