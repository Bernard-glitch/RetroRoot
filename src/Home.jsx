import React from "react";
import { useNavigate } from "react-router-dom";
import sloganImg from "./assets/retroroot-slogan.png";
import vehicle from "./assets/vehicles.png";
import electronics from "./assets/device.png";
import clothings from "./assets/male-clothes.png";
import collectibles from "./assets/hobbies.png";



function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
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
                fontFamily: "sans-serif",
            }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>RetroRoot</div>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Menu Icon */}
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "1.5rem",
                            cursor: "pointer"
                        }}
                        title="Menu"
                        onClick={handleMenuClick}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </nav>

            {sidebarOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        width: "260px",
                        height: "100vh",
                        background: "#232220",
                        color: "white",
                        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                        padding: "30px 20px",
                        fontFamily: "sans-serif",
                        transition: "right 0.3s"
                    }}
                >
                    <button
                        style={{
                            alignSelf: "flex-end",
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            marginBottom: "30px"
                        }}
                        title="Close"
                        onClick={handleSidebarClose}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                    {/* Sidebar content */}
                    <button
                        onClick={() => {
                            handleSidebarClose();
                            navigate("/profile");
                        }}
                        style={{
                            padding: "10px 18px",
                            backgroundColor: "#4d79ff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "15px"
                        }}
                    >
                        My Profile
                    </button>
                    <button
                        onClick={() => {
                            handleSidebarClose();
                            handleLogout();
                        }}
                        style={{
                            padding: "10px 18px",
                            backgroundColor: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}

            <div style={{ marginTop: "0px" }}>
                <img
                    src={sloganImg}
                    alt="Scout Hunt Treasure It!"
                    style={{ width: "100%", height: "auto", display: "block" }}
                />
            </div>

            <div style={{
                textAlign: "center",
                marginTop: "40px",
                fontFamily: "sans-serif"
            }}>

                {/* Category Box */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "40px",
                    padding: "40px 20px",
                    fontFamily: "sans-serif"
                }}>
                    {[
                        { icon: vehicle, label: "Vehicles" },
                        { icon: electronics, label: "Electronics" },
                        { icon: clothings, label: "Clothings" },
                        { icon: collectibles, label: "Collectibles" }
                    ].map((item, index) => (
                        <div key={index} style={{ textAlign: "center", cursor: "pointer", transition: "transform 0.3 ease, box-shadow 0.3s ease" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}>
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
