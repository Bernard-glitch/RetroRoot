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
        <div style={{
            position: "relative",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f4f1e8 0%, #e8dcc0 50%, #d4c5a0 100%)",
            fontFamily: "'Georgia', 'Times New Roman', serif"
        }}>
            {/* Vintage grain texture overlay */}
            <div style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23d4c5a0\" opacity=\"0.05\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%238b4513\" opacity=\"0.03\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"%23daa520\" opacity=\"0.05\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23grain)\"/></svg>') repeat",
                pointerEvents: "none",
                zIndex: "1"
            }}></div>

            {/* Sidebar */}
            {showSidebar && (
                <div style={{ position: "fixed", top: 0, right: 0, zIndex: 999 }}>
                    <Sidebar onClose={toggleSidebar} />
                </div>
            )}

            {/* Vintage Navbar */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 40px",
                background: "linear-gradient(90deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)",
                color: "#f4f1e8",
                boxShadow: "0 4px 12px rgba(139, 69, 19, 0.4)",
                borderBottom: "3px solid #654321",
                position: "relative",
                zIndex: "10"
            }}>
                {/* Decorative border */}
                <div style={{
                    position: "absolute",
                    top: "3px",
                    left: "0",
                    right: "0",
                    height: "2px",
                    background: "repeating-linear-gradient(90deg, #daa520 0px, #daa520 10px, transparent 10px, transparent 20px)"
                }}></div>

                <div style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    letterSpacing: "2px",
                    fontFamily: "'Georgia', serif"
                }}>
                    RetroRoot
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                        style={{
                            background: "linear-gradient(145deg, #daa520, #b8860b)",
                            border: "2px solid #8b7355",
                            borderRadius: "8px",
                            color: "#2f1b14",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                            padding: "8px 12px",
                            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onClick={toggleSidebar}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #ffd700, #daa520)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #daa520, #b8860b)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "10px 20px",
                            background: "linear-gradient(145deg, #cd5c5c, #a0522d)",
                            color: "#f4f1e8",
                            border: "2px solid #8b4513",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "'Georgia', serif",
                            fontWeight: "bold",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #dc143c, #cd5c5c)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #cd5c5c, #a0522d)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Vintage Banner Container */}
            <div style={{
                padding: "20px",
                textAlign: "center",
                background: "linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.1) 100%)",
                borderBottom: "2px solid #8b4513",
                position: "relative",
                zIndex: "2"
            }}>
                <div style={{
                    display: "inline-block",
                    padding: "10px",
                    border: "4px double #8b4513",
                    borderRadius: "15px",
                    background: "rgba(244, 241, 232, 0.9)",
                    boxShadow: "0 8px 20px rgba(139, 69, 19, 0.3)"
                }}>
                    <img
                        src={sloganImg}
                        alt="Your Car, Your Choice"
                        style={{
                            width: "100%",
                            maxWidth: "800px",
                            display: "block",
                            borderRadius: "8px",
                            filter: "sepia(20%) contrast(110%) brightness(105%)"
                        }}
                    />
                </div>
            </div>

            {/* Vintage Filter Section */}
            <div style={{
                padding: "30px 40px",
                background: "rgba(244, 241, 232, 0.8)",
                borderBottom: "2px solid #daa520",
                position: "relative",
                zIndex: "2"
            }}>
                <div style={{
                    background: "linear-gradient(145deg, #f4f1e8, #e8dcc0)",
                    border: "3px solid #8b4513",
                    borderRadius: "15px",
                    padding: "20px",
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(139, 69, 19, 0.2)"
                }}>
                    <VehicleFilter />
                </div>
            </div>

            {/* Vintage Listings Section */}
            <div style={{
                padding: "50px 40px",
                position: "relative",
                zIndex: "2"
            }}>
                {/* Section Header */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "50px"
                }}>
                    <h1 style={{
                        fontSize: "3rem",
                        color: "#8b4513",
                        fontFamily: "'Georgia', serif",
                        textShadow: "3px 3px 6px rgba(139, 69, 19, 0.3)",
                        letterSpacing: "4px",
                        textTransform: "uppercase",
                        marginBottom: "20px",
                        borderBottom: "4px double #daa520",
                        paddingBottom: "15px",
                        display: "inline-block"
                    }}>
                        Vehicle Marketplace
                    </h1>
                    <p style={{
                        fontSize: "1.3rem",
                        color: "#5d4e37",
                        fontStyle: "italic",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                        marginTop: "20px"
                    }}>
                        Explore vintage cars and other rare listings from bygone eras
                    </p>
                </div>

                {/* Vintage Grid Layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "30px"
                }}>
                    {/* Firestore-based Posts */}
                    {posts.map((post) => (
                        <div key={post.id} style={{
                            background: "linear-gradient(145deg, #f4f1e8, #e8dcc0)",
                            border: "3px solid #8b4513",
                            borderRadius: "15px",
                            padding: "20px",
                            boxShadow: "0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.8)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative",
                            overflow: "hidden"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 15px 35px rgba(139, 69, 19, 0.4), inset 0 2px 4px rgba(255,255,255,0.8)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.8)";
                            }}
                        >
                            {/* Vintage corner decorations */}
                            <div style={{
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                width: "20px",
                                height: "20px",
                                border: "3px solid #daa520",
                                borderRight: "none",
                                borderBottom: "none"
                            }}></div>
                            <div style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                width: "20px",
                                height: "20px",
                                border: "3px solid #daa520",
                                borderLeft: "none",
                                borderBottom: "none"
                            }}></div>

                            {post.image && (
                                <div style={{
                                    marginBottom: "15px",
                                    border: "2px solid #8b4513",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 8px rgba(139, 69, 19, 0.3)"
                                }}>
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            filter: "sepia(10%) contrast(105%) brightness(102%)"
                                        }}
                                    />
                                </div>
                            )}

                            <h3 style={{
                                color: "#8b4513",
                                fontSize: "1.4rem",
                                marginBottom: "10px",
                                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                                fontFamily: "'Georgia', serif"
                            }}>
                                {post.title}
                            </h3>

                            <p style={{
                                color: "#5d4e37",
                                lineHeight: "1.6",
                                marginBottom: "15px",
                                textShadow: "1px 1px 1px rgba(255,255,255,0.5)"
                            }}>
                                {post.description}
                            </p>

                            <div style={{
                                background: "linear-gradient(90deg, #daa520, #b8860b)",
                                color: "#2f1b14",
                                padding: "8px 15px",
                                borderRadius: "20px",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                textAlign: "center",
                                textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
                                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(139, 69, 19, 0.3)",
                                display: "inline-block"
                            }}>
                                RM {post.price}
                            </div>
                        </div>
                    ))}

                    {/* External Vehicle Listings */}
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} style={{
                            background: "linear-gradient(145deg, #e8dcc0, #d4c5a0)",
                            border: "3px solid #8b4513",
                            borderRadius: "15px",
                            padding: "20px",
                            boxShadow: "0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.6)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative",
                            overflow: "hidden"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 15px 35px rgba(139, 69, 19, 0.4), inset 0 2px 4px rgba(255,255,255,0.6)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.6)";
                            }}
                        >
                            {/* Vintage corner decorations */}
                            <div style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "10px",
                                width: "20px",
                                height: "20px",
                                border: "3px solid #daa520",
                                borderRight: "none",
                                borderTop: "none"
                            }}></div>
                            <div style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                width: "20px",
                                height: "20px",
                                border: "3px solid #daa520",
                                borderLeft: "none",
                                borderTop: "none"
                            }}></div>

                            <h3 style={{
                                color: "#8b4513",
                                fontSize: "1.4rem",
                                marginBottom: "15px",
                                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                                fontFamily: "'Georgia', serif",
                                borderBottom: "2px solid #daa520",
                                paddingBottom: "5px"
                            }}>
                                {vehicle.title}
                            </h3>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "10px",
                                marginBottom: "15px"
                            }}>
                                {[
                                    { label: "Brand", value: vehicle.brand },
                                    { label: "Type", value: vehicle.car_type },
                                    { label: "Transmission", value: vehicle.transmission },
                                    { label: "Fuel", value: vehicle.fuel_type },
                                    { label: "Condition", value: vehicle.condition },
                                    { label: "Year", value: vehicle.mfg_year }
                                ].map((item, index) => (
                                    <div key={index} style={{
                                        color: "#5d4e37",
                                        fontSize: "0.9rem",
                                        textShadow: "1px 1px 1px rgba(255,255,255,0.5)"
                                    }}>
                                        <strong style={{ color: "#8b4513" }}>{item.label}:</strong> {item.value}
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                background: "linear-gradient(90deg, #daa520, #b8860b)",
                                color: "#2f1b14",
                                padding: "8px 15px",
                                borderRadius: "20px",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                textAlign: "center",
                                textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
                                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(139, 69, 19, 0.3)",
                                display: "inline-block"
                            }}>
                                RM {vehicle.price}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vintage footer decoration */}
            <div style={{
                height: "20px",
                background: "repeating-linear-gradient(90deg, #8b4513 0px, #8b4513 20px, #daa520 20px, #daa520 40px)",
                borderTop: "2px solid #654321",
                borderBottom: "2px solid #654321",
                position: "relative",
                zIndex: "2"
            }}></div>
        </div>
    );
}

export default VehiclePage;