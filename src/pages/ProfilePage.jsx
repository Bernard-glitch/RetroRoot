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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

    const [posts, setPosts] = useState([]);

    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostData, setEditPostData] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

    const userRef = userId ? doc(db, "users", userId) : null;

    useEffect(() => {
        const loadData = async () => {
            if (userId && userRef) {
                await fetchProfile();
                await fetchPosts();
            }
        };

        loadData();
    }, [userId, userRef]);

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
                createdAt: serverTimestamp(),
            });

            setPostData({ title: "", description: "", price: "", image: "" });
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
        new window.bootstrap.Modal(document.getElementById('editPostModal')).show();
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

            fetchPosts();
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
            modal.hide();
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
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();
    };

    return (
        <div className="container py-4">
            <div className="text-center mb-5">
                <div className="position-relative">
                    <img src={profile.banner} className="img-fluid w-100" style={{ height: "200px", objectFit: "cover" }} alt="Banner" />
                    <img src={profile.profilePic} className="rounded-circle position-absolute top-100 start-50 translate-middle border border-white" style={{ width: "100px", height: "100px" }} alt="Profile" />
                </div>
                <div className="mt-5">
                    <h2>{profile.fullName}</h2>
                    <p className="text-muted">@{profile.username}</p>
                    <p>{profile.bio}</p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">Edit Profile</button>
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Add New Post</button>
                    </div>
                </div>
            </div>

            <div className="mx-auto" style={{ maxWidth: '700px' }}>
                <h3 className="mb-3">My Posts</h3>
                {posts.length === 0 ? (
                    <p className="text-center">No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="card mb-4">
                            <img src={post.image} className="card-img-top" alt={post.title} style={{ height: '180px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.description}</p>
                                <p className="fw-bold">RM {post.price}</p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-primary" onClick={() => handleEditPostClick(post)}>Edit</button>
                                    <button className="btn btn-outline-danger" onClick={() => deletePost(post.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Profile</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input name="fullName" value={formData.fullName} onChange={handleEditChange} className="form-control mb-2" placeholder="Full Name" />
                            <textarea name="bio" value={formData.bio} onChange={handleEditChange} className="form-control mb-2" placeholder="Bio" rows="2" />
                            <input name="profilePic" value={formData.profilePic} onChange={handleEditChange} className="form-control mb-2" placeholder="Profile Pic URL" />
                            <input type="file" name="profilePic" onChange={handleFileChange} className="form-control mb-2" />
                            <input name="banner" value={formData.banner} onChange={handleEditChange} className="form-control mb-2" placeholder="Banner URL" />
                            <input type="file" name="banner" onChange={handleFileChange} className="form-control mb-2" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={saveChanges}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="postModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Post</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input name="title" value={postData.title} onChange={handlePostChange} className="form-control mb-2" placeholder="Title" />
                            <textarea name="description" value={postData.description} onChange={handlePostChange} className="form-control mb-2" placeholder="Description" rows="3" />
                            <input name="price" value={postData.price} onChange={handlePostChange} className="form-control mb-2" placeholder="Price" />
                            <input type="file" accept="image/*" onChange={handlePostImageUpload} className="form-control mb-2" />
                            {postData.image && <img src={postData.image} alt="preview" className="img-fluid" />}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-success" onClick={handlePostSubmit}>Post</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editPostModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Post</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input name="title" value={editPostData.title} onChange={handleEditPostChange} className="form-control mb-2" placeholder="Title" />
                            <textarea name="description" value={editPostData.description} onChange={handleEditPostChange} className="form-control mb-2" placeholder="Description" rows="3" />
                            <input name="price" value={editPostData.price} onChange={handleEditPostChange} className="form-control mb-2" placeholder="Price" />
                            <input name="image" value={editPostData.image} onChange={handleEditPostChange} className="form-control mb-2" placeholder="Image URL" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={saveEditedPost}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
