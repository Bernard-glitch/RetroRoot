import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sloganImg from "./assets/retroroot-slogan.png";
import vehicle from "./assets/vehicles.png";
import electronics from "./assets/device.png";
import clothings from "./assets/male-clothes.png";
import collectibles from "./assets/hobbies.png";
import Sidebar from "./component/SideBar"; // ✅ Make sure path is correct

function Home() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <div>
            {/* Navbar */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                backgroundColor: "#2e2d2bff",
                color: "white",
                fontFamily: "sans-serif"
            }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>RetroRoot</div>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "1.5rem",
                            cursor: "pointer"
                        }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </nav>

            {/* ✅ Sidebar Component */}
            {sidebarOpen && (
                <Sidebar onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            )}

            {/* Banner */}
            <div>
                <img
                    src={sloganImg}
                    alt="Scout Hunt Treasure It!"
                    style={{ width: "100%", height: "auto", display: "block" }}
                />
            </div>

            {/* Category Grid */}
            <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "40px",
                    padding: "40px 20px"
                }}>
                    {[
                        { icon: vehicle, label: "Vehicles", path: "/vehicles" },
                        { icon: electronics, label: "Electronics", path: "/electronics" },
                        { icon: clothings, label: "Clothings", path: "/clothings" },
                        { icon: collectibles, label: "Collectibles", path: "/collectibles" }
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            style={{
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                backgroundColor: "#c8cfd6ff",
                                borderRadius: "50%",
                                width: "80px",
                                height: "80px",
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                <img src={item.icon} alt={item.label} style={{ width: "40px", height: "40px" }} />
                            </div>
                            <p style={{ marginTop: "10px", fontWeight: "500" }}>{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
