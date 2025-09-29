import React from "react";

const Sidebar = ({ onClose, onLogout }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(45, 35, 25, 0.7)",
                    backdropFilter: "blur(3px)",
                    zIndex: 999
                }}
            />

            {/* Sidebar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "340px",
                    background: "linear-gradient(180deg, #8b4513 0%, #654321 50%, #5d4e37 100%)",
                    color: "#f4f1e8",
                    padding: "40px 30px",
                    boxShadow: "-6px 0 25px rgba(0, 0, 0, 0.6)",
                    zIndex: 1001,            // sits above backdrop
                    pointerEvents: "auto",   // ensure clicks work
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Georgia', serif",
                    borderLeft: "4px solid #daa520"
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        right: 15,
                        top: 15,
                        background: "#daa520",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "#2f1b14"
                    }}
                >
                    ×
                </button>

                <h2 style={{ marginTop: "60px", marginBottom: "30px" }}>RetroRoot</h2>

                {/* Nav */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <a href="/profile">👤 My Profile</a>
                    <a href="/home">🏠 Home</a>
                    <a href="/vehicles">🚗 Vehicles</a>
                    <a href="/electronics">📻 Electronics</a>
                    <a href="/clothings">👔 Clothings</a>
                    <a href="/collectibles">🎯 Collectibles</a>
                </nav>

                {/* Logout button */}
                <button
                    onClick={onLogout}
                    style={{
                        marginTop: "auto",
                        background: "linear-gradient(145deg, #daa520, #b8860b)",
                        border: "2px solid #8b7355",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default Sidebar;
