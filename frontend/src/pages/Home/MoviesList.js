import React, {useEffect, useState} from 'react';
import MovieService from "../../services/MovieService";
import {toast} from "react-toastify";
import {Button, ImageList, ImageListItem, ImageListItemBar, ListSubheader} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import useWindowDimensions from "../../hooks/useWindowDimensions";
import {Link} from "react-router-dom";

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        MovieService.getMovies().then((res) => {
            setMovies(res.data.sort((a, b) => 0.5 - Math.random()));
        }).catch((err) => {
            toast.error("Error while fetching movies");
        });
    }, [])
    const { height, width } = useWindowDimensions();
    return (
        <div>
            <ImageList sx={{ margin: '0 auto' }} variant="masonry" cols={Math.floor(width / 300)} gap={0}>
                {movies.map((movie) => (
                    <ImageListItem key={movie.Poster}>
                        <img
                            src={`${movie.Poster}`}
                            srcSet={`${movie.Poster}`}
                            alt={movie.Title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={
                            <Link to={`/ticket/${movie._id}`} style={{textDecoration: 'none'}}>
                                <Button style={{color: 'rgba(255, 255, 255, 1)', textTransform: 'none'}} variant="text" startIcon={<ConfirmationNumberIcon />}>
                                    Book a ticket
                                </Button>
                            </Link>
                            }
                            actionIcon={
                                <Link to={`/movie/${movie._id}`} style={{textDecoration: 'none'}}>
                                    <Button style={{color: 'rgba(255, 255, 255, 1)', textTransform: 'none', marginRight: "20px"}} variant="text" endIcon={<InfoIcon />}>
                                        More info
                                    </Button>
                                </Link>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
};

export default MoviesList;