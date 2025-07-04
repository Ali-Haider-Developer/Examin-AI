"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/apiConfig';

interface ContentUploadProps {
  onlyType?: string | null;
}

const ContentUpload: React.FC<ContentUploadProps> = ({ onlyType }) => {
  const router = useRouter();
  const [selectedContentType, setSelectedContentType] = useState<string | null>(onlyType || null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedContents, setSelectedContents] = useState<any[]>([]);

  // Use API_BASE_URL from config
  const baseUrl = `${API_BASE_URL}/content_upload`;

  const contentTypes = [
    { name: 'PDFs', description: 'Upload PDF files for question generation based on content.', icon: '📄', endpoint: '/upload_pdf/' },
    { name: 'DOCX', description: 'Upload DOCX files to turn text-based content into questions.', icon: '📑', endpoint: '/upload_docx/' },
    { name: 'XLSX', description: 'Upload Excel files for data-driven question generation.', icon: '📊', endpoint: '/upload_xlsx/' },
    { name: 'PPTX', description: 'Upload PowerPoint files to create questions based on slides.', icon: '📊', endpoint: '/upload_pptx/' },
    { name: 'Image', description: 'Upload images for visual question generation.', icon: '🖼', endpoint: '/upload_image/' },
    { name: 'Previous Exam (PDF, DOCX)', description: 'Upload previous exam files for practice questions.', icon: '📝', endpoint: '/upload_exam/' },
  ];

  // If onlyType is set, filter contentTypes to only that type
  const filteredContentTypes = onlyType
    ? contentTypes.filter((ct) => ct.name === onlyType)
    : contentTypes;

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    fetchContentHistory(token);
    loadSelectedContents();

    // Set up interval to fetch content history every second
    const intervalId = setInterval(() => {
      fetchContentHistory(token);
    }, 100);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const loadSelectedContents = (updatedHistory = history) => {
    try {
      const selectedIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');
      const selectedItems = updatedHistory.filter((item) => selectedIds.includes(item.id));
      setSelectedContents(selectedItems);
    } catch (error) {
      console.error('Error parsing selected content IDs:', error);
      localStorage.setItem('selected_content_ids', '[]');
      setSelectedContents([]);
    }
  };

  const fetchContentHistory = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content_upload/get_contents_by_student_id/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content history');
      }

      const data = await response.json();
      const fetchedHistory = data.contents || [];
      setHistory(fetchedHistory);
      loadSelectedContents(fetchedHistory); // Update selected contents based on the fetched history
    } catch (error) {
      ;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    fetchContentHistory(token);
    loadSelectedContents(); // Ensure local storage IDs are loaded

    const intervalId = setInterval(() => {
      fetchContentHistory(token);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const handleSelectContentType = (type: string) => {
    setSelectedContentType(type);
    setShowModal(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedContentType || uploadedFiles.length === 0) {
      console.error('Please select a content type and upload files');
      return;
    }

    setLoading(true);

    try {
      const selectedType = contentTypes.find(type => type.name === selectedContentType);
      if (!selectedType) return;

      let token;
      try {
        token = localStorage.getItem('access_token');
        if (!token) throw new Error('Authentication token not found');
      } catch (e) {
        throw new Error('Unable to access localStorage. Please ensure cookies are enabled.');
      }

      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('file', file);
        formData.append('title', file.name);
      });
      formData.append('access_token', token);

      const response = await fetch(`${baseUrl}${selectedType.endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Backend Response:', data);

      if (data.contents?.id) {
        try {
          localStorage.setItem('selected_content_ids', JSON.stringify([data.contents.id]));
        } catch (error) {
          console.error('Error saving content ID to localStorage:', error);
        }
      }

      console.log('Upload successful!');
      setUploadedFiles([]);
      setSelectedContentType(null);
      setShowModal(false);

      fetchContentHistory(token);
      loadSelectedContents();

    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        if (error.message === 'Authentication token not found') {
          console.error('Please login to upload files');
        } else if (error.message.includes('localStorage')) {
          console.error(error.message);
        } else {
          console.error(`Failed to upload files: ${error.message}`);
        }
      } else {
        console.error('Failed to upload files. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = (contentId: string) => {
    try {
      const selectedIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');
      if (!selectedIds.includes(contentId)) {
        selectedIds.push(contentId);
        localStorage.setItem('selected_content_ids', JSON.stringify(selectedIds));
        loadSelectedContents();
      }
    } catch (error) {
      console.error('Error handling content addition:', error);
      localStorage.setItem('selected_content_ids', '[]');
    }
  };

  const handleRemoveContent = (contentId: string) => {
    try {
      const selectedIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');
      const updatedIds = selectedIds.filter((id: string) => id !== contentId);
      localStorage.setItem('selected_content_ids', JSON.stringify(updatedIds));
      loadSelectedContents();
    } catch (error) {
      console.error('Error handling content removal:', error);
      localStorage.setItem('selected_content_ids', '[]');
    }
  };

  const handleNext = () => {
    if (selectedContents.length > 0) {
      router.push('/examtype');
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">File Upload Options</h2>
            <p className="text-sm text-gray-500">Select from various file types to create your exam</p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-4">
          {(!onlyType || !selectedContentType) && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload New File</span>
            </button>
          )}
        </div>

        {/* Content Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {filteredContentTypes
            .filter((ct) => !['Free Text', 'Topic', 'Article', 'Youtube Videos'].includes(ct.name))
            .slice(0, showAll ? filteredContentTypes.length : 6)
            .map((contentType) => (
              <div
                key={contentType.name}
                onClick={() => handleSelectContentType(contentType.name)}
                className={`cursor-pointer group flex flex-col items-center p-5 border rounded-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden
                  ${selectedContentType === contentType.name
                    ? 'border-emerald-300 shadow-md bg-emerald-50'
                    : 'border-gray-200 shadow-sm hover:shadow bg-white hover:border-emerald-200'}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors duration-300">
                  <div className="text-2xl text-emerald-600">{contentType.icon}</div>
                </div>
                <h3 className="font-medium text-base text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">{contentType.name}</h3>
                <p className="text-xs text-gray-500 text-center mt-2 group-hover:text-gray-700 transition-colors duration-300">{contentType.description}</p>
              </div>
            ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNext}
            className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group ${selectedContents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedContents.length === 0}
          >
            <span>Continue to Next Step</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Selected Content and History in Side-by-Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selected Content Section */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Selected Content</h2>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedContents.length > 0 ? (
                <ul className="list-none space-y-3">
                  {selectedContents.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center group hover:border-red-100 transition-colors duration-300">
                      <div className="font-medium text-gray-700 truncate max-w-[70%]">{item.title}</div>
                      <button
                        onClick={() => handleRemoveContent(item.id)}
                        className="px-3 py-1.5 text-xs bg-white text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No content selected yet</p>
                  <p className="text-gray-400 text-xs mt-1">Select content from your upload history</p>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Upload History</h2>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? (
                <ul className="list-none space-y-3">
                  {history.map((item, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center group hover:border-emerald-100 transition-colors duration-300">
                      <div className="font-medium text-gray-700 truncate max-w-[70%]">{item.title}</div>
                      <button
                        onClick={() => handleAddContent(item.id)}
                        className="px-3 py-1.5 text-xs bg-white text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-500 text-sm">No upload history found</p>
                  <p className="text-gray-400 text-xs mt-1">Upload new files to see them here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Upload Content</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setUploadedFiles([]);
                    setSelectedContentType(null);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select files to upload</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium">Click to browse files</span>
                    <span className="text-xs text-gray-400 mt-1">or drag and drop files here</span>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                    <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setUploadedFiles([]);
                    setSelectedContentType(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={loading || uploadedFiles.length === 0}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ContentUpload;
