import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const AI = () => {
    const [messages, setMessages] = useState([
        { role: "ai", content: "Hi! I'm your assistant. How can I help?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://fancy-butterfly-7408.skygripper.workers.dev/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: `You are a knowledgeable and passionate figurine collector with a deep understanding of Pop Mart collectibles. Based on the following travel details, provide a helpful and engaging itinerary that incorporates:
- Opportunities to acquire figurines (e.g., local stores, events, or collector meetups),


Ensure your response is clear, concise, and fun to follow. Keep in mind space and budget considerations for bringing figurines back. Here's the user's input: "${input}"`,
                    }),
                }
            );

            const data = await response.json();

            const aiMessage = {
                role: "ai",
                content:
                    data.response || "Sorry, I couldn't generate a response.",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Oops! Something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    AI Suggestions
                </h2>
            }
        >
            <div className="max-w-4xl mx-auto p-4">
                <div
                    ref={chatRef}
                    className="h-[500px] overflow-y-auto bg-white border rounded-lg p-4 space-y-3 shadow-sm"
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-xl whitespace-pre-wrap px-4 py-2 rounded-xl text-sm ${
                                msg.role === "user"
                                    ? "ml-auto bg-blue-100 text-right"
                                    : "mr-auto bg-gray-100"
                            }`}
                        >
                            <strong className="block text-xs text-gray-500 mb-1">
                                {msg.role === "user" ? "You" : "AI Assistant"}
                            </strong>
                            {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div className="text-sm text-gray-500 italic">
                            AI is thinking...
                        </div>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                    <textarea
                        rows={1}
                        className="flex-1 resize-none rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Ask about a destination, popmart figurine, or anything else!"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5 inline" />
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AI;
