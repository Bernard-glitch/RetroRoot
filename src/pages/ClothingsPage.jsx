import React from "react";
import { useNavigate } from "react-router-dom";

function ClothingsPage() {
    const navigate = useNavigate();

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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className="bi bi-list" style={{ fontSize: "24px", cursor: "pointer" }}></i>
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

            <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
                <h1>Clothings</h1>
                <p>Step into style with retro clothing and fashion items.</p>
            </div>
        </div>
    );
}

export default ClothingsPage;
