import React from "react";

const Sidebar = ({ onClose }) => {
    return (
        <>
            {/* Vintage backdrop overlay */}
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

            {/* Vintage Sidebar */}
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
                    boxShadow: "-6px 0 25px rgba(0, 0, 0, 0.6), inset 2px 0 4px rgba(255, 255, 255, 0.1)",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    borderLeft: "4px solid #daa520",
                    overflow: "hidden"
                }}
            >
                {/* Decorative top border pattern */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "8px",
                    background: "repeating-linear-gradient(90deg, #daa520 0px, #daa520 15px, #b8860b 15px, #b8860b 30px)"
                }}></div>

                {/* Vintage grain texture overlay */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23f4f1e8\" opacity=\"0.03\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%23000000\" opacity=\"0.08\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23grain)\"/></svg>') repeat",
                    pointerEvents: "none",
                    opacity: 0.3
                }}></div>

                {/* Header Section */}
                <div style={{
                    position: "relative",
                    zIndex: 2,
                    marginBottom: "50px",
                    textAlign: "center"
                }}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "-10px",
                            background: "linear-gradient(145deg, #daa520, #b8860b)",
                            border: "2px solid #8b7355",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            color: "#2f1b14",
                            fontSize: "24px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.4)",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #ffd700, #daa520)";
                            e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #daa520, #b8860b)";
                            e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                        }}
                        title="Close Sidebar"
                    >
                        &times;
                    </button>

                    {/* Vintage Title */}
                    <div style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#daa520",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                        letterSpacing: "3px",
                        marginTop: "20px",
                        fontFamily: "'Georgia', serif"
                    }}>
                        RetroRoot
                    </div>

                    {/* Decorative divider */}
                    <div style={{
                        width: "80%",
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, #daa520, transparent)",
                        margin: "15px auto",
                        boxShadow: "0 1px 2px rgba(218, 165, 32, 0.5)"
                    }}></div>

                    <div style={{
                        fontSize: "14px",
                        color: "#e8dcc0",
                        fontStyle: "italic",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
                    }}>
                        Navigate Your Collection
                    </div>
                </div>

                {/* Navigation Links */}
                <nav style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}>
                    {[
                        { href: "/profile", label: "My Profile", size: 24, icon: "👤" },
                        { href: "/home", label: "Home", size: 20, icon: "🏠" },
                        { href: "/vehicles", label: "Vehicles", size: 20, icon: "🚗" },
                        { href: "/electronics", label: "Electronics", size: 20, icon: "📻" },
                        { href: "/clothings", label: "Clothings", size: 20, icon: "👔" },
                        { href: "/collectibles", label: "Collectibles", size: 20, icon: "🎯" }
                    ].map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            style={{
                                ...navLinkStyle(item.size),
                                background: index === 0
                                    ? "linear-gradient(90deg, rgba(218, 165, 32, 0.3), rgba(184, 134, 11, 0.2))"
                                    : "linear-gradient(90deg, rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.2))",
                                padding: "15px 20px",
                                borderRadius: "12px",
                                border: "2px solid rgba(218, 165, 32, 0.3)",
                                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(90deg, rgba(218, 165, 32, 0.5), rgba(184, 134, 11, 0.4))";
                                e.currentTarget.style.transform = "translateX(-5px)";
                                e.currentTarget.style.borderColor = "#daa520";
                                e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 8px rgba(218, 165, 32, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = index === 0
                                    ? "linear-gradient(90deg, rgba(218, 165, 32, 0.3), rgba(184, 134, 11, 0.2))"
                                    : "linear-gradient(90deg, rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.2))";
                                e.currentTarget.style.transform = "translateX(0)";
                                e.currentTarget.style.borderColor = "rgba(218, 165, 32, 0.3)";
                                e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)";
                            }}
                        >
                            <span style={{
                                fontSize: "20px",
                                filter: "grayscale(30%) sepia(20%)"
                            }}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>

                            {/* Decorative arrow */}
                            <span style={{
                                marginLeft: "auto",
                                fontSize: "16px",
                                color: "#daa520"
                            }}>
                                ›
                            </span>
                        </a>
                    ))}
                </nav>

                {/* Vintage footer decoration */}
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40px",
                    background: "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.4))",
                    borderTop: "2px solid #daa520",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2
                }}>
                    <div style={{
                        fontSize: "12px",
                        color: "#e8dcc0",
                        fontStyle: "italic",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)"
                    }}>
                        Est. 2025 • Vintage Marketplace
                    </div>
                </div>
            </div>
        </>
    );
};

// Enhanced vintage style function
const navLinkStyle = (fontSize = 16) => ({
    color: "#f4f1e8",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: `${fontSize}px`,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.6)",
    letterSpacing: "0.5px"
});

export default Sidebar;