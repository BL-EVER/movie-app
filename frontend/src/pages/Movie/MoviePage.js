import React from 'react';
import {Link, useParams} from "react-router-dom";
import MovieService from "../../services/MovieService";
import {
    Button,
    Grid,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const MoviePage = () => {
    let { _id } = useParams();
    const [movie, setMovie] = React.useState({});
    React.useEffect(() => {
        if(_id) {
            MovieService.getMovie(_id)
                .then(res => {
                    setMovie(res.data)
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }, [_id]);


    return (
        <div>
            <Grid
                container
                spacing={4}
                style={{margin: 'auto', width: '90vw'}}
            >
                <Grid item md={6} xs={12}>
                    <img
                        src={`${movie.Poster}`}
                        srcSet={`${movie.Poster}`}
                        alt={movie.Title}
                        loading="lazy"
                        style={{margin: 'auto', height: '100%'}}
                    />
                </Grid>
                <Grid item md={6} xs={12} >
                    <TableContainer component={Paper} style={{width: '100%'}} >
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title: </TableCell>
                                    <TableCell>{movie.Title}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    <TableRow>
                                        <TableCell >IMDB rating:</TableCell>
                                        <TableCell>
                                            <Rating value={parseFloat(movie.imdbRating)} precision={0.1} max={10} readOnly />
                                        </TableCell>
                                    </TableRow>
                                <TableRow>
                                    <TableCell >Release date: </TableCell>
                                    <TableCell>{movie.Released}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Writer: </TableCell>
                                    <TableCell>{movie.Writer}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Director: </TableCell>
                                    <TableCell>{movie.Director}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Actors: </TableCell>
                                    <TableCell>{movie.Actors}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Awards: </TableCell>
                                    <TableCell>{movie.Awards}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell >Plot: </TableCell>
                                    <TableCell>{movie.Plot}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Link to={`/ticket/${movie._id}`} style={{textDecoration: 'none'}}>
                                            <Button style={{textTransform: 'none'}} variant="text" startIcon={<ConfirmationNumberIcon />}>
                                                Book a ticket
                                            </Button>
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </div>
    );
};

export default MoviePage;