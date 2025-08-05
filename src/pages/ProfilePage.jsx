import React, { useState, useEffect } from "react";
import { Camera, Edit3, Plus, MapPin, Calendar, X, Trash2, DollarSign, Image, Upload, Heart, Share2, MoreHorizontal, Star, TrendingUp } from "lucide-react";
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

function ProfilePage() {
    const auth = getAuth();
    const [userId, setUserId] = useState(null);

    const [profile, setProfile] = useState({
        username: "vintage_lover",
        fullName: "Sarah Chen",
        bio: "Passionate vintage collector & sustainable fashion advocate. Finding beauty in pre-loved treasures ✨",
        location: "Selangor, Malaysia",
        joinDate: "Joined July 2024",
        profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face",
        banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
        followers: 1247,
        following: 892,
        totalSales: 156,
        rating: 4.9
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
    const [activeTab, setActiveTab] = useState('posts');

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
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setProfile(prev => ({ ...prev, ...userData }));
                setFormData(prev => ({ ...prev, ...userData }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchPosts = async (uid) => {
        try {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const userPosts = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === uid) {
                    userPosts.push({ 
                        id: doc.id, 
                        ...data,
                        likes: data.likes || 0,
                        createdAt: data.createdAt?.toDate() || new Date()
                    });
                }
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

        try {
            setUploading(true);
            
            // Upload image to Firebase Storage
            const fileRef = ref(storage, `${userId}/posts/${postData.imageFile.name}`);
            await uploadBytes(fileRef, postData.imageFile);
            const imageUrl = await getDownloadURL(fileRef);

            // Add post to Firestore
            await addDoc(collection(db, "posts"), {
                userId,
                title: postData.title,
                description: postData.description,
                price: parseFloat(postData.price),
                image: imageUrl,
                likes: 0,
                createdAt: serverTimestamp(),
            });

            setPostData({ title: "", description: "", price: "", image: "", imageFile: null });
            setPostOpen(false);
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
                userId,
                price: parseFloat(editPostData.price),
                updatedAt: serverTimestamp(),
            });

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
        if (files[0]) {
            try {
                const fileRef = ref(storage, `${userId}/${name}`);
                await uploadBytes(fileRef, files[0]);
                const url = await getDownloadURL(fileRef);
                setFormData((prev) => ({ ...prev, [name]: url }));
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Failed to upload file. Please try again.");
            }
        }
    };

    const saveChanges = async () => {
        try {
            setUploading(true);
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, formData);
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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden bg-white shadow-sm">
                {/* Banner with Overlay Effects */}
                <div className="relative h-80 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                    <img
                        src={profile.banner}
                        alt="banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Floating Edit Button */}
                    <button
                        onClick={() => setEditOpen(true)}
                        className="absolute top-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20"
                        disabled={uploading}
                    >
                        <Camera size={20} />
                    </button>
                </div>

                {/* Enhanced Profile Info */}
                <div className="relative -mt-24 px-6 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
                            {/* Enhanced Profile Picture */}
                            <div className="relative group flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={profile.profilePic}
                                        alt="profile"
                                        className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop&crop=face";
                                        }}
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg"></div>
                                </div>
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    disabled={uploading}
                                >
                                    <Camera className="text-white" size={24} />
                                </button>
                            </div>

                            {/* Enhanced Profile Details */}
                            <div className="flex-1 text-white lg:mb-4">
                                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text">
                                            {profile.fullName || "Update your name"}
                                        </h1>
                                        <p className="text-xl text-white/90 mb-3">@{profile.username}</p>
                                        <p className="text-white/80 max-w-md mb-4 leading-relaxed">
                                            {profile.bio || "Add a bio to tell others about yourself"}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 mb-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>{profile.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span>{profile.joinDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star size={16} className="text-yellow-400" />
                                                <span>{profile.rating} rating</span>
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex gap-8 text-white">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{profile.followers?.toLocaleString()}</div>
                                                <div className="text-sm text-white/70">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{profile.following?.toLocaleString()}</div>
                                                <div className="text-sm text-white/70">Following</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{profile.totalSales}</div>
                                                <div className="text-sm text-white/70">Sales</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Action Buttons */}
                                    <div className="flex gap-3 flex-shrink-0">
                                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-2xl transition-all duration-300 border border-white/20">
                                            <Share2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setEditOpen(true)}
                                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 border border-white/20 disabled:opacity-50"
                                            disabled={uploading}
                                        >
                                            <Edit3 size={18} />
                                            {uploading ? "Updating..." : "Edit Profile"}
                                        </button>
                                        <button
                                            onClick={() => setPostOpen(true)}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
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
                </div>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
                    <div className="flex gap-2">
                        {[
                            { id: 'posts', label: 'My Posts', count: posts.length },
                            { id: 'favorites', label: 'Favorites', count: 42 },
                            { id: 'reviews', label: 'Reviews', count: 28 }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enhanced Posts Grid */}
                {activeTab === 'posts' && (
                    <>
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Image className="text-indigo-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">Share your first vintage find with the community and start building your collection!</p>
                                <button
                                    onClick={() => setPostOpen(true)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    Create Your First Post
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <div key={post.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-gray-100">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                            {/* Enhanced Action Buttons */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-red-500 p-2.5 rounded-xl transition-all duration-200 shadow-lg">
                                                    <Heart size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditPostClick(post)}
                                                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2.5 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50"
                                                    disabled={uploading}
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    className="bg-red-500/90 backdrop-blur-sm hover:bg-red-500 text-white p-2.5 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50"
                                                    disabled={uploading}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Enhanced Price Tag */}
                                            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                                                <div className="flex items-center gap-1 font-bold text-gray-900">
                                                    <DollarSign size={16} className="text-green-600" />
                                                    RM {formatPrice(post.price)}
                                                </div>
                                            </div>

                                            {/* Likes Badge */}
                                            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Heart size={14} className="text-red-500 fill-current" />
                                                    <span className="font-medium">{post.likes}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-1">{post.title}</h3>
                                            <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4">{post.description}</p>

                                            {/* Enhanced Post Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <TrendingUp size={14} />
                                                        <span>12 views</span>
                                                    </div>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Placeholder content for other tabs */}
                {activeTab === 'favorites' && (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <Heart className="text-red-500 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Favorites</h3>
                        <p className="text-gray-500">Items you've liked will appear here</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <Star className="text-yellow-500 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
                        <p className="text-gray-500">Customer reviews will be displayed here</p>
                    </div>
                )}
            </div>

            {/* Enhanced Create Post Modal */}
            {postOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                            <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
                            <button
                                onClick={() => setPostOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Title *</label>
                                <input
                                    name="title"
                                    value={postData.title}
                                    onChange={handlePostChange}
                                    placeholder="What are you selling?"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-lg"
                                    disabled={uploading}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description *</label>
                                <textarea
                                    name="description"
                                    value={postData.description}
                                    onChange={handlePostChange}
                                    placeholder="Tell us about this item..."
                                    rows="4"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-2">{postData.description?.length || 0}/500 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Price (RM) *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="price"
                                        value={postData.price}
                                        onChange={handlePostChange}
                                        placeholder="0.00"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-lg"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Image *</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all duration-200">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePostImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        disabled={uploading}
                                    />
                                    {postData.image ? (
                                        <img
                                            src={postData.image}
                                            alt="preview"
                                            className="w-full h-40 object-cover rounded-xl mb-4"
                                        />
                                    ) : (
                                        <div className="py-8">
                                            <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                                            <p className="text-gray-600 font-medium">Click to upload an image</p>
                                            <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-4 rounded-b-3xl">
                            <button
                                onClick={() => setPostOpen(false)}
                                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostSubmit}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !postData.title || !postData.description || !postData.price || !postData.imageFile}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

            {/* Enhanced Edit Post Modal */}
            {editPostOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
                            <button
                                onClick={() => setEditPostOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Title *</label>
                                <input
                                    name="title"
                                    value={editPostData.title}
                                    onChange={handleEditPostChange}
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-lg"
                                    disabled={uploading}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Description *</label>
                                <textarea
                                    name="description"
                                    value={editPostData.description}
                                    onChange={handleEditPostChange}
                                    rows="4"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-2">{editPostData.description?.length || 0}/500 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Price (RM) *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="price"
                                        value={editPostData.price}
                                        onChange={handleEditPostChange}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-lg"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Image URL</label>
                                <input
                                    name="image"
                                    value={editPostData.image}
                                    onChange={handleEditPostChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                                {editPostData.image && (
                                    <img
                                        src={editPostData.image}
                                        alt="preview"
                                        className="mt-4 w-full h-40 object-cover rounded-2xl border-2 border-gray-100"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-4 rounded-b-3xl">
                            <button
                                onClick={() => setEditPostOpen(false)}
                                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditedPost}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !editPostData.title || !editPostData.description || !editPostData.price}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

            {/* Enhanced Edit Profile Modal */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleEditChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-lg"
                                    disabled={uploading}
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleEditChange}
                                    placeholder="Tell others about yourself..."
                                    rows="4"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                                    disabled={uploading}
                                    maxLength={200}
                                />
                                <p className="text-xs text-gray-500 mt-2">{formData.bio?.length || 0}/200 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleEditChange}
                                        placeholder="Your location"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture URL</label>
                                <input
                                    name="profilePic"
                                    value={formData.profilePic}
                                    onChange={handleEditChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                                {formData.profilePic && (
                                    <div className="mt-4 flex justify-center">
                                        <img
                                            src={formData.profilePic}
                                            alt="profile preview"
                                            className="w-24 h-24 object-cover rounded-2xl border-2 border-gray-200 shadow-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Banner Image URL</label>
                                <input
                                    name="banner"
                                    value={formData.banner}
                                    onChange={handleEditChange}
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                    disabled={uploading}
                                />
                                {formData.banner && (
                                    <img
                                        src={formData.banner}
                                        alt="banner preview"
                                        className="mt-4 w-full h-24 object-cover rounded-2xl border-2 border-gray-200 shadow-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-4 rounded-b-3xl">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
