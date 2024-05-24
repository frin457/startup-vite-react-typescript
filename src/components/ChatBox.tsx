// src/ChatBox.tsx

import { useState, useEffect } from 'react';
import { MessageContent } from '../types';
//TODO: Add props
//TODO: Replace target urls with either props or .env vars


const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<MessageContent[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
  
    // useEffect(() => {
    //   // Fetch session data from the backend
    //   const fetchSessionData = async () => {
    //     try {
    //       const response = await fetch('http://localhost:3000/chat');
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       const data: MessageContent[] = await response.json();
    //       setSessionData(data.map(content => content.text.value));
    //       setMessages(data || []);
    //       setLoading(false);
    //     } catch (error) {
    //       console.error('Error fetching session data:', error);
    //       setLoading(false);
    //     }
    //   };
  
    //   fetchSessionData();
    // }, []);
  
    const handleSendMessage = async () => {
      if (newMessage.trim() === '') return;
  
      try {
        const response = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newMessage }),
        });
        setLoading(false)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newMsg = await response.json();
        setMessages([...newMsg.res]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
    useEffect(()=>{
        if(newMessage) setLoading(true)
    },[newMessage])
    return (
      <div className="flex flex-col w-full max-w-lg mx-auto border rounded-lg overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
          {loading ? ( //TODO: update this logic, should not hide chat log. Should be moved elsewhere visually.
            <p>Loading messages...</p>
          ) : (
            messages.map((message,index) => (
              <div key={index} className="mb-3">
                <p className="font-bold">{index % 2 === 0 ? 'user' : 'assistant'}:</p>
                <p>{message.text.value}</p>
                <span className="text-xs text-gray-500">{new Date().toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex border-t p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} //TODO: convert to a delayed input read
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded"
          />
          <button onClick={handleSendMessage} className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    );
  };
export default ChatBox;