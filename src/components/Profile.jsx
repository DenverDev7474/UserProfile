/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";    
import axios from "axios";
import AvatarEditor from 'react-avatar-editor';
import "./profile.css";

const API_URL = "http://localhost:5000/user";

const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log("You have failed to fetch data: ", error);
            }
        };
        fetchData();
    }, [url]);

    return { data, loading, error } ;
};



const Profile = () => {
    const [currentUser, setCurrentUser] = useState({})
    const  { data: user, error, loading} = useFetchData(API_URL);   

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data!</p>;

    return (
        <div>
            <h1>Profile</h1>
                <ProfilePicture 
                    user={currentUser}
                    handleUserUpdate={setCurrentUser}                
                />
                <hr />
                <ProfileText 
                    user={currentUser} 
                    handleUserUpdate={setCurrentUser}                
                />
        </div>
    );

};



const ProfilePicture = ( {user, handleUserUpdate} ) => {
    const [scale, setScale] = useState(1);
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false); 
    const [showEditImageButton, setShowEditImageButton] = useState(false); 
    const avatarEditorRef = useRef();
    const { avatar } = user;

    const handleImageChange = e => setImage(e.target.files[0]);


    const handleUpload = async () => {
        const canvas = avatarEditorRef.current.getImage();
        const dataURL = canvas.toDataURL();
        const updatedUser = { ...user, avatar: dataURL };
        try {
            const response = await axios.put(API_URL, updatedUser);
            handleUserUpdate(response.data);
        } catch (error) {
            console.log("You have failed to upload an image: ", error);
        }
    };

    return (
        <div className="profilePicture" >
                {!editing ? (
                        <div className="avatarEditorContainer" >
                            <img src={avatar} alt="Avatar" 
                             onMouseOver={() => setShowEditImageButton(true)} 
                             onMouseOut={() => setShowEditImageButton(false)} 
                             />
                            {showEditImageButton && 
                                <button className="avatarEditButton"                             
                                    onMouseOver={() => setShowEditImageButton(true)} 
                                    onClick={() => setEditing(true)}
                                >
                                Edit
                                </button>
                            } 
                            </div>
                ) : (
                        <div className="avatarEditor">
                            <AvatarEditor 
                                ref={avatarEditorRef}
                                image={image || avatar}
                                width={250}
                                height={250}
                                border={50}
                                color={[255, 255, 255, 0.6]}
                                scale={scale}
                                rotate={0}
                            />
                            <input type="file" onChange={handleImageChange} />
                            <input type="range" value={scale} min="1" max="3" step="0.01" onChange={e => setScale(parseFloat(e.target.value))} />
                            <button onClick={handleUpload}>Save</button>
                            <button onClick={() => setEditing(false)}>Close</button>
                        </div>
                )}
                </div>
    );
};


const ProfileText = ({user, handleUserUpdate }) => {
    const [editing, setEditing] = useState(false);
    const { name, email } = user;

    const handleSave = async () => {
        try {
            await axios.put(API_URL, user);
            setEditing(false);
        } catch (error) {
            console.log("You have failed to save user data: ", error);
        }   
    };

    const handleNameChange = useCallback((e) => {
        handleUserUpdate({ ...user, name: e.target.value });
    }, [handleUserUpdate, user]);

    const handleEmailChange = useCallback((e) => {
        handleUserUpdate({ ...user, email: e.target.value });
    }, [handleUserUpdate, user]);




    return (
        <div className="profileText" >
        {!editing ? (
            <>
                <p>Username: {name}</p>
                <p>Email: {email}</p>
            </>
        ) : (
            <>
                <label> 
                    Username:
                    <input value={name} onChange={handleNameChange} />
                </label>
                <label>
                    Email:
                    <input value={email} onChange={handleEmailChange} />
                </label>
                <button onClick={handleSave}>Save</button>
            </>
        )}
         {!editing &&
        <button onClick={() => setEditing(!editing)}>Edit</button>
         }
        </div>
    );
};


export default Profile;
