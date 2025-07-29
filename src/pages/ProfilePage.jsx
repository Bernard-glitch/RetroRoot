import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

function ProfilePage() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const [profile, setProfile] = useState({
        username: "vintage_lover",
        fullName: "",
        bio: "",
        location: "Selangor, Malaysia",
        joinDate: "Joined July 2024",
        profilePic: "",
        banner: ""
    });

    const [formData, setFormData] = useState(profile);
    const [editOpen, setEditOpen] = useState(false);

    const [postOpen, setPostOpen] = useState(false);
    const [postData, setPostData] = useState({ title: "", description: "", price: "", image: "" });
    const [posts, setPosts] = useState([]);

    const userRef = userId ? doc(db, "users", userId) : null;

    useEffect(() => {
        if (userId) fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data());
            setFormData(docSnap.data());
        }
    };

    const handlePostSubmit = async () => {
        if (!postData.title || !postData.description || !postData.price || !postData.image) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await addDoc(collection(db, "posts"), {
                userId,
                title: postData.title,
                description: postData.description,
                price: postData.price,
                image: postData.image,
                createdAt: serverTimestamp()
            });

            // Clear form
            setPostData({ title: "", description: "", price: "", image: "" });
            setPostOpen(false);
            fetchPosts();
        } catch (error) {
            console.error("Error posting item:", error);
            alert("Failed to post item.");
        }
    };

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

    // ----------- Posts --------------
    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setPostData((prev) => ({ ...prev, [name]: value }));
    };

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

    const fetchPosts = async () => {
        const postRef = collection(db, "posts");
        const querySnapshot = await getDocs(postRef);
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
                userPosts.push({ id: doc.id, ...data });
            }
        });
        setPosts(userPosts);
    };

    useEffect(() => {
        if (userId) fetchPosts();
    }, [userId]);

    // ------------- Styles -------------
    const modalOverlay = {
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 1000
    };

    const modalBox = {
        backgroundColor: "#fff", padding: "30px", borderRadius: "10px",
        width: "90%", maxWidth: "500px", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
        display: "flex", flexDirection: "column", gap: "15px"
    };

    const labelStyle = { fontWeight: "500", fontSize: "14px" };
    const inputStyle = {
        width: "100%", padding: "10px", borderRadius: "6px",
        border: "1px solid #ccc", fontSize: "14px"
    };
    const buttonStyle = {
        padding: "8px 16px", borderRadius: "20px", border: "none",
        backgroundColor: "#1da1f2", color: "#fff", cursor: "pointer", fontWeight: "600"
    };
    const cancelButton = { ...buttonStyle, backgroundColor: "#aaa" };

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f4f4", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Banner and Profile Picture */}
            <div style={{ width: "100%", position: "relative" }}>
                <img src={profile.banner} alt="Banner" style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                <img src={profile.profilePic} alt="Profile" style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid white", position: "absolute", bottom: "-60px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff" }} />
            </div>

            {/* Profile Info */}
            <div style={{ width: "100%", padding: "70px 30px 30px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderRadius: "0 0 10px 10px", textAlign: "center" }}>
                <h2>{profile.fullName}</h2>
                <p style={{ color: "#555" }}>@{profile.username}</p>
                <p>{profile.bio}</p>
                <div style={{ color: "#777", fontSize: "14px", display: "flex", justifyContent: "center", gap: "20px" }}>
                    <span>📍 {profile.location}</span>
                    <span>🗓 {profile.joinDate}</span>
                </div>

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
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleEditChange} style={inputStyle} />

                        <label style={labelStyle}>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleEditChange} rows="3" style={{ ...inputStyle, resize: "none" }} />

                        <label style={labelStyle}>Profile Picture URL</label>
                        <input type="text" name="profilePic" value={formData.profilePic} onChange={handleEditChange} style={inputStyle} />
                        <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />

                        <label style={labelStyle}>Banner Image URL</label>
                        <input type="text" name="banner" value={formData.banner} onChange={handleEditChange} style={inputStyle} />
                        <input type="file" name="banner" accept="image/*" onChange={handleFileChange} />

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                            <button onClick={() => setEditOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={saveChanges} style={buttonStyle}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Modal */}
            {postOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Create New Post</h3>

                        <label style={labelStyle}>Title</label>
                        <input type="text" name="title" value={postData.title} onChange={handlePostChange} style={inputStyle} />

                        <label style={labelStyle}>Description</label>
                        <textarea name="description" value={postData.description} onChange={handlePostChange} rows="3" style={{ ...inputStyle, resize: "none" }} />

                        <label style={labelStyle}>Price (RM)</label>
                        <input type="text" name="price" value={postData.price} onChange={handlePostChange} style={inputStyle} />

                        <label style={labelStyle}>Image</label>
                        <input type="file" accept="image/*" onChange={handlePostImageUpload} />
                        {postData.image && <img src={postData.image} alt="Preview" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px" }} />}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                            <button onClick={() => setPostOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={handlePostSubmit} style={buttonStyle}>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts */}
            <div style={{ padding: "30px", width: "100%", maxWidth: "700px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "20px" }}>My Posts</h3>
                    <button onClick={() => setPostOpen(true)} style={buttonStyle}>Add New Post</button>
                </div>

                {posts.length === 0 ? (
                    <p style={{ color: "#888" }}>No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                            <img src={post.image} alt={post.title} style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "6px" }} />
                            <h4 style={{ marginTop: "10px" }}>{post.title}</h4>
                            <p style={{ color: "#555" }}>{post.description}</p>
                            <strong style={{ color: "#1da1f2" }}>RM {post.price}</strong>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
