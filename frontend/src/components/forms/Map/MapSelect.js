import React, {useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapSelect = ({callback, point}) => {
    const [position, setPosition] = useState([36.93042615477187, 25.599954485860508]); // center on Koufonissia
    const [marker, setMarker] = useState(point);

    const handleClick = (e) => {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        callback(lat, lng);
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
            {marker &&
                <Marker
                    position={marker}
                    icon={L.icon({ iconUrl: "/map_pin.png", iconSize: [20, 30], iconAnchor: [10, 30], popupAnchor: [0, -30], })}
                >
                    <Popup autoOpen={true}>
                        Hello World
                    </Popup>
                </Marker>
            }
            <EventComponent />
        </MapContainer>
    );
};

export default MapSelect;