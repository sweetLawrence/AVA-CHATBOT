import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "./Spinner";
// import SendIcon from '@mui/icons-material/Send';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [sent, setSent] = useState([]);
  const [sending, setSending] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);
    // scrollToBottom();
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // scrollToBottom();
  }, [inputValue]);

  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
         // weka endpoint yako tafadhali, usijaze my pocketbase puriiiiiiisssssssssss 😂😁😉
        "https://offering.pockethost.io/api/collections/Messages/records"
      );
      console.log(response.data.items);
      setMessages(response.data.items);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    try {
      if (inputValue.trim() !== "") {
        setSending(true);
        const response = await axios.post("https://ava-api.onrender.com/messages", {
          message: inputValue,
        });

        setSending(false);
        scrollToBottom();
        setInputValue("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      scrollToBottom();
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <div className="chat">
      <div className="container">
        <div className="logo">AVA</div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`info ${
                message.sender === "YOU" ? "sent" : "received"
              }`}
            >
              {/* <p>{message.sender}: {message.message}</p> */}
              <p>
                {message.sender}:{" "}
                {message.sender !== "You" ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: message.message.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  />
                ) : (
                  message.message
                )}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="output">
          <input
            type="text"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage}>
            {sending ? <Spinner /> : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
