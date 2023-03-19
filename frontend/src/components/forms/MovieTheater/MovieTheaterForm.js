import React from 'react';
import {
    Button,
    LinearProgress,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from '@mui/material';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import { TextField } from 'formik-mui';
import MapSelect from "../Map/MapSelect";
import {toast} from "react-toastify";
import {useOidcAccessToken} from "@axa-fr/react-oidc";
import MovieTheaterService from "../../../services/MovieTheaterService";
import {useNavigate} from "react-router-dom";


const MovieTheaterForm = ({movieTheater}) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const { accessToken, accessTokenPayload } = useOidcAccessToken();
    let navigate = useNavigate();

    return (
            <Formik
                validateOnChange
                initialValues={movieTheater ? {
                    name: movieTheater.name,
                    rows: movieTheater.rows,
                    columns: movieTheater.columns,
                    coordinates: {lat: movieTheater.coordinates.lat, lng: movieTheater.coordinates.lng}
                } : {
                    name: '',
                    rows: null,
                    columns: null,
                    coordinates: {lat: null, lng: null}
                }}
                validate={(values) => {
                    const errors = {};
                    if(values.name === '') errors.name = 'Name is required';
                    if(values?.rows <= 0) errors.rows = 'Row number is required';
                    if(values?.columns <= 0) errors.columns = 'Column number is required';
                    if(!(values.coordinates.lat !== null && values.coordinates.lng !== null)) errors.coordinates = 'Point on map is is required';
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    values.owner = accessTokenPayload.sub;
                    if(movieTheater){
                        MovieTheaterService.updateMovieTheater(values, movieTheater._id).then(r => {
                            toast.success('Movie theater updated');
                            navigate('/');
                        }).catch(e => {
                            toast.error('Error updating movie theater');
                        });
                    }
                    else
                    {
                        MovieTheaterService.createMovieTheater(values).then(r => {
                            toast.success('Movie theater created');
                            navigate('/');
                        }).catch(e => {
                            toast.error('Error creating movie theater');
                        });
                    }

                    setSubmitting(false);
                }}
            >
                {({ submitForm, isSubmitting, setFieldValue, values, validateForm }) => (
                    <Form>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                    <Step key={1}>
                                        <StepLabel>
                                            Add movie theater data
                                        </StepLabel>
                                        <StepContent>
                                            <Field
                                                style={{width: '250px'}}
                                                component={TextField}
                                                name="name"
                                                type="text"
                                                label="Name"
                                            />
                                            <br />
                                            <br />
                                            <Field
                                                style={{width: '250px'}}
                                                component={TextField}
                                                type="number"
                                                label="Number of seat rows"
                                                name="rows"
                                            />
                                            <br />
                                            <br />
                                            <Field
                                                style={{width: '250px'}}
                                                component={TextField}
                                                type="number"
                                                label="Number of seat columns"
                                                name="columns"
                                            />
                                            <br />
                                            <br />
                                            <div>
                                                    <div>
                                                        <Button
                                                            variant="contained"
                                                            onClick={()=>{
                                                                validateForm().then((errors) => {
                                                                    if(Object.keys(errors).length > 1) {
                                                                        toast.error('Validation Error')
                                                                    }
                                                                    else
                                                                    {
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                                                                    }
                                                                });
                                                            }}
                                                            disabled={!(values.name !== '' && values?.rows > 0 && values?.columns > 0)}
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
                                        </StepContent>
                                    </Step>
                                <Step key={2}>
                                    <StepLabel>
                                        Select movie theater location
                                    </StepLabel>
                                    <StepContent>
                                        <MapSelect point={movieTheater ? movieTheater.coordinates : null} callback={(lat, lng) => setFieldValue('coordinates', {lat, lng}, false) }/>
                                        <ErrorMessage name="coordinates" />
                                        <div>
                                            <div>
                                                {isSubmitting && <LinearProgress />}
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isSubmitting || !(values.coordinates.lat !== null && values.coordinates.lng !== null)}
                                                    onClick={submitForm}
                                                >
                                                    Submit
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
                                        </div>
                                    </StepContent>
                                </Step>
                            </Stepper>
                    </Form>
                )}
            </Formik>
    );
};

export default MovieTheaterForm;