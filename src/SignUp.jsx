import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const vintageTheme = {
        colors: {
            primary: '#8B4513', // Saddle brown
            secondary: '#D2691E', // Chocolate
            accent: '#CD853F', // Peru
            cream: '#F5F5DC', // Beige
            warmWhite: '#FDF6E3', // Old lace
            darkBrown: '#654321', // Dark brown
            gold: '#DAA520', // Goldenrod
            sage: '#9CAF88', // Sage green
            dustyRose: '#C4A484', // Dusty rose
            errorRed: '#8B0000', // Dark red
            successGreen: '#228B22', // Forest green
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        function validatePassword(password) {
            if (password.length < 6) {
                return "Password must be at least 6 characters long.";
            }
            return null;
        }

        const error = validatePassword(password);
        if (error) {
            console.error(error);
            return;
        }

        try {
            const res = await axios.post(
                "https://retro-root-api.vercel.app/signup",
                { email, password })

            if (res.data) {
                try {
                    const firebaseRes = await createUserWithEmailAndPassword(auth, email, password);
                    console.log(firebaseRes);

                    console.log("Profile updated successfully");

                } catch (err) {
                    console.error("Error in Firebase sign up:", err);
                }
            }
            ;

            setMessage(res.data.message || "Signup successful!");
            console.log("Signed up:", res.data);

            // Optionally redirect to login page after signup
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || " Signup failed");
        }
        if (email && password && password.length >= 6) {
            setMessage("Account created successfully! Redirecting to login...");
        } else {
            setMessage("Please check your input and try again.");
        }
    };

    const handleBackToLogin = () => {
        // Your original navigate("/") would go here
        setMessage("Redirecting to login page...");
    };

    const passwordError = password.length > 0 && password.length < 6;
    const passwordValid = password.length >= 6;

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: vintageTheme.colors.warmWhite,
        padding: "1rem",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(218, 165, 32, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(156, 175, 136, 0.1) 0%, transparent 50%)
        `
    };

    const formContainerStyle = {
        backgroundColor: vintageTheme.colors.cream,
        padding: "clamp(2rem, 5vw, 3rem)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(139, 69, 19, 0.2)",
        border: `3px solid ${vintageTheme.colors.gold}`,
        width: "100%",
        maxWidth: "450px",
        position: "relative",
        overflow: "hidden"
    };

    const decorativeElementStyle = {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        height: "5px",
        background: `linear-gradient(90deg, ${vintageTheme.colors.gold} 0%, ${vintageTheme.colors.primary} 50%, ${vintageTheme.colors.gold} 100%)`
    };

    const backButtonStyle = {
        position: "absolute",
        top: "1.5rem",
        left: "1.5rem",
        background: "transparent",
        border: "none",
        color: vintageTheme.colors.secondary,
        cursor: "pointer",
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "all 0.3s ease",
        fontFamily: "inherit"
    };

    const titleStyle = {
        textAlign: "center",
        marginBottom: "1.5rem",
        marginTop: "1rem",
        fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
        fontWeight: "bold",
        color: vintageTheme.colors.primary,
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
    };

    const subtitleStyle = {
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
        color: vintageTheme.colors.secondary,
        fontStyle: "italic",
        lineHeight: "1.6"
    };

    const inputGroupStyle = {
        marginBottom: "1.5rem",
        position: "relative"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: vintageTheme.colors.darkBrown,
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    };

    const inputStyle = {
        width: "100%",
        padding: "15px 50px 15px 15px",
        borderRadius: "12px",
        border: `2px solid ${passwordError && password ? vintageTheme.colors.errorRed : vintageTheme.colors.dustyRose}`,
        fontSize: "1rem",
        fontFamily: "inherit",
        backgroundColor: vintageTheme.colors.warmWhite,
        color: vintageTheme.colors.darkBrown,
        transition: "all 0.3s ease",
        boxSizing: "border-box"
    };

    const inputIconStyle = {
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: vintageTheme.colors.secondary,
        cursor: "pointer"
    };

    const passwordRequirementStyle = {
        marginTop: "0.5rem",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: passwordError
            ? `${vintageTheme.colors.errorRed}15`
            : passwordValid
                ? `${vintageTheme.colors.successGreen}15`
                : `${vintageTheme.colors.dustyRose}15`,
        color: passwordError
            ? vintageTheme.colors.errorRed
            : passwordValid
                ? vintageTheme.colors.successGreen
                : vintageTheme.colors.darkBrown,
        border: `1px solid ${passwordError
            ? vintageTheme.colors.errorRed
            : passwordValid
                ? vintageTheme.colors.successGreen
                : vintageTheme.colors.dustyRose}40`
    };

    const buttonStyle = {
        width: "100%",
        padding: "15px 24px",
        borderRadius: "25px",
        border: `2px solid ${vintageTheme.colors.sage}`,
        backgroundColor: vintageTheme.colors.sage,
        color: vintageTheme.colors.warmWhite,
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "1rem",
        fontFamily: "inherit",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        boxShadow: "0 6px 20px rgba(156, 175, 136, 0.3)",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginBottom: "1rem",
        marginTop: "1rem"
    };

    const messageStyle = {
        marginTop: "1rem",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "0.9rem",
        fontWeight: "500",
        backgroundColor: message.includes("failed") || message.includes("error")
            ? `${vintageTheme.colors.errorRed}15`
            : `${vintageTheme.colors.successGreen}15`,
        color: message.includes("failed") || message.includes("error")
            ? vintageTheme.colors.errorRed
            : vintageTheme.colors.successGreen,
        border: `1px solid ${message.includes("failed") || message.includes("error")
            ? vintageTheme.colors.errorRed
            : vintageTheme.colors.successGreen}40`
    };

    const dividerStyle = {
        margin: "1.5rem 0",
        textAlign: "center",
        position: "relative",
        color: vintageTheme.colors.secondary,
        fontSize: "0.9rem",
        fontStyle: "italic"
    };

    const dividerLineStyle = {
        height: "1px",
        backgroundColor: vintageTheme.colors.dustyRose,
        position: "absolute",
        top: "50%",
        left: "0",
        right: "0",
        zIndex: "1"
    };

    const dividerTextStyle = {
        backgroundColor: vintageTheme.colors.cream,
        padding: "0 1rem",
        position: "relative",
        zIndex: "2"
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <div style={decorativeElementStyle}></div>

                <button
                    onClick={handleBackToLogin}
                    style={backButtonStyle}
                    onMouseOver={(e) => {
                        e.target.style.color = vintageTheme.colors.primary;
                        e.target.style.transform = "translateX(-3px)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.color = vintageTheme.colors.secondary;
                        e.target.style.transform = "translateX(0)";
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </button>

                <h1 style={titleStyle}>
                    Join Our Community
                </h1>
                <p style={subtitleStyle}>
                    Create your account and start your vintage journey
                </p>

                <div>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                                placeholder="Enter your email"
                                onFocus={(e) => {
                                    e.target.style.borderColor = vintageTheme.colors.gold;
                                    e.target.style.boxShadow = `0 0 0 3px ${vintageTheme.colors.gold}30`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = vintageTheme.colors.dustyRose;
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                            <Mail size={18} style={{ ...inputIconStyle, top: "50%" }} />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                                placeholder="Create a strong password"
                                onFocus={(e) => {
                                    e.target.style.borderColor = passwordError
                                        ? vintageTheme.colors.errorRed
                                        : vintageTheme.colors.gold;
                                    e.target.style.boxShadow = passwordError
                                        ? `0 0 0 3px ${vintageTheme.colors.errorRed}30`
                                        : `0 0 0 3px ${vintageTheme.colors.gold}30`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = passwordError
                                        ? vintageTheme.colors.errorRed
                                        : vintageTheme.colors.dustyRose;
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ ...inputIconStyle, top: "50%" }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>

                        {password.length > 0 && (
                            <div style={passwordRequirementStyle}>
                                {passwordError ? (
                                    <>
                                        <AlertCircle size={16} />
                                        Password must be at least 6 characters long
                                    </>
                                ) : passwordValid ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Password meets requirements
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSignup}
                        style={buttonStyle}
                        disabled={passwordError || !email || !password}
                        onMouseOver={(e) => {
                            if (!e.target.disabled) {
                                e.target.style.backgroundColor = vintageTheme.colors.secondary;
                                e.target.style.borderColor = vintageTheme.colors.secondary;
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 8px 25px rgba(139, 69, 19, 0.4)";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!e.target.disabled) {
                                e.target.style.backgroundColor = vintageTheme.colors.sage;
                                e.target.style.borderColor = vintageTheme.colors.sage;
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 6px 20px rgba(156, 175, 136, 0.3)";
                            }
                        }}
                    >
                        <UserPlus size={18} />
                        Create Account
                    </button>
                </div>

                <div style={dividerStyle}>
                    <div style={dividerLineStyle}></div>
                    <span style={dividerTextStyle}>Already have an account?</span>
                </div>

                <button
                    onClick={handleBackToLogin}
                    style={{
                        ...buttonStyle,
                        backgroundColor: "transparent",
                        color: vintageTheme.colors.primary,
                        borderColor: vintageTheme.colors.primary,
                        boxShadow: "none",
                        marginBottom: 0
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = vintageTheme.colors.primary;
                        e.target.style.color = vintageTheme.colors.warmWhite;
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 20px rgba(139, 69, 19, 0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = vintageTheme.colors.primary;
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                    }}
                >
                    <ArrowLeft size={18} />
                    Back to Login
                </button>

                {message && (
                    <div style={messageStyle}>
                        {message}
                    </div>
                )}

                {/* Instructions for implementation */}
                <div style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    backgroundColor: `${vintageTheme.colors.gold}20`,
                    borderRadius: "8px",
                    border: `1px solid ${vintageTheme.colors.gold}`,
                    fontSize: "0.85rem",
                    color: vintageTheme.colors.darkBrown
                }}>
                    <strong>Implementation Note:</strong> Replace the demo handleSignup function with your original Firebase/API logic,
                    and replace handleBackToLogin with navigate("/").
                </div>
            </div>
        </div>
    );
}

export default Signup;
