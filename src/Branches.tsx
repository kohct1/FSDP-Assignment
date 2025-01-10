// react
import { useState, useEffect } from "react";

// leaflet
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import Navbar from "./components/Navbar";

// components
import BranchMarkers from "./components/BranchMarkers";
import BranchButton from "./components/BranchButton";

function Branches() {
    const [branches, setBranches] = useState<object[]>([]);

    useEffect(() => {
        getAllBranches();
    }, []);

    useEffect(() => {
        console.log(branches)
    }, [branches])

    async function getAllBranches(): Promise<void> {
        const response = await fetch("http://localhost:5050/allBranches");
        const result = await response.json();

        setBranches(result.branchesAndCentresList);
    }

    return (
        <>
            <div className="w-full h-screen flex flex-col">
                <Navbar />
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-1/5 h-full flex flex-col">
                        {branches.map((branch: object) => {
                            return (
                                <BranchButton branch={branch} />
                            );
                        })}
                    </div>
                    <MapContainer className="w-4/5 h-full z-0" center={[1.3521, 103.8198]} zoom={13} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <BranchMarkers branches={branches} />
                    </MapContainer>
                </div>
            </div>
        </>
    );
}

export default Branches;
