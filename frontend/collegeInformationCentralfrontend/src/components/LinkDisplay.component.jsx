import React, { useContext, useState } from "react";
import { MeetupContext } from '../contexts/MeetupContext';

const LinksDisplayComponent = () => {
    const { links } = useContext(MeetupContext);
    const [selectedTopic, setSelectedTopic] = useState("");

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
    };

    const filteredLinks = selectedTopic ? links.filter(link => link.topic === selectedTopic) : links;

    return (
        <div className="links-display">
            <div className="topics">
                {["College Info", "Coding", "General Talks"].map((topic) => (
                    <button key={topic} onClick={() => handleTopicChange(topic)}>
                        {topic}
                    </button>
                ))}
            </div>
            <div className="links-list">
                {filteredLinks.length > 0 ? (
                    filteredLinks.map((link, index) => (
                        <div key={index} className="link-item">
                            <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
                            <p>{link.topic}</p>
                        </div>
                    ))
                ) : (
                    <p>No links available for this topic.</p>
                )}
            </div>
        </div>
    );
};

export default LinksDisplayComponent;
