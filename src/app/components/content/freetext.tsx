"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/apiConfig';

interface TextPadProps {
  onSubmit?: () => void;
}

const Textpad = ({ onSubmit }: TextPadProps) => {
  const router = useRouter();
  const [text, setText] = useState(""); // State to hold the textarea content
  const [responseMessage, setResponseMessage] = useState(""); // State for API response message
  const [loading, setLoading] = useState(false); // State for loading status

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (responseMessage) {
      timer = setTimeout(() => {
        setResponseMessage("");
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [responseMessage]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text before submitting.");
      return;
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      alert("Access token not found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      // Get first three words as title
      const firstThreeWords = text.trim().split(/\s+/).slice(0, 3).join(" ");

      // Construct the form data
      const formData = new FormData();
      formData.append("title", firstThreeWords);
      formData.append("text", text);

      // Add error handling for network issues
      try {
        const response = await fetch(
          `${API_BASE_URL}/content_upload/upload_free_text/`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Backend Response:", data); // Log the full backend response

        if (!response.ok) {
          throw new Error(data.message || `Error: ${response.statusText}`);
        }

        // Save single content ID to localStorage
        if (data.contents?.id) {
          localStorage.setItem('selected_content_ids', JSON.stringify([data.contents.id]));
        }

        setResponseMessage("Content uploaded successfully!");

        // Clear form on success
        setText("");

        // Hide the modal after successful upload
        setTimeout(() => {
          // Find the closest parent modal and close it
          const modal = document.querySelector('.fixed.inset-0.bg-gray-900\\/50.backdrop-blur-sm');
          if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 1000);

        if (onSubmit) onSubmit();

      } catch (fetchError) {
        if (fetchError instanceof TypeError && fetchError.message === "Failed to fetch") {
          throw new Error("Network error: Please check your internet connection and try again.");
        }
        throw fetchError;
      }

    } catch (error: any) {
      console.error("Error occurred:", error);
      setResponseMessage(error.message || "An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Page Header */}
      <header className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Your Personal Text Pad
        </h1>
        <div className="w-full mt-2 h-1 bg-gray-300"></div>
      </header>

      {/* Text Pad Container */}
      <div className="w-full max-w-2xl p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Write Your Text Below
        </h2>

        {/* Textarea Input */}
        <textarea
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-700 resize-none overflow-y-scroll"
          rows={4}
          placeholder="Start typing your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        ></textarea>

        {/* Submit Button */}
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Response Section */}
      {responseMessage && (
        <div className="w-full max-w-2xl p-4 mt-4 rounded-lg shadow-md border border-green-300 bg-green-50">
          <p className="text-green-700">{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Textpad;