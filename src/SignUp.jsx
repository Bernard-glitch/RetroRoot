import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


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
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
                <form onSubmit={handleSignup}>
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
                    {password.length > 0 && password.length < 6 && (
                        <p style={{ color: "red", marginBottom: "10px" }}>
                            Password must be at least 6 characters long.
                        </p>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Sign Up
                    </button>
                </form>
                {message && <p style={{ marginTop: 15, color: "green", textAlign: "center" }}>{message}</p>}
            </div>
        </div>
    );
}

export default Signup;
