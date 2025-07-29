import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    collection,
    getDocs,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import Sidebar from "../component/SideBar";

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
        banner: "",
    });

    const [formData, setFormData] = useState(profile);
    const [editOpen, setEditOpen] = useState(false);

    const [postOpen, setPostOpen] = useState(false);
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

    const [posts, setPosts] = useState([]);

    const [editPostOpen, setEditPostOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostData, setEditPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

    const userRef = userId ? doc(db, "users", userId) : null;

    useEffect(() => {
        if (userId) {
            fetchProfile();
            fetchPosts();
        }
    }, [userId]);

    const fetchProfile = async () => {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data());
            setFormData(docSnap.data());
        }
    };

    const fetchPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
                userPosts.push({ id: doc.id, ...data });
            }
        });
        setPosts(userPosts);
    };

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

    const handlePostSubmit = async () => {
        if (
            !postData.title ||
            !postData.description ||
            !postData.price ||
            !postData.image
        ) {
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
                createdAt: serverTimestamp(),
            });

            setPostData({ title: "", description: "", price: "", image: "" });
            setPostOpen(false);
            fetchPosts();
        } catch (error) {
            console.error("Error posting item:", error);
            alert("Failed to post item.");
        }
    };

    const handleEditPostClick = (post) => {
        setEditingPostId(post.id);
        setEditPostData({
            title: post.title,
            description: post.description,
            price: post.price,
            image: post.image,
        });
        setEditPostOpen(true);
    };

    const handleEditPostChange = (e) => {
        const { name, value } = e.target;
        setEditPostData((prev) => ({ ...prev, [name]: value }));
    };

    const saveEditedPost = async () => {
        if (!editingPostId) return;

        try {
            await setDoc(doc(db, "posts", editingPostId), {
                ...editPostData,
                userId,
                updatedAt: serverTimestamp(),
            });

            setEditPostOpen(false);
            setEditingPostId(null);
            fetchPosts();
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post.");
        }
    };

    const deletePost = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (!confirm) return;

        try {
            await deleteDoc(doc(db, "posts", id));
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post.");
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
        zIndex: 1000,
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
        gap: "15px",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
    };
    const buttonStyle = {
        padding: "8px 16px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#1da1f2",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
    };
    const cancelButton = { ...buttonStyle, backgroundColor: "#aaa" };

    return (
        <div style={{ fontFamily: "Segoe UI, sans-serif" }}>
            {/* Profile Display */}
            <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ position: "relative" }}>
                    <img
                        src={profile.banner}
                        alt="banner"
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        src={profile.profilePic}
                        alt="profile"
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            position: "absolute",
                            bottom: "-50px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            border: "3px solid white",
                        }}
                    />
                </div>

                <div style={{ marginTop: "60px" }}>
                    <h2 style={{ fontSize: "1.5rem" }}>{profile.fullName}</h2>
                    <p style={{ color: "#555" }}>@{profile.username}</p>
                    <p style={{ padding: "0 10px" }}>{profile.bio}</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                        <button onClick={() => setEditOpen(true)} style={buttonStyle}>Edit Profile</button>
                        <button onClick={() => setPostOpen(true)} style={{ ...buttonStyle, marginLeft: 0 }}>Add New Post</button>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>My Posts</h3>
                {posts.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} style={{
                            background: "#fff",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "15px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                        }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "6px"
                                }}
                            />
                            <h4>{post.title}</h4>
                            <p>{post.description}</p>
                            <p><strong>RM {post.price}</strong></p>
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                <button style={buttonStyle} onClick={() => handleEditPostClick(post)}>Edit</button>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: "#ff4d4d" }}
                                    onClick={() => deletePost(post.id)}
                                >Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Post Modal */}
            {postOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Create New Post</h3>
                        <input name="title" value={postData.title} onChange={handlePostChange} placeholder="Title" style={inputStyle} />
                        <textarea name="description" value={postData.description} onChange={handlePostChange} placeholder="Description" rows="3" style={inputStyle} />
                        <input name="price" value={postData.price} onChange={handlePostChange} placeholder="Price" style={inputStyle} />
                        <input type="file" accept="image/*" onChange={handlePostImageUpload} />
                        {postData.image && <img src={postData.image} alt="preview" style={{ maxWidth: "100%" }} />}
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button onClick={() => setPostOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={handlePostSubmit} style={buttonStyle}>Post</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {editPostOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Edit Post</h3>
                        <input name="title" value={editPostData.title} onChange={handleEditPostChange} placeholder="Title" style={inputStyle} />
                        <textarea name="description" value={editPostData.description} onChange={handleEditPostChange} placeholder="Description" rows="3" style={inputStyle} />
                        <input name="price" value={editPostData.price} onChange={handleEditPostChange} placeholder="Price" style={inputStyle} />
                        <input name="image" value={editPostData.image} onChange={handleEditPostChange} placeholder="Image URL" style={inputStyle} />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button onClick={() => setEditPostOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={saveEditedPost} style={buttonStyle}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editOpen && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3>Edit Profile</h3>
                        <input name="fullName" value={formData.fullName} onChange={handleEditChange} placeholder="Full Name" style={inputStyle} />
                        <textarea name="bio" value={formData.bio} onChange={handleEditChange} placeholder="Bio" rows="2" style={inputStyle} />
                        <input name="profilePic" value={formData.profilePic} onChange={handleEditChange} placeholder="Profile Pic URL" style={inputStyle} />
                        <input type="file" name="profilePic" onChange={handleFileChange} />
                        <input name="banner" value={formData.banner} onChange={handleEditChange} placeholder="Banner URL" style={inputStyle} />
                        <input type="file" name="banner" onChange={handleFileChange} />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button onClick={() => setEditOpen(false)} style={cancelButton}>Cancel</button>
                            <button onClick={saveChanges} style={buttonStyle}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
