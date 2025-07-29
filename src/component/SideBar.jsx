import React from "react";

const Sidebar = ({ onClose }) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100%",
                width: "320px",
                backgroundColor: "#2e2d2b",
                color: "white",
                padding: "32px",
                boxShadow: "-2px 0 8px rgba(0,0,0,0.35)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    alignSelf: "flex-end",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "28px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "40px"
                }}
                title="Close Sidebar"
            >
                &times;
            </button>

            {/* Navigation Links */}
            <a href="/profile" style={navLinkStyle(24)}>My Profile</a>
            <a href="/home" style={navLinkStyle(22)}>Home</a>
            <a href="/vehicles" style={navLinkStyle(22)}>Vehicles</a>
            <a href="/electronics" style={navLinkStyle(22)}>Electronics</a>
            <a href="/clothings" style={navLinkStyle(22)}>Clothings</a>
            <a href="/collectibles" style={navLinkStyle(22)}>Collectibles</a>
        </div>
    );
};

// Reusable style function
const navLinkStyle = (fontSize = 16) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: `${fontSize}px`,
    margin: "22px 0"
});

export default Sidebar;
