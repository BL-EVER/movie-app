import axios from "./AxiosClient";

class MovieService {
    getMovies() {
        return axios({
            method: 'get',
            url: 'api/movie/'
        })
    }

    getMovie(id) {
        return axios({
            method: 'get',
            url: 'api/movie/' + id
        })
    }
}
export default new MovieService();