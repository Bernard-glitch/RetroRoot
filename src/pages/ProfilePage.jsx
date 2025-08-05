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
import { Camera, Edit3, Plus, MapPin, Calendar, X, Trash2, DollarSign, Image, Upload } from "lucide-react";
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

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        try {
            setLoading(true);
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const profileData = docSnap.data();
                setProfile(profileData);
                setFormData(profileData);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async (uid) => {
        try {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const userPosts = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === uid) {
                    userPosts.push({ id: doc.id, ...data });
                }
            });
            // Sort posts by creation date (newest first)
            userPosts.sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                    return b.createdAt.toDate() - a.createdAt.toDate();
                }
                return 0;
            });
            setPosts(userPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setPostData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePostImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            setPostData((prev) => ({
                ...prev,
                imageFile: file,
                image: URL.createObjectURL(file),
            }));
        }
    };

    const handlePostSubmit = async () => {
        if (!postData.title || !postData.description || !postData.price || !postData.imageFile) {
            alert("Please fill in all fields and select an image.");
            return;
        }

        if (!userId) {
            alert("You must be logged in to create a post.");
            return;
        }

        try {
            setUploading(true);

            // Upload image to Firebase Storage
            const timestamp = Date.now();
            const fileRef = ref(storage, `${userId}/posts/${timestamp}_${postData.imageFile.name}`);
            await uploadBytes(fileRef, postData.imageFile);
            const imageUrl = await getDownloadURL(fileRef);

            // Save post to Firestore
            await addDoc(collection(db, "posts"), {
                userId,
                title: postData.title,
                description: postData.description,
                price: parseFloat(postData.price),
                image: imageUrl,
                createdAt: serverTimestamp(),
            });

            // Reset form and close modal
            setPostData({ title: "", description: "", price: "", image: "", imageFile: null });
            setPostOpen(false);

            // Refresh posts
            fetchPosts(userId);

            alert("Post created successfully!");
        } catch (error) {
            console.error("Error posting item:", error);
            alert("Failed to post item. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleEditPostClick = (post) => {
        setEditingPostId(post.id);
        setEditPostData({
            title: post.title,
            description: post.description,
            price: post.price.toString(),
            image: post.image,
        });
        setEditPostOpen(true);
    };

    const handleEditPostChange = (e) => {
        const { name, value } = e.target;
        setEditPostData((prev) => ({ ...prev, [name]: value }));
    };

    const saveEditedPost = async () => {
        if (!editingPostId || !editPostData.title || !editPostData.description || !editPostData.price) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            setUploading(true);

            await setDoc(doc(db, "posts", editingPostId), {
                ...editPostData,
                price: parseFloat(editPostData.price),
                userId,
                updatedAt: serverTimestamp(),
            }, { merge: true });

            setEditPostOpen(false);
            setEditingPostId(null);
            fetchPosts(userId);

            alert("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const deletePost = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "posts", id));
            setPosts((prev) => prev.filter((p) => p.id !== id));
            alert("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files[0] && userId) {
            // Validate file size (max 5MB)
            if (files[0].size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            try {
                setUploading(true);
                const timestamp = Date.now();
                const fileRef = ref(storage, `${userId}/${name}/${timestamp}_${files[0].name}`);
                await uploadBytes(fileRef, files[0]);
                const url = await getDownloadURL(fileRef);
                setFormData((prev) => ({ ...prev, [name]: url }));
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const saveChanges = async () => {
        if (!userId) {
            alert("You must be logged in to save changes.");
            return;
        }

        try {
            setUploading(true);
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, formData, { merge: true });
            setProfile(formData);
            setEditOpen(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <Sidebar />

            {/* Header Section */}
            <div className="relative overflow-hidden">
                {/* Banner */}
                <div className="relative h-80 group">
                    <img
                        src={profile.banner || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop"}
                        alt="banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Edit Banner Button */}
                    <button
                        onClick={() => setEditOpen(true)}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        disabled={uploading}
                    >
                        <Camera size={20} />
                    </button>
                </div>

                {/* Profile Info Overlay */}
                <div className="relative -mt-20 px-6 pb-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Profile Picture */}
                            <div className="relative group">
                                <img
                                    src={profile.profilePic || "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face"}
                                    alt="profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face";
                                    }}
                                />
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    disabled={uploading}
                                >
                                    <Camera className="text-white" size={24} />
                                </button>
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1 text-center md:text-left text-white">
                                <h1 className="text-3xl font-bold mb-2">{profile.fullName || "Update your name"}</h1>
                                <p className="text-xl text-white/90 mb-3">@{profile.username}</p>
                                <p className="text-white/80 max-w-md mx-auto md:mx-0 mb-4">{profile.bio || "Add a bio to tell others about yourself"}</p>

                                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{profile.joinDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    <Edit3 size={18} />
                                    {uploading ? "Updating..." : "Edit Profile"}
                                </button>
                                <button
                                    onClick={() => setPostOpen(true)}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    <Plus size={18} />
                                    New Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
                    <span className="text-gray-500">{posts.length} items</span>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Image className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-6">Share your first vintage find with the community!</p>
                        <button
                            onClick={() => setPostOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                            disabled={uploading}
                        >
                            Create Your First Post
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => handleEditPostClick(post)}
                                            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                                            disabled={uploading}
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50"
                                            disabled={uploading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                            <DollarSign size={14} />
                                            RM {formatPrice(post.price)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{post.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {postOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
                            <button
                                onClick={() => setPostOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    name="title"
                                    value={postData.title}
                                    onChange={handlePostChange}
                                    placeholder="What are you selling?"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={postData.description}
                                    onChange={handlePostChange}
                                    placeholder="Tell us about this item..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={500}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (RM) *</label>
                                <input
                                    name="price"
                                    value={postData.price}
                                    onChange={handlePostChange}
                                    placeholder="0.00"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePostImageUpload}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Upload className="animate-pulse text-purple-600" size={20} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                                {postData.image && (
                                    <img
                                        src={postData.image}
                                        alt="preview"
                                        className="mt-3 w-full h-32 object-cover rounded-xl"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setPostOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostSubmit}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !postData.title || !postData.description || !postData.price || !postData.imageFile}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Posting...
                                    </>
                                ) : (
                                    "Post Item"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {editPostOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Edit Post</h3>
                            <button
                                onClick={() => setEditPostOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    name="title"
                                    value={editPostData.title}
                                    onChange={handleEditPostChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={editPostData.description}
                                    onChange={handleEditPostChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={500}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (RM) *</label>
                                <input
                                    name="price"
                                    value={editPostData.price}
                                    onChange={handleEditPostChange}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    name="image"
                                    value={editPostData.image}
                                    onChange={handleEditPostChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                                {editPostData.image && (
                                    <img
                                        src={editPostData.image}
                                        alt="preview"
                                        className="mt-3 w-full h-32 object-cover rounded-xl"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setEditPostOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditedPost}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !editPostData.title || !editPostData.description || !editPostData.price}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleEditChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleEditChange}
                                    placeholder="Tell others about yourself..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={200}
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.bio?.length || 0}/200 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                <input
                                    name="profilePic"
                                    value={formData.profilePic}
                                    onChange={handleEditChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 mb-2"
                                    disabled={uploading}
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="profilePic"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Upload className="animate-pulse text-purple-600" size={20} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload a new image or enter a URL above. Max 5MB.</p>
                                {formData.profilePic && (
                                    <img
                                        src={formData.profilePic}
                                        alt="profile preview"
                                        className="mt-3 w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                                <input
                                    name="banner"
                                    value={formData.banner}
                                    onChange={handleEditChange}
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 mb-2"
                                    disabled={uploading}
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="banner"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Upload className="animate-pulse text-purple-600" size={20} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload a new banner or enter a URL above. Max 5MB.</p>
                                {formData.banner && (
                                    <img
                                        src={formData.banner}
                                        alt="banner preview"
                                        className="mt-3 w-full h-20 object-cover rounded-xl border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;