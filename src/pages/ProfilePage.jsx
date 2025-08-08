import React, { useState, useEffect } from "react";
import { User, MapPin, Calendar, Edit3, Plus, Heart, MessageCircle, Share } from "lucide-react";

function ProfilePage() {
    // Mock data for demonstration
    const [profile, setProfile] = useState({
        username: "vintage_lover",
        fullName: "Sarah Johnson",
        bio: "Passionate vintage collector & curator ✨ Finding beauty in timeless pieces. Sustainable fashion advocate 🌱",
        location: "Selangor, Malaysia",
        joinDate: "Joined July 2024",
        profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop",
        followers: 1234,
        following: 567,
        posts: 89
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

    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Vintage Leather Jacket",
            description: "Beautiful 1970s genuine leather jacket in excellent condition. Perfect for any vintage enthusiast!",
            price: "250",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
            likes: 24,
            comments: 8,
            createdAt: "2 days ago"
        },
        {
            id: 2,
            title: "Retro Sunglasses",
            description: "Classic aviator style from the 80s. No scratches, comes with original case.",
            price: "80",
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
            likes: 15,
            comments: 3,
            createdAt: "1 week ago"
        },
        {
            id: 3,
            title: "Vintage Band T-Shirt",
            description: "Original 1990s concert tee from a legendary rock band. Size M, great condition.",
            price: "120",
            image: "https://images.unsplash.com/photo-1583743814966-8936f37f82ef?w=400&h=400&fit=crop",
            likes: 32,
            comments: 12,
            createdAt: "2 weeks ago"
        }
    ]);

    const [editPostOpen, setEditPostOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostData, setEditPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

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

    const handlePostSubmit = () => {
        if (!postData.title || !postData.description || !postData.price) {
            alert("Please fill in all fields.");
            return;
        }

        const newPost = {
            id: Date.now(),
            ...postData,
            likes: 0,
            comments: 0,
            createdAt: "Just now"
        };

        setPosts([newPost, ...posts]);
        setPostData({ title: "", description: "", price: "", image: "", imageFile: null });
        setPostOpen(false);
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

    const saveEditedPost = () => {
        setPosts(posts.map(post =>
            post.id === editingPostId
                ? { ...post, ...editPostData }
                : post
        ));
        setEditPostOpen(false);
        setEditingPostId(null);
    };

    const deletePost = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (confirm) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const saveChanges = () => {
        setProfile(formData);
        setEditOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto">
                    {/* Banner */}
                    <div className="relative h-64 md:h-80">
                        <img
                            src={profile.banner}
                            alt="Profile banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
                            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                                <div className="relative">
                                    <img
                                        src={profile.profilePic}
                                        alt="Profile"
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                                </div>

                                <div className="mt-4 md:mt-0 md:mb-4">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                                    <p className="text-gray-600 text-lg">@{profile.username}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{profile.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{profile.joinDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-4 md:mt-0">
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors font-medium text-gray-700"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                                <button
                                    onClick={() => setPostOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>New Post</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-700 text-lg max-w-2xl">{profile.bio}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex space-x-8 mt-6 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.posts}</div>
                                <div className="text-sm text-gray-500">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.followers}</div>
                                <div className="text-sm text-gray-500">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.following}</div>
                                <div className="text-sm text-gray-500">Following</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
                    <div className="text-sm text-gray-500">{posts.length} items</div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <User className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-6">Share your first vintage find with the community!</p>
                        <button
                            onClick={() => setPostOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                        >
                            Create your first post
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                <div className="relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-900">
                                        RM {post.price}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                        <span>{post.createdAt}</span>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-1">
                                                <Heart className="w-4 h-4" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditPostClick(post)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg font-medium transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {postOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Create New Post</h3>
                        <div className="space-y-4">
                            <input
                                name="title"
                                value={postData.title}
                                onChange={handlePostChange}
                                placeholder="What are you selling?"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <textarea
                                name="description"
                                value={postData.description}
                                onChange={handlePostChange}
                                placeholder="Tell us about this item..."
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <input
                                name="price"
                                value={postData.price}
                                onChange={handlePostChange}
                                placeholder="Price (RM)"
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePostImageUpload}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {postData.image && (
                                <div className="relative">
                                    <img src={postData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setPostOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostSubmit}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Post Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editPostOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Post</h3>
                        <div className="space-y-4">
                            <input
                                name="title"
                                value={editPostData.title}
                                onChange={handleEditPostChange}
                                placeholder="Title"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <textarea
                                name="description"
                                value={editPostData.description}
                                onChange={handleEditPostChange}
                                placeholder="Description"
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <input
                                name="price"
                                value={editPostData.price}
                                onChange={handleEditPostChange}
                                placeholder="Price (RM)"
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setEditPostOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditedPost}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                        <div className="space-y-4">
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleEditChange}
                                placeholder="Full Name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleEditChange}
                                placeholder="Tell us about yourself..."
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleEditChange}
                                placeholder="Location"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;