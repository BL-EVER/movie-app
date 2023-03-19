import React, {useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MovieTheaterService from "../../../services/MovieTheaterService";
import {Button} from "@mui/material";

const MovieTheaterSelect = ({callback}) => {
    const [position, setPosition] = useState([36.93042615477187, 25.599954485860508]); // center on Koufonissia

    const [movieTheaters, setMovieTheaters] = React.useState([]);
    React.useEffect(() => {
        MovieTheaterService.getMovieTheaters()
            .then(res => {
                setMovieTheaters(res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    const handleClick = (e) => {
        const { lat, lng } = e.latlng;
    };

    const EventComponent = () => {
        useMapEvents({
            click: handleClick,
        });
        return null;
    };

    return (
        <MapContainer center={position} zoom={13} style={{ height: "400px", width: "400px"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {movieTheaters.map((m)=>(
                <Marker
                    position={m.coordinates}
                    icon={L.icon({ iconUrl: "/map_pin.png", iconSize: [20, 30], iconAnchor: [10, 30], popupAnchor: [0, -30], })}
                >
                    <Popup>
                        {m.name}
                        <br/>
                        <br/>
                        <Button size="small" variant="contained" onClick={()=> callback(m)}>Select</Button>
                    </Popup>
                </Marker>
            ))}
            <EventComponent />
        </MapContainer>
    );
};

export default MovieTheaterSelect;