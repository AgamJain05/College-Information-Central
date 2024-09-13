import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

// Context for Meetup links
const MeetupContext = createContext();

const MeetupProvider = ({ children }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN +'/api/links');
        setLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

  const addLink = async (newLink) => {
    try {
      console.log("Adding link:", newLink);
      const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/api/links', newLink);
      setLinks([...links, response.data]);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  return (
    <MeetupContext.Provider value={{ links, addLink }}>
      {children}
    </MeetupContext.Provider>
  );
};

// Link Input Component
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
    <div className="link-input p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter Google Meet link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full p-2 mb-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 mb-2 border rounded-lg"
      />
      <button
        onClick={handleAddLink}
        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Link
      </button>
    </div>
  );
};

// Links Display Component
const LinksDisplayComponent = () => {
  const { links } = useContext(MeetupContext);
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const filteredLinks = Array.isArray(links) ? (selectedTopic ? links.filter(link => link.topic === selectedTopic) : links) : [];

  return (
    <div className="links-display mt-8">
      <div className="topics flex justify-center space-x-4 mb-4">
        {["College Info", "Coding", "General Talks"].map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={`px-4 py-2 rounded-lg ${selectedTopic === topic ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 hover:text-white`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="links-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link, index) => (
            <div key={index} className="link-item p-4 bg-white rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-lg font-semibold">
                  {link.link}
                </a>
                <p className="mt-2 text-gray-700">{link.topic}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm">Added on: {new Date(link.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Updated on: {new Date(link.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-1 md:col-span-2 lg:col-span-3">No links available for this topic.</p>
        )}
      </div>
    </div>
  );
};

// Main Meetup Page
const MeetupPage = () => {
  return (
    <MeetupProvider>
      <div className="meetup-page p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">Meetup Links</h1>
        <LinkInputComponent />
        <LinksDisplayComponent />
      </div>
    </MeetupProvider>
  );
};

export default MeetupPage;
