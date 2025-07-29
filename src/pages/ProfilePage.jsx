import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

function ProfilePage() {
    // Post modal state
    const [postOpen, setPostOpen] = useState(false);
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: ""
    });

    // Handle post form changes
    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setPostData((prev) => ({ ...prev, [name]: value }));
    };

    // Image upload for post
    const handlePostImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPostData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Save new post (you can later extend this to save to Firestore)
    const savePost = () => {
        console.log("New post:", postData);
        setPostOpen(false);
        // Clear post data if needed
    };

    const userId = getAuth().currentUser.uid;
    const userRef = doc(db, "users", userId);

    const [profile, setProfile] = useState({
        username: "vintage_lover",
        fullName: "Retro Enthusiast",
        bio: "Hunting treasures, one vintage gem at a time.",
        location: "Selangor, Malaysia",
        joinDate: "Joined July 2024",
        profilePic: "https://via.placeholder.com/150",
        banner: "https://via.placeholder.com/800x240"
    });

    const [editOpen, setEditOpen] = useState(false);
    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        const fetchProfile = async () => {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data());
                setFormData(docSnap.data());
            }
        };
        fetchProfile();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            const fileRef = ref(storage, `${userId}/${name}`);
            await uploadBytes(fileRef, files[0]);
            const url = await getDownloadURL(fileRef);
            setFormData((prev) => ({ ...prev, [name]: url }));
        }
    };

    const saveChanges = async () => {
        await setDoc(userRef, formData);
        setProfile(formData);
        setEditOpen(false);
    };

    const modalOverlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    };

    const modalBox = {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    };

    const labelStyle = {
        fontWeight: "500",
        fontSize: "14px"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px"
    };

    const buttonStyle = {
        padding: "8px 16px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#1da1f2",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600"
    };

    const cancelButton = {
        ...buttonStyle,
        backgroundColor: "#aaa"
    };

    return (
        <div style={{
            fontFamily: "'Segoe UI', sans-serif",
            backgroundColor: "#f4f4f4",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            {/* Banner + Profile Picture */}
            <div style={{ width: "100%", position: "relative" }}>
                <img src={profile.banner} alt="Banner"
                    style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                <img src={profile.profilePic} alt="Profile"
                    style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        border: "4px solid white",
                        position: "absolute",
                        bottom: "-60px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#fff"
                    }} />
            </div>

            {/* Profile Info */}
            <div style={{
                width: "100%",
                padding: "70px 30px 30px",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderRadius: "0 0 10px 10px",
                textAlign: "center"
            }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "24px" }}>{profile.fullName}</h2>
                <p style={{ margin: "0 0 15px", color: "#555" }}>@{profile.username}</p>
                <p style={{ marginBottom: "10px" }}>{profile.bio}</p>
                <div style={{ color: "#777", fontSize: "14px", display: "flex", justifyContent: "center", gap: "20px" }}>
                    <span>📍 {profile.location}</span>
                    <span>🗓 {profile.joinDate}</span>
                </div>

                {/* Buttons */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button style={buttonStyle} onClick={() => setEditOpen(true)}>Edit Profile</button>
                    <button style={{ ...buttonStyle, backgroundColor: "#ff4d4d" }}>Logout</button>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Edit Profile</h3>

                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleEditChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleEditChange}
                            rows="3"
                            style={{ ...inputStyle, resize: "none" }}
                        />

                        <label style={labelStyle}>Profile Picture URL</label>
                        <input
                            type="text"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleEditChange}
                            style={inputStyle}
                        />
                        <input
                            type="file"
                            name="profilePic"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginBottom: "10px" }}
                        />

                        <label style={labelStyle}>Banner Image URL</label>
                        <input
                            type="text"
                            name="banner"
                            value={formData.banner}
                            onChange={handleEditChange}
                            style={inputStyle}
                        />
                        <input
                            type="file"
                            name="banner"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginBottom: "10px" }}
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                            <button onClick={() => setEditOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={saveChanges} style={buttonStyle}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {postOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Create New Post</h3>

                        <label style={labelStyle}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={postData.title}
                            onChange={handlePostChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Description</label>
                        <textarea
                            name="description"
                            value={postData.description}
                            onChange={handlePostChange}
                            rows="3"
                            style={{ ...inputStyle, resize: "none" }}
                        />

                        <label style={labelStyle}>Price (RM)</label>
                        <input
                            type="text"
                            name="price"
                            value={postData.price}
                            onChange={handlePostChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePostImageUpload}
                            style={{ marginBottom: "10px" }}
                        />
                        {postData.image && (
                            <img src={postData.image} alt="Preview"
                                style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px" }} />
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                            <button onClick={() => setPostOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={savePost} style={buttonStyle}>Post</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Posts Section with Add New Post Button */}
            <div style={{ padding: "30px", width: "100%", maxWidth: "700px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "10px",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "8px",
                        width: "100%"
                    }}>
                        <h3 style={{ fontSize: "20px", marginRight: "auto" }}>My Posts</h3>
                        <button onClick={() => setPostOpen(true)} style={buttonStyle}>Add New Post</button>
                    </div>

                </div>

                <p style={{ color: "#888" }}>No posts yet.</p>
            </div>
        </div>
    );
}

export default ProfilePage;
