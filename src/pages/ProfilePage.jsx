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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Camera, Edit3, Plus, Trash2, Save, X } from "lucide-react";
import Sidebar from "../component/SideBar";

function ProfilePage() {
    const auth = getAuth();
    const [userId, setUserId] = useState(null);

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
        imageFile: null,
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

    // Vintage color palette and styling
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
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchProfile(user.uid);
                fetchPosts(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchProfile = async (uid) => {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data());
            setFormData(docSnap.data());
        }
    };

    const fetchPosts = async (uid) => {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === uid) {
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
            setPostData((prev) => ({
                ...prev,
                imageFile: file,
                image: URL.createObjectURL(file),
            }));
        }
    };

    const handlePostSubmit = async () => {
        if (!postData.title || !postData.description || !postData.price || !postData.imageFile) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const fileRef = ref(storage, `${userId}/posts/${postData.imageFile.name}`);
            await uploadBytes(fileRef, postData.imageFile);
            const imageUrl = await getDownloadURL(fileRef);

            await addDoc(collection(db, "posts"), {
                userId,
                title: postData.title,
                description: postData.description,
                price: postData.price,
                image: imageUrl,
                createdAt: serverTimestamp(),
            });

            setPostData({ title: "", description: "", price: "", image: "", imageFile: null });
            setPostOpen(false);
            fetchPosts(userId);
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
            fetchPosts(userId);
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
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, formData);
        setProfile(formData);
        setEditOpen(false);
    };

    const containerStyle = {
        fontFamily: "'Georgia', 'Times New Roman', serif",
        backgroundColor: vintageTheme.colors.warmWhite,
        minHeight: '100vh',
        color: vintageTheme.colors.darkBrown,
        lineHeight: '1.6'
    };

    const profileContainerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: vintageTheme.colors.cream,
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.2)',
        border: `3px solid ${vintageTheme.colors.gold}`,
        marginBottom: '2rem'
    };

    const bannerStyle = {
        position: 'relative',
        height: '250px',
        backgroundImage: profile.banner ? `url(${profile.banner})` : 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
    };

    const bannerOverlay = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.4))',
    };

    const profilePicStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: `5px solid ${vintageTheme.colors.gold}`,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 2,
        transform: 'translateY(50%)',
        objectFit: 'cover',
        backgroundColor: vintageTheme.colors.cream
    };

    const profileInfoStyle = {
        textAlign: 'center',
        padding: '80px 2rem 2rem',
        background: `linear-gradient(135deg, ${vintageTheme.colors.cream} 0%, ${vintageTheme.colors.warmWhite} 100%)`
    };

    const nameStyle = {
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: vintageTheme.colors.primary,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
    };

    const usernameStyle = {
        fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
        color: vintageTheme.colors.secondary,
        marginBottom: '1rem',
        fontStyle: 'italic'
    };

    const bioStyle = {
        fontSize: 'clamp(0.9rem, 3vw, 1rem)',
        maxWidth: '500px',
        margin: '0 auto 1.5rem',
        color: vintageTheme.colors.darkBrown,
        lineHeight: '1.7'
    };

    const buttonGroupStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem'
    };

    const vintageButtonStyle = {
        padding: '12px 24px',
        borderRadius: '25px',
        border: `2px solid ${vintageTheme.colors.primary}`,
        backgroundColor: vintageTheme.colors.primary,
        color: vintageTheme.colors.warmWhite,
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const postsContainerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1rem'
    };

    const postsSectionTitle = {
        fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: vintageTheme.colors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const postCardStyle = {
        background: `linear-gradient(135deg, ${vintageTheme.colors.warmWhite} 0%, ${vintageTheme.colors.cream} 100%)`,
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
        border: `2px solid ${vintageTheme.colors.dustyRose}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    };

    const postImageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '1rem',
        border: `2px solid ${vintageTheme.colors.gold}`
    };

    const modalOverlay = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(139, 69, 19, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem'
    };

    const modalBox = {
        backgroundColor: vintageTheme.colors.warmWhite,
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        border: `3px solid ${vintageTheme.colors.gold}`,
        fontFamily: 'inherit'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: `2px solid ${vintageTheme.colors.dustyRose}`,
        fontSize: '1rem',
        fontFamily: 'inherit',
        backgroundColor: vintageTheme.colors.cream,
        color: vintageTheme.colors.darkBrown,
        transition: 'border-color 0.3s ease',
        boxSizing: 'border-box'
    };

    const modalTitleStyle = {
        fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
        marginBottom: '1.5rem',
        color: vintageTheme.colors.primary,
        textAlign: 'center',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <Sidebar />

            {/* Profile Section */}
            <div style={profileContainerStyle}>
                <div style={bannerStyle}>
                    <div style={bannerOverlay}></div>
                    <img
                        src={profile.profilePic || "https://via.placeholder.com/120x120?text=Profile"}
                        alt="Profile"
                        style={profilePicStyle}
                    />
                </div>

                <div style={profileInfoStyle}>
                    <h1 style={nameStyle}>{profile.fullName || "Your Name"}</h1>
                    <p style={usernameStyle}>@{profile.username}</p>
                    <p style={bioStyle}>{profile.bio || "Tell us about yourself and your vintage finds..."}</p>

                    <div style={buttonGroupStyle}>
                        <button
                            onClick={() => setEditOpen(true)}
                            style={vintageButtonStyle}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = vintageTheme.colors.secondary;
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = vintageTheme.colors.primary;
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.3)';
                            }}
                        >
                            <Edit3 size={16} />
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setPostOpen(true)}
                            style={{ ...vintageButtonStyle, backgroundColor: vintageTheme.colors.sage, borderColor: vintageTheme.colors.sage }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = vintageTheme.colors.secondary;
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = vintageTheme.colors.sage;
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.3)';
                            }}
                        >
                            <Plus size={16} />
                            New Listing
                        </button>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div style={postsContainerStyle}>
                <h2 style={postsSectionTitle}>My Collections</h2>
                {posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: vintageTheme.colors.cream,
                        borderRadius: '15px',
                        border: `2px solid ${vintageTheme.colors.dustyRose}`
                    }}>
                        <p style={{ fontSize: '1.1rem', color: vintageTheme.colors.secondary }}>
                            No treasures listed yet. Start sharing your vintage finds!
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            style={postCardStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(139, 69, 19, 0.25)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.15)';
                            }}
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                style={postImageStyle}
                            />
                            <h3 style={{
                                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                                marginBottom: '0.5rem',
                                color: vintageTheme.colors.primary,
                                fontWeight: 'bold'
                            }}>{post.title}</h3>
                            <p style={{
                                marginBottom: '1rem',
                                color: vintageTheme.colors.darkBrown,
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                            }}>{post.description}</p>
                            <p style={{
                                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                                fontWeight: 'bold',
                                color: vintageTheme.colors.gold,
                                marginBottom: '1rem'
                            }}>RM {post.price}</p>

                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    style={{ ...vintageButtonStyle, fontSize: '0.8rem', padding: '8px 16px' }}
                                    onClick={() => handleEditPostClick(post)}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = vintageTheme.colors.secondary;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = vintageTheme.colors.primary;
                                    }}
                                >
                                    <Edit3 size={14} />
                                    Edit
                                </button>
                                <button
                                    style={{
                                        ...vintageButtonStyle,
                                        backgroundColor: '#B8860B',
                                        borderColor: '#B8860B',
                                        fontSize: '0.8rem',
                                        padding: '8px 16px'
                                    }}
                                    onClick={() => deletePost(post.id)}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#8B4513';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#B8860B';
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Post Modal */}
            {postOpen && (
                <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && setPostOpen(false)}>
                    <div style={modalBox}>
                        <h3 style={modalTitleStyle}>Add New Treasure</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                name="title"
                                value={postData.title}
                                onChange={handlePostChange}
                                placeholder="Item Title"
                                style={inputStyle}
                            />
                            <textarea
                                name="description"
                                value={postData.description}
                                onChange={handlePostChange}
                                placeholder="Description"
                                rows="4"
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            <input
                                name="price"
                                value={postData.price}
                                onChange={handlePostChange}
                                placeholder="Price (RM)"
                                style={inputStyle}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePostImageUpload}
                                style={{ ...inputStyle, padding: '10px' }}
                            />
                            {postData.image && (
                                <img
                                    src={postData.image}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        border: `2px solid ${vintageTheme.colors.gold}`
                                    }}
                                />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setPostOpen(false)}
                                    style={{
                                        ...vintageButtonStyle,
                                        backgroundColor: vintageTheme.colors.dustyRose,
                                        borderColor: vintageTheme.colors.dustyRose
                                    }}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePostSubmit}
                                    style={vintageButtonStyle}
                                >
                                    <Save size={16} />
                                    Create Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {editPostOpen && (
                <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && setEditPostOpen(false)}>
                    <div style={modalBox}>
                        <h3 style={modalTitleStyle}>Edit Listing</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                name="title"
                                value={editPostData.title}
                                onChange={handleEditPostChange}
                                placeholder="Title"
                                style={inputStyle}
                            />
                            <textarea
                                name="description"
                                value={editPostData.description}
                                onChange={handleEditPostChange}
                                placeholder="Description"
                                rows="4"
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            <input
                                name="price"
                                value={editPostData.price}
                                onChange={handleEditPostChange}
                                placeholder="Price"
                                style={inputStyle}
                            />
                            <input
                                name="image"
                                value={editPostData.image}
                                onChange={handleEditPostChange}
                                placeholder="Image URL"
                                style={inputStyle}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setEditPostOpen(false)}
                                    style={{
                                        ...vintageButtonStyle,
                                        backgroundColor: vintageTheme.colors.dustyRose,
                                        borderColor: vintageTheme.colors.dustyRose
                                    }}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEditedPost}
                                    style={vintageButtonStyle}
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editOpen && (
                <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
                    <div style={modalBox}>
                        <h3 style={modalTitleStyle}>Edit Profile</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleEditChange}
                                placeholder="Full Name"
                                style={inputStyle}
                            />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleEditChange}
                                placeholder="Bio"
                                rows="3"
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            <input
                                name="profilePic"
                                value={formData.profilePic}
                                onChange={handleEditChange}
                                placeholder="Profile Picture URL"
                                style={inputStyle}
                            />
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                style={{ ...inputStyle, padding: '10px' }}
                            />
                            <input
                                name="banner"
                                value={formData.banner}
                                onChange={handleEditChange}
                                placeholder="Banner Image URL"
                                style={inputStyle}
                            />
                            <input
                                type="file"
                                name="banner"
                                onChange={handleFileChange}
                                style={{ ...inputStyle, padding: '10px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setEditOpen(false)}
                                    style={{
                                        ...vintageButtonStyle,
                                        backgroundColor: vintageTheme.colors.dustyRose,
                                        borderColor: vintageTheme.colors.dustyRose
                                    }}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={saveChanges}
                                    style={vintageButtonStyle}
                                >
                                    <Save size={16} />
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;