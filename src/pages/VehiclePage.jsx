import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sloganImg from "../assets/vehicle-slogan.png";
import VehicleFilter from "../component/VehicleFilter";
import Sidebar from "../component/SideBar"; // ✅ Check spelling ("SideBar" vs "Sidebar")

function VehiclePage() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    // Fetch vehicle data
    useEffect(() => {
        fetch("https://bb37b600-a491-4c9c-9317-0f6fc02f106a-00-rbsqo7ga0h16.sisko.replit.dev/")
            .then((res) => res.json())
            .then((data) => setVehicles(data))
            .catch((err) => console.error("Failed to fetch vehicles:", err));
    }, []);

    return (
        <div style={{ position: "relative" }}>
            {/* Sidebar */}
            {showSidebar && (
                <div style={{ position: "fixed", top: 0, right: 0, zIndex: 999 }}>
                    <Sidebar onClose={toggleSidebar} />
                </div>
            )}

            {/* Navbar */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 30px",
                    backgroundColor: "#2e2d2bff",
                    color: "white",
                    fontFamily: "sans-serif"
                }}
            >
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>RetroRoot</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i
                        className="bi bi-list"
                        style={{ fontSize: "24px", cursor: "pointer" }}
                        onClick={toggleSidebar}
                    ></i>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Banner */}
            <img
                src={sloganImg}
                alt="Your Car, Your Choice"
                style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    marginBottom: "20px"
                }}
            />

            {/* Filters */}
            <div style={{ padding: "0 40px" }}>
                <VehicleFilter />
            </div>

            {/* Vehicle Listings */}
            <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
                <h1>Vehicle Marketplace</h1>
                <p>Explore vintage cars, motorcycles, and more.</p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9"
                            }}
                        >
                            <h3>{vehicle.title}</h3>
                            <p>Brand: {vehicle.brand}</p>
                            <p>Type: {vehicle.car_type}</p>
                            <p>Transmission: {vehicle.transmission}</p>
                            <p>Fuel: {vehicle.fuel_type}</p>
                            <p>Condition: {vehicle.condition}</p>
                            <p>Price: RM {vehicle.price}</p>
                            <p>Year: {vehicle.mfg_year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VehiclePage;
