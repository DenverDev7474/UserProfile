import { useState, useEffect, useRef } from "react";    
import axios from "axios";
import AvatarEditor from 'react-avatar-editor';


const Profile = () => {
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [scale, setScale] = useState(1);
    const avatarEditorRef = useRef();

    const handleSave = async () => {
        try {
            const response = await axios.put("http://localhost:5000/user", user);
            setUser(response.data);
            setEditing(false);
        } catch (error) {
            console.log("You have failed to save user data: ", error);
        }   
    };

    const handleImageChange = e => setImage(e.target.files[0]);

    const handleUpload = async () => {
        const canvas = avatarEditorRef.current.getImage();
        const dataURL = canvas.toDataURL();
        const updatedUser = { ...user, avatar: dataURL };
        try {
            const response = await axios.put("http://localhost:5000/user", updatedUser);
            setUser(response.data);
        } catch (error) {
            console.log("You have failed to upload an image: ", error);
        }
    };


    useEffect(() => {
        async function fetchData() {
            const result = await axios.get("http://localhost:5000/user");
            setUser(result.data);
        }
        fetchData();
    }, []);


    return (
        <div>
            <h1>Profile</h1>
            {!editing ? (
                <>
                    <img src={user.avatar} alt="Avatar" />
                    <p>Username: {user.name}</p>
                    <p>Email: {user.email}</p>
                </>
            ) : (
                <>
                    <div>
                        <AvatarEditor 
                            ref={avatarEditorRef}
                            image={image}
                            width={250}
                            height={250}
                            border={50}
                            color={[255, 255, 255, 0.6]}
                            scale={scale}
                            rotate={0}
                        />
                        <input type="file" onChange={handleImageChange} />
                        <input type="range" value={scale} min="1" max="3" step="0.01" onChange={e => setScale(parseFloat(e.target.value))} />
                        <button onClick={handleUpload}>Upload Avatar</button>
                    </div>

                    <hr />  

                    <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <button onClick={handleSave}>Save</button>
                </>
            )}
            <button onClick={() => setEditing(true)}>Edit</button>
        </div>
    );

};

export default Profile;
