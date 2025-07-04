import React, { useState } from "react";

const ChatBot = () => {
    const [show, setShow] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // ✅ Correct for Vite
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: input }],
                }),
            });

            const data = await res.json();
            const botReply = data.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (err) {
            console.error("OpenAI error:", err);
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Failed to respond." }]);
        }
    };

    return (
        <>
            <button
                onClick={() => setShow(!show)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 1000,
                    backgroundColor: "#0071dc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    fontSize: "1.5rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
            >
                💬
            </button>

            {show && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "300px",
                        maxHeight: "400px",
                        background: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 999,
                    }}
                >
                    <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    textAlign: msg.sender === "user" ? "right" : "left",
                                    margin: "4px 0",
                                }}
                            >
                <span
                    style={{
                        background: msg.sender === "user" ? "#0071dc" : "#eee",
                        color: msg.sender === "user" ? "#fff" : "#000",
                        padding: "6px 10px",
                        borderRadius: "10px",
                        display: "inline-block",
                        maxWidth: "80%",
                    }}
                >
                  {msg.text}
                </span>
                            </div>
                        ))}
                    </div>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask me anything..."
                        style={{
                            width: "100%",
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default ChatBot;
