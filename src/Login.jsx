import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // To navigate to /signup

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "https://712acae1-2bfb-4fde-9185-b296031b6ad5-00-3fl8pnkj0cmlc.sisko.replit.dev/login",
                { email, password }
            );

            setMessage(res.data.message);
            console.log("User:", res.data.user);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/home");
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f0f2f5"
        }}>
            <div style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "400px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: 15 }}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginBottom: "10px"
                        }}
                    >
                        Login
                    </button>
                </form>

                {/* Sign Up button */}
                <button
                    onClick={() => navigate("/signup")}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Sign Up
                </button>

                {message && <p style={{ marginTop: 15, color: "red", textAlign: "center" }}>{message}</p>}
            </div>
        </div>
    );
}

export default Login;


