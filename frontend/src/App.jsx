import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";


function App() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const socketRef = useRef();
  const [messages, setMessages] = useState([]); // store all messages here
  const [message, setMessage] = useState("");  // store typed message
  // Generate a unique clientId for this session
  const clientId = useRef(Math.random().toString(36).substring(2, 9)).current;

  useEffect(() => {
    // Create socket connection only once
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("received_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Cleanup the event listener on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);



  const sendMessage = () => {
    if (message && message.trim() !== "") {
      // Send message as object with sender id
      socketRef.current.emit("send_message", {
        text: message,
        time: Date.now(),
        sender: clientId,
      });
      setMessage("");
    }
  }

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
        <div className="text-xs text-gray-500 mb-2">Render count: {renderCount.current}</div>
        <h2 className="text-2xl font-bold mb-4 text-center">Simple Chat</h2>
        <div className="mb-4 h-80 overflow-y-auto border rounded p-2 bg-gray-50">
          {messages.map((msgObj, id) => {
            // If msgObj is a string (old messages), convert to object
            const msg = typeof msgObj === "string" ? { text: msgObj } : msgObj;
            const isSender = msg.sender === clientId;
            return (
              <div key={id} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-1`}>
                <p className={`${isSender ? 'bg-blue-500 ml-auto text-right' : 'bg-yellow-800 mr-auto text-left'} text-zinc-100 rounded px-2 py-1 w-fit`}>
                  {msg.text}
                </p>
                {msg.time && (
                  <span className="text-xs text-gray-500">
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type..."
            className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
