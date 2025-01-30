// react
import { useState, useEffect } from "react";


// leaflet
import "leaflet/dist/leaflet.css";
import { Marker, Popup, useMap } from "react-leaflet";
import { Button } from "./ui/button";

function BranchMarkers({ branches, selectedBranch, nearest }: { branches: object[], selectedBranch: object, nearest: boolean }) {
    const [userLocation, setUserLocation] = useState([0, 0]);
    const [nearestBranch, setNearestBranch] = useState({});
    const map = useMap();
    let distance = Number.MAX_SAFE_INTEGER;

    useEffect(() => {
        if (Object.keys(selectedBranch).length > 0) {
            map.setView([selectedBranch.latitude, selectedBranch.longitude], 17);
        }
    }, [selectedBranch]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    useEffect(() => {
        for (const branch of branches) {
            const userToBranch = (userLocation[0] - branch.latitude) ** 2 + (userLocation[1] - branch.longitude) ** 2;

            if (userToBranch < distance) {
                distance = userToBranch;
                setNearestBranch(branch);
            }
        }
    }, [userLocation]);

    function handleDirections(branch: object) {
        const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${branch.address}`;

        window.open(url, "_blank");
    }

    if (nearest) {
        console.log(userLocation)
        return (
            <>
                <Marker position={userLocation}>
                    <Popup>
                        <h1 className="text-xl font-semibold">Your Location</h1>
                    </Popup> 
                </Marker>
                <Marker position={[nearestBranch.latitude, nearestBranch.longitude]}>
                    <Popup>
                        <h1 className="text-xl font-semibold">{nearestBranch.landmark}</h1>
                        <p>{nearestBranch.address}, {nearestBranch.postalCode}</p>
                        <p>{nearestBranch.openingHours}</p>
                    </Popup>
                </Marker>
            </>
        );        
    }

    return (
        <>
            {branches.map((branch: object, index: number) => {
                return (
                    <Marker key={index} position={[branch.latitude, branch.longitude]}>
                        <Popup>
                            <h1 className="text-xl font-semibold">{branch.landmark}</h1>
                            <p>{branch.address}, {branch.postalCode}</p>
                            <p>{branch.openingHours}</p>
                            <Button className="w-full bg-red-600" onClick={() => handleDirections(branch)}>Get Directions</Button>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default BranchMarkers;
