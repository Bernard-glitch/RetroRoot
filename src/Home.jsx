import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <div>
            {/* ✅ Navbar */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                backgroundColor: "#007bff",
                color: "white",
                fontFamily: "sans-serif",
            }}>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>RetroRoot</div>
                <div>
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

            {/* Content */}
            <div style={{ textAlign: "center", marginTop: "80px", fontFamily: "sans-serif" }}>
                <h1>SCOUT, HUNT, TREASURE IT! </h1>
                <p>You are now logged in securely.</p>
            </div>
        </div>
    );
}

export default Home;
