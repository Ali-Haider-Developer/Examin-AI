"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/apiConfig';

interface ArticlePadProps {
  onSubmit?: () => void;
}

const ArticlePad = ({ onSubmit }: ArticlePadProps) => {
  const router = useRouter();
  const [url, setUrl] = useState(""); // State for the article URL
  const [message, setMessage] = useState(""); // State for success/error messages
  const [loading, setLoading] = useState(false); // State for loading status
  const [responseDetails, setResponseDetails] = useState<any>(null); // Store API response

  const submitArticle = async () => {
    if (!url) {
      setMessage("URL is required.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Extract title from URL
      let urlTitle = "";
      try {
        const urlObj = new URL(url);
        urlTitle = urlObj.pathname.split('/').filter(Boolean).pop() || url;
        // Remove hyphens, underscores and file extensions
        urlTitle = urlTitle.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
      } catch (e) {
        urlTitle = url;
      }

      const response = await fetch(
        `${API_BASE_URL}/content_upload/upload_web_article/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            title: urlTitle,
            url,
            file_type: "Article"
          })
        }
      );

      if (!response.ok) {
        const errorDetails =
          response.headers.get("content-type")?.includes("application/json")
            ? await response.json() // Parse as JSON if available
            : await response.text(); // Parse as plain text if not JSON

        // Log the actual error object to the console for debugging
        console.error("Error details:", errorDetails);
        throw new Error(`Failed: ${response.status} - ${JSON.stringify(errorDetails)}`);
      }

      const data = await response.json();
      setMessage("Article submitted successfully!");
      setResponseDetails(data.contents || null); // Store response details
      console.log("Success Response:", data); // Log the full response
      console.log("Article ID:", data.contents?.id); // Log article ID

      // Store the content ID in localStorage
      if (data.contents?.id) {
        localStorage.setItem('selected_content_ids', JSON.stringify([data.contents.id]));
      }

      if (onSubmit) onSubmit();

      // Hide the modal after successful upload
      setTimeout(() => {
        // Find the closest parent modal and close it
        const modal = document.querySelector('.fixed.inset-0.bg-gray-900\\/50.backdrop-blur-sm');
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 1000);

    } catch (error) {
      setMessage("Error: Something went wrong. Please try again.");
      console.error("Caught Error:", error); // Log caught error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Page Header */}
      <header className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Submit Your Article
        </h1>
        <div className="w-full mt-2 h-1 bg-gray-300"></div>
      </header>

      {/* Article Pad Container */}
      <div className="w-full max-w-2xl p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Enter Article URL Below
        </h2>

        {/* URL Input */}
        <input
          type="url"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-700"
          placeholder="Enter the article URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Submit Button */}
        <div className="flex justify-end items-center mt-4">
          <button
            className={`px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={submitArticle}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}
      </div>

      {/* Response Details */}
      {responseDetails && (
        <div className="w-full max-w-2xl p-4 mt-4 rounded-lg shadow-md border border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Response Details</h3>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            <li>
              <strong>ID:</strong> {responseDetails.id}
            </li>
            <li>
              <strong>Title:</strong> {responseDetails.title || "N/A"}
            </li>
            <li>
              <strong>URL:</strong> <a href={responseDetails.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">{responseDetails.url}</a>
            </li>
            <li>
              <strong>Created At:</strong> {responseDetails.created_at || "N/A"}
            </li>
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full mt-6 flex items-center justify-center">
        {/* Placeholder for logo or additional footer content */}
      </footer>
    </div>
  );
};

export default ArticlePad;