const {MovieModel} = require('../models/MovieModel');
const superagent = require("superagent");
require('dotenv').config();

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_API_URL = process.env.MOVIE_API_URL;

const titles = ["Star Wars: Episode", "Indiana Jones"]

const fetch = () => {
    MovieModel.find({}).countDocuments().exec((err, count) => {
        if (err) {
            console.log(err);
            return;
        }
        if (count > 0) return;
        for (let title of titles) {
            superagent
                .get(MOVIE_API_URL)
                .query({apikey: MOVIE_API_KEY, type: "movie", s: title})
                .then((data) => {
                    const imdbIds = data.body.Search.map(movie => movie.imdbID);
                    for (let id of imdbIds) {
                        superagent
                            .get(MOVIE_API_URL)
                            .query({apikey: MOVIE_API_KEY, i: id, plot: "full"})
                            .then((data) => {
                                const movieData = data.body;
                                const movie = new MovieModel(movieData);
                                movie.save()
                                    .then(() => {
                                        console.log(`${movieData.Title} data seeded`);
                                    })
                                    .catch((err) => console.log(err));
                            })
                            .catch((err) => console.log(err));
                    }

                })
                .catch((err) => console.log(err));
        }
    });
};
module.exports = fetch;