import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import sloganImg from "../assets/vehicle-slogan.png";
import VehicleFilter from "../component/VehicleFilter";
import Sidebar from "../component/SideBar";

function VehiclePage() {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    // 1️⃣ Load external vehicle data
    useEffect(() => {
        fetch("https://bb37b600-a491-4c9c-9317-0f6fc02f106a-00-rbsqo7ga0h16.sisko.replit.dev/")
            .then((res) => res.json())
            .then(setVehicles)
            .catch((err) => console.error("Vehicle API error:", err));
    }, []);

    // 2️⃣ Load posts from Firestore
    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const loaded = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(loaded);
        };
        fetchPosts();
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
            <nav style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "15px 30px", backgroundColor: "#2e2d2bff", color: "white", fontFamily: "sans-serif"
            }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>RetroRoot</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="bi bi-list" style={{ fontSize: "24px", cursor: "pointer" }} onClick={toggleSidebar}></i>
                    <button onClick={handleLogout} style={{
                        padding: "8px 16px", backgroundColor: "#ff4d4d", color: "white",
                        border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px"
                    }}>Logout</button>
                </div>
            </nav>

            {/* Banner */}
            <img src={sloganImg} alt="Your Car, Your Choice"
                style={{ width: "100%", display: "block", marginBottom: "20px" }} />

            {/* Filter */}
            <div style={{ padding: "0 40px" }}>
                <VehicleFilter />
            </div>

            {/* Listings */}
            <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
                <h1>Vehicle Marketplace</h1>
                <p>Explore vintage cars and other rare listings.</p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px"
                }}>
                    {/* Firestore-based Posts */}
                    {posts.map((post) => (
                        <div key={post.id} style={{
                            border: "1px solid #ccc", padding: "15px", borderRadius: "8px", backgroundColor: "#fff"
                        }}>
                            {post.image && (
                                <img src={post.image} alt={post.title}
                                    style={{
                                        width: "100%", height: "150px",
                                        objectFit: "cover", borderRadius: "6px", marginBottom: "10px"
                                    }} />
                            )}
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <p style={{ fontWeight: "bold" }}>RM {post.price}</p>
                        </div>
                    ))}

                    {/* External Vehicle Listings */}
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} style={{
                            border: "1px solid #ccc", padding: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9"
                        }}>
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
