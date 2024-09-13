import React, { useState, useContext } from "react";
import { MeetupContext } from '../contexts/MeetupContext';

const LinkInputComponent = () => {
    const [link, setLink] = useState("");
    const [topic, setTopic] = useState("");
    const { addLink } = useContext(MeetupContext);

    const handleAddLink = () => {
        if (link && topic) {
            addLink({ link, topic });
            setLink("");
            setTopic("");
        }
    };

    return (
        <div className="link-input">
            <input 
                type="text" 
                placeholder="Enter Google Meet link" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Enter Topic" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
            />
            <button onClick={handleAddLink}>Add Link</button>
        </div>
    );
};

export default LinkInputComponent;
