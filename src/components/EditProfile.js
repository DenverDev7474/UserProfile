import axios from 'axios';
import React, { useState } from 'react';

const EditProfile = () => {
    const [editing, setEditing] = useState(false);

    const handleSave = async () => {
        await axios.put("http://localhost:5000/user", user);
        setEditing(false);
    };


    return (
        <div>   
            {!editing ? (
                <>
                    <img src={user.avatar} alt="Avatar" />
                    <p>Username: {user.name}</p>
                    <p>Email: {user.email}</p>
                </>
            ) : (
                <>
                    <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <button onClick={handleSave}>Save</button>
                </>
            )}
        </div>
    )
}


export default EditProfile;