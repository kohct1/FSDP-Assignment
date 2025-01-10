// react
import { useState } from "react";

// leaflet
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";

function BranchMarkers({ branches }: { branches: object[] }) {
    const [location, setLocation] = useState<LatLngTuple | null>(null);

    return (
        <>
            {branches.map((branch: object) => {
                return (
                    <Marker position={[branch.latitude, branch.longitude]}>
                        <Popup></Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default BranchMarkers;
