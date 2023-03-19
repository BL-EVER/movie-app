import axios from "./AxiosClient";

class BookingService {
    getBookings() {
        return axios({
            method: 'get',
            url: 'api/Booking/'
        })
    }

    getBooking(id) {
        return axios({
            method: 'get',
            url: 'api/Booking/' + id
        })
    }

    createBooking(data) {
        return axios({
            method: 'post',
            url: 'api/Booking/',
            data
        })
    }

    updateBooking(data, id) {
        return axios({
            method: 'put',
            url: 'api/Booking/' + id,
            data
        })
    }

    deleteBooking(id) {
        return axios({
            method: 'delete',
            url: 'api/Booking/' + id
        })
    }

    getFilledSeats(movieTheater, date, time, movie) {
        return axios({
            method: 'get',
            url: `api/Booking/getFilledSeats?movieTheater=${movieTheater}&time=${time}&date=${date}&movie=${movie}`
        })
    }
}
export default new BookingService();