import React from 'react';
import {
    Button,
    LinearProgress, MenuItem,
    Step,
    StepContent,
    StepLabel,
    Stepper, Tooltip,
} from '@mui/material';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Select, TextField} from 'formik-mui';
import MapSelect from "../Map/MapSelect";
import {toast} from "react-toastify";
import {useOidcAccessToken} from "@axa-fr/react-oidc";
import MovieTheaterService from "../../../services/MovieTheaterService";
import {useNavigate} from "react-router-dom";
import MovieTheaterSelect from "../Map/MovieTheaterSelect";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import ChairIcon from '@mui/icons-material/Chair';
import BookingService from "../../../services/BookingService";


const TicketForm = ({movie}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [filledSeats, setFilledSeats] = React.useState([]);
    const { accessToken, accessTokenPayload } = useOidcAccessToken();
    let navigate = useNavigate();


    function getFilledSeats(movieTheater, day, time) {
        var startTime = new Date(day);
        startTime.setHours(time.split(":")[0]);
        BookingService.getFilledSeats(movieTheater, day, time, movie._id).then(r => {
            setFilledSeats(r.data)
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <Formik
            validateOnChange
            initialValues={{ movieTheater: {}, day: '', time: '', seats: []}}
            validate={(values) => {
                const errors = {};
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                let result = {
                    owner: accessTokenPayload.sub,
                    movieTheater: values.movieTheater._id,
                    movie: movie._id,
                    date: values.day,
                    time: values.time,
                    seats: values.seats
                }

                BookingService.createBooking(result).then(r => {
                    toast.success('Ticket created');
                    navigate('/profile');
                }).catch(e => {
                    toast.error('Error creating ticket');
                });

                setSubmitting(false);
            }}
        >
            {({ submitForm, isSubmitting, setFieldValue, values, validateForm }) => (
                <Form>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        <Step key={1}>
                            <StepLabel>
                                Select movie theater
                            </StepLabel>
                            <StepContent>
                                <MovieTheaterSelect callback={(m) => {
                                    setFieldValue('movieTheater', m, false);
                                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                                } }/>
                                <ErrorMessage name="coordinates" />
                                <div>
                                    <div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={()=>setActiveStep((prevActiveStep) => prevActiveStep + 1)}
                                                disabled={Object.keys(values.movieTheater).length === 0}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Continue
                                            </Button>
                                            <Button
                                                disabled
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </StepContent>
                        </Step>
                        <Step key={2}>
                            <StepLabel>
                                Select Date
                            </StepLabel>
                            <StepContent>
                                <Calendar onChange={(v) =>{setFieldValue('day', v, false); }} value={values.day} tileDisabled={({ date, view }) => {
                                    if (view === 'month') {
                                        var day = date.getDay();
                                        return (day === 6) || (day  === 0);
                                }
                                }} />
                                <br />
                                <br />
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={()=>setActiveStep((prevActiveStep) => prevActiveStep + 1)}
                                        disabled={!(values.day !== '')}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Continue
                                    </Button>
                                    <Button
                                        onClick={()=> {
                                            setActiveStep((prevActiveStep) => prevActiveStep - 1);
                                        }}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                        <Step key={3}>
                            <StepLabel>
                                Select Time
                            </StepLabel>
                            <StepContent>
                                <Field
                                    component={Select}
                                    formHelperText={{ children: 'Select time slot' }}
                                    id="time"
                                    name="time"
                                >
                                    {
                                        ["12:00", "15:00", "18:00", "21:00", "24:00"].map((v) => {
                                            return <MenuItem value={v}>{v}</MenuItem>
                                        })
                                    }
                                </Field>
                                <br />
                                <br />
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={()=>{
                                            getFilledSeats(values.movieTheater._id, values.day, values.time);
                                            setActiveStep((prevActiveStep) => prevActiveStep + 1);
                                        }}
                                        disabled={!(values.time !== '')}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Continue
                                    </Button>
                                    <Button
                                        onClick={()=> {
                                            setActiveStep((prevActiveStep) => prevActiveStep - 1);
                                        }}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                        <Step key={4}>
                            <StepLabel>
                                Select Seat
                            </StepLabel>
                            <StepContent>
                                {
                                    [...Array(values.movieTheater.rows)].map((v,r)=> (
                                        <div>
                                            {
                                                [...Array(values.movieTheater.columns)].map((v,c)=> (
                                                    <Tooltip title={`Row: ${r+1}, Column: ${c+1}`}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color={(values.seats.filter((v) => (v.row === r && v.column === c)).length === 1) ? "secondary" : "primary"}
                                                        disabled={(filledSeats.filter((v) => (v.row === r && v.column === c)).length === 1)}
                                                        style={{margin: 3}}
                                                        onClick={() => {
                                                            if(values.seats.filter((v) => (v.row === r && v.column === c)).length === 1){
                                                                setFieldValue('seats', values.seats.filter((v) => !(v.row === r && v.column === c)), false);
                                                            }
                                                            else
                                                            {
                                                                setFieldValue('seats', [...values.seats, {row: r, column: c}], false);
                                                            }
                                                        }}
                                                    >
                                                        <ChairIcon />
                                                    </Button>
                                                    </Tooltip>
                                                ))
                                            }
                                        </div>
                                    )
                                    )
                                }
                                <br />
                                <br />
                                <div>
                                    {isSubmitting && <LinearProgress />}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting || values.seats.length === 0}
                                        onClick={submitForm}
                                    >
                                        Book Ticket
                                    </Button>
                                    <Button
                                        onClick={()=> {
                                            setActiveStep((prevActiveStep) => prevActiveStep - 1);
                                        }}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    </Stepper>
                </Form>
            )}
        </Formik>
    );
};

export default TicketForm;