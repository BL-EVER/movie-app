import axios from "./AxiosClient";

class MovieTheaterService {
    getMovieTheaters() {
        return axios({
            method: 'get',
            url: 'api/movieTheater/'
        })
    }

    getMovieTheater(id) {
        return axios({
            method: 'get',
            url: 'api/movieTheater/' + id
        })
    }

    createMovieTheater(data) {
        return axios({
            method: 'post',
            url: 'api/movieTheater/',
            data
        })
    }

    updateMovieTheater(data, id) {
        return axios({
            method: 'put',
            url: 'api/movieTheater/' + id,
            data
        })
    }

    deleteMovieTheater(id) {
        return axios({
            method: 'delete',
            url: 'api/movieTheater/' + id
        })
    }
}
export default new MovieTheaterService();