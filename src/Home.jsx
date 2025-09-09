import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sloganImg from "./assets/retroroot-slogan.PNG";
import vehicle from "./assets/vehicles.png";
import electronics from "./assets/device.png";
import clothings from "./assets/male-clothes.png";
import collectibles from "./assets/hobbies.png";
import Sidebar from "./component/SideBar";

function Home() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f4f1e8 0%, #e8dcc0 50%, #d4c5a0 100%)",
            fontFamily: "'Georgia', 'Times New Roman', serif"
        }}>
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
                position: "relative"
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

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
                        onClick={() => setSidebarOpen(true)}
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
                </div>
            </nav>

            {/* Sidebar Component */}
            {sidebarOpen && (
                <Sidebar onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            )}

            {/* Vintage Banner Container */}
            <div style={{
                padding: "20px",
                textAlign: "center",
                background: "linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.1) 100%)",
                borderBottom: "2px solid #8b4513",
                position: "relative"
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
                        alt="Scout Hunt Treasure It!"
                        style={{
                            width: "100%",
                            maxWidth: "800px",
                            height: "auto",
                            display: "block",
                            borderRadius: "8px",
                            filter: "sepia(20%) contrast(110%) brightness(105%)"
                        }}
                    />
                </div>
            </div>

            {/* Vintage Category Grid */}
            <div style={{
                textAlign: "center",
                marginTop: "50px",
                padding: "40px 20px",
                background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23d4c5a0\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%238b4513\" opacity=\"0.05\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"%23daa520\" opacity=\"0.1\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23grain)\"/></svg>') repeat"
            }}>
                {/* Decorative title */}
                <h2 style={{
                    fontSize: "2.5rem",
                    color: "#8b4513",
                    marginBottom: "40px",
                    fontFamily: "'Georgia', serif",
                    textShadow: "2px 2px 4px rgba(139, 69, 19, 0.3)",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    position: "relative"
                }}>
                    <span style={{
                        borderBottom: "3px double #daa520",
                        paddingBottom: "10px"
                    }}>
                        Categories
                    </span>
                </h2>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "50px",
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
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                padding: "20px"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-12px) scale(1.05)";
                                e.currentTarget.style.filter = "drop-shadow(0 12px 25px rgba(139, 69, 19, 0.4))";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0) scale(1)";
                                e.currentTarget.style.filter = "none";
                            }}
                        >
                            {/* Vintage card background */}
                            <div style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "0",
                                background: "linear-gradient(145deg, #f4f1e8, #e8dcc0)",
                                borderRadius: "20px",
                                border: "3px solid #8b4513",
                                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 16px rgba(139, 69, 19, 0.2)",
                                opacity: "0.9"
                            }}></div>

                            {/* Icon container */}
                            <div style={{
                                position: "relative",
                                zIndex: "2",
                                background: "radial-gradient(circle, #daa520 0%, #b8860b 70%)",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                margin: "0 auto 20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "4px solid #8b4513",
                                boxShadow: "0 6px 15px rgba(139, 69, 19, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)"
                            }}>
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"
                                    }}
                                />
                            </div>

                            {/* Label */}
                            <p style={{
                                position: "relative",
                                zIndex: "2",
                                marginTop: "15px",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                                color: "#5d4e37",
                                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                                fontFamily: "'Georgia', serif",
                                letterSpacing: "1px"
                            }}>
                                {item.label}
                            </p>

                            {/* Decorative corner elements */}
                            <div style={{
                                position: "absolute",
                                top: "15px",
                                left: "15px",
                                width: "15px",
                                height: "15px",
                                border: "2px solid #daa520",
                                borderRight: "none",
                                borderBottom: "none",
                                zIndex: "3"
                            }}></div>
                            <div style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                width: "15px",
                                height: "15px",
                                border: "2px solid #daa520",
                                borderLeft: "none",
                                borderBottom: "none",
                                zIndex: "3"
                            }}></div>
                            <div style={{
                                position: "absolute",
                                bottom: "15px",
                                left: "15px",
                                width: "15px",
                                height: "15px",
                                border: "2px solid #daa520",
                                borderRight: "none",
                                borderTop: "none",
                                zIndex: "3"
                            }}></div>
                            <div style={{
                                position: "absolute",
                                bottom: "15px",
                                right: "15px",
                                width: "15px",
                                height: "15px",
                                border: "2px solid #daa520",
                                borderLeft: "none",
                                borderTop: "none",
                                zIndex: "3"
                            }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vintage footer decoration */}
            <div style={{
                marginTop: "50px",
                height: "20px",
                background: "repeating-linear-gradient(90deg, #8b4513 0px, #8b4513 20px, #daa520 20px, #daa520 40px)",
                borderTop: "2px solid #654321",
                borderBottom: "2px solid #654321"
            }}></div>
        </div>
    );
}

export default Home;