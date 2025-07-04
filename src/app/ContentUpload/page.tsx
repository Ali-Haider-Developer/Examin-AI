"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import YouTubeLinkPad from "../components/content/youtube";
import ArticleSubmissionPage from "../components/content/article";
import TextPad from "../components/content/freetext";
import TopicSubmissionPage from "../components/content/topic";
import ContentUpload from "../components/content/sixcard";
import Sidebar from "../components/SiderBar/page";
import { FaUpload, FaArrowRight, FaArrowLeft, FaTimes, FaSpinner, FaCheckCircle } from "react-icons/fa";
import withAuth from "@/components/withAuth";
import THEME from "../components/Landing Page/theme";
import LandingBackground from "../components/Landing Page/LandingBackground";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/apiConfig";

// Reusable upload box component for file-based types
const FileUploadBox: React.FC<{
  label: string;
  accept: string;
  file: File | null;
  error: string | null;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}> = ({ label, accept, file, error, uploading, onFileChange, onSubmit }) => (
  <div className="w-full max-w-xl mx-auto mb-12">
    <div className="bg-[#050014]/80 border-2 border-[#1a0066] rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
      <h2 className="text-2xl font-bold text-[#00fff7] mb-6">Upload {label} File</h2>
      <label
        htmlFor={`${label.toLowerCase()}-upload-input`}
        className="w-full flex flex-col items-center justify-center px-6 py-10 mb-4 bg-gradient-to-br from-[#1a0066]/80 to-[#00fff7]/10 border-2 border-dashed border-[#00fff7] rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#ff00ea] hover:bg-[#1a0066]/60"
        style={{ minHeight: '140px' }}
      >
        <svg className="w-12 h-12 mb-2 text-[#00fff7] group-hover:text-[#ff00ea] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-lg font-medium text-[#00fff7] group-hover:text-[#ff00ea] transition-colors">Click or drag to select your {label} file</span>
        <span className="text-xs text-[#e0e0ff] mt-1">Only {label.toUpperCase()} files are supported</span>
        <input
          id={`${label.toLowerCase()}-upload-input`}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
        />
      </label>
      {file && <div className="mb-2 text-[#00fff7]">Selected: {file.name}</div>}
      {error && <div className="mb-2 text-red-400">{error}</div>}
      <button
        onClick={onSubmit}
        disabled={uploading}
        className="mt-4 px-8 py-3 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow-lg hover:scale-105 transition-all duration-300 text-lg font-bold disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  </div>
);

const ExamContentUpload: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: select type, 1: input/upload, 2: success
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [contentSubmitted, setContentSubmitted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [docxUploading, setDocxUploading] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [xlsxUploading, setXlsxUploading] = useState(false);
  const [xlsxError, setXlsxError] = useState<string | null>(null);
  const [pptxFile, setPptxFile] = useState<File | null>(null);
  const [pptxUploading, setPptxUploading] = useState(false);
  const [pptxError, setPptxError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [prevExamFile, setPrevExamFile] = useState<File | null>(null);
  const [prevExamUploading, setPrevExamUploading] = useState(false);
  const [prevExamError, setPrevExamError] = useState<string | null>(null);

  const contentTypes = [
    { name: 'Free Text', description: 'Upload free text content for question generation.', icon: '📝' },
    { name: 'Topic', description: 'Select specific topics to generate questions related to them.', icon: '📚' },
    { name: 'Article', description: 'Use articles to create questions based on the content.', icon: '📰' },
    { name: 'Youtube Videos', description: 'Include YouTube videos for interactive question creation.', icon: '🎥' },
    { name: 'PDFs', description: 'Upload PDF files for question generation based on content.', icon: '📄' },
    { name: 'DOCX', description: 'Upload DOCX files to turn text-based content into questions.', icon: '📑' },
    { name: 'XLSX', description: 'Upload Excel files for data-driven question generation.', icon: '📊' },
    { name: 'PPTX', description: 'Upload PowerPoint files to create questions based on slides.', icon: '📊' },
    { name: 'Image', description: 'Upload images for visual question generation.', icon: '🖼' },
    { name: 'Previous Exam (PDF, DOCX)', description: 'Upload previous exam files for practice questions.', icon: '📝' },
  ];

  const fileBasedTypes = [
    "PDFs", "DOCX", "XLSX", "PPTX", "Image", "Previous Exam (PDF, DOCX)"
  ];

  const handleSelectContentType = (type: string) => {
    setSelectedContentType(type);
    setStep(1);
    setContentSubmitted(false);
    setTimeout(() => {
      const formSection = document.getElementById('content-upload-form');
      if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleContentSubmit = () => {
    setContentSubmitted(true);
    setStep(2);
    router.push('/examtype');
  };

  const handleContinue = () => {
    router.push('/examtype');
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setPdfError(null);
    }
  };

  const handlePdfSubmit = async () => {
    if (!pdfFile) {
      setPdfError('Please select a PDF file.');
      return;
    }
    setPdfUploading(true);
    setPdfError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('title', pdfFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_pdf/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setPdfFile(null);
      // Optionally, go to next step or show success
      setStep(2);
    } catch (err: any) {
      setPdfError(err.message || 'Failed to upload PDF.');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleDocxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocxFile(e.target.files[0]);
      setDocxError(null);
    }
  };

  const handleDocxSubmit = async () => {
    if (!docxFile) {
      setDocxError('Please select a DOCX file.');
      return;
    }
    setDocxUploading(true);
    setDocxError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', docxFile);
      formData.append('title', docxFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_docx/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setDocxFile(null);
      setStep(2);
    } catch (err: any) {
      setDocxError(err.message || 'Failed to upload DOCX.');
    } finally {
      setDocxUploading(false);
    }
  };

  const handleXlsxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setXlsxFile(e.target.files[0]);
      setXlsxError(null);
    }
  };

  const handleXlsxSubmit = async () => {
    if (!xlsxFile) {
      setXlsxError('Please select an XLSX file.');
      return;
    }
    setXlsxUploading(true);
    setXlsxError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', xlsxFile);
      formData.append('title', xlsxFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_xlsx/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setXlsxFile(null);
      setStep(2);
    } catch (err: any) {
      setXlsxError(err.message || 'Failed to upload XLSX.');
    } finally {
      setXlsxUploading(false);
    }
  };

  const handlePptxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPptxFile(e.target.files[0]);
      setPptxError(null);
    }
  };

  const handlePptxSubmit = async () => {
    if (!pptxFile) {
      setPptxError('Please select a PPTX file.');
      return;
    }
    setPptxUploading(true);
    setPptxError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', pptxFile);
      formData.append('title', pptxFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_pptx/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setPptxFile(null);
      setStep(2);
    } catch (err: any) {
      setPptxError(err.message || 'Failed to upload PPTX.');
    } finally {
      setPptxUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageError(null);
    }
  };

  const handleImageSubmit = async () => {
    if (!imageFile) {
      setImageError('Please select an image file.');
      return;
    }
    setImageUploading(true);
    setImageError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('title', imageFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_image/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setImageFile(null);
      setStep(2);
    } catch (err: any) {
      setImageError(err.message || 'Failed to upload image.');
    } finally {
      setImageUploading(false);
    }
  };

  const handlePrevExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrevExamFile(e.target.files[0]);
      setPrevExamError(null);
    }
  };

  const handlePrevExamSubmit = async () => {
    if (!prevExamFile) {
      setPrevExamError('Please select a file.');
      return;
    }
    setPrevExamUploading(true);
    setPrevExamError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication token not found');
      const formData = new FormData();
      formData.append('file', prevExamFile);
      formData.append('title', prevExamFile.name);
      formData.append('access_token', token);
      const response = await fetch(`${API_BASE_URL}/content_upload/upload_previous_exam/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Upload failed');
      }
      setPrevExamFile(null);
      setStep(2);
    } catch (err: any) {
      setPrevExamError(err.message || 'Failed to upload file.');
    } finally {
      setPrevExamUploading(false);
    }
  };

  const renderSelectedPage = () => {
    // Render file upload UI for file-based types
    if (fileBasedTypes.includes(selectedContentType || "")) {
      switch (selectedContentType) {
        case 'PDFs':
          return (
            <FileUploadBox
              label="PDF"
              accept="application/pdf"
              file={pdfFile}
              error={pdfError}
              uploading={pdfUploading}
              onFileChange={handlePdfChange}
              onSubmit={handlePdfSubmit}
            />
          );
        case 'DOCX':
          return (
            <FileUploadBox
              label="DOCX"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              file={docxFile}
              error={docxError}
              uploading={docxUploading}
              onFileChange={handleDocxChange}
              onSubmit={handleDocxSubmit}
            />
          );
        case 'XLSX':
          return (
            <FileUploadBox
              label="XLSX"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              file={xlsxFile}
              error={xlsxError}
              uploading={xlsxUploading}
              onFileChange={handleXlsxChange}
              onSubmit={handleXlsxSubmit}
            />
          );
        case 'PPTX':
          return (
            <FileUploadBox
              label="PPTX"
              accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              file={pptxFile}
              error={pptxError}
              uploading={pptxUploading}
              onFileChange={handlePptxChange}
              onSubmit={handlePptxSubmit}
            />
          );
        case 'Image':
          return (
            <FileUploadBox
              label="Image"
              accept="image/*"
              file={imageFile}
              error={imageError}
              uploading={imageUploading}
              onFileChange={handleImageChange}
              onSubmit={handleImageSubmit}
            />
          );
        case 'Previous Exam (PDF, DOCX)':
          return (
            <FileUploadBox
              label="Previous Exam (PDF, DOCX)"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              file={prevExamFile}
              error={prevExamError}
              uploading={prevExamUploading}
              onFileChange={handlePrevExamChange}
              onSubmit={handlePrevExamSubmit}
            />
          );
        default:
          return null;
      }
    }
    // Render text/YouTube content components for other types
    const pageMapping: Record<string, JSX.Element | null> = {
      "Free Text": <TextPad onSubmit={handleContentSubmit} />, // Pass onSubmit to child
      "Topic": <TopicSubmissionPage onSubmit={handleContentSubmit} />, // Pass onSubmit to child
      "Article": <ArticleSubmissionPage onSubmit={handleContentSubmit} />, // Pass onSubmit to child
      "Youtube Videos": <YouTubeLinkPad onSubmit={handleContentSubmit} />, // Pass onSubmit to child
    };
    if (selectedContentType === 'DOCX') {
      return (
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="bg-[#050014]/80 border-2 border-[#1a0066] rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
            <h2 className="text-2xl font-bold text-[#00fff7] mb-6">DOCX Content</h2>
            <div className="w-full max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-[#00fff7] mb-4 text-center">Upload DOCX File</h3>
              <label
                htmlFor="docx-upload-input"
                className="w-full flex flex-col items-center justify-center px-6 py-10 mb-4 bg-gradient-to-br from-[#1a0066]/80 to-[#00fff7]/10 border-2 border-dashed border-[#00fff7] rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#ff00ea] hover:bg-[#1a0066]/60"
                style={{ minHeight: '180px' }}
              >
                <span className="text-5xl mb-2 text-[#00fff7]">+</span>
                <span className="text-lg font-medium text-[#00fff7] group-hover:text-[#ff00ea] transition-colors">Click or drag to select your DOCX file</span>
                <span className="text-xs text-[#e0e0ff] mt-1">Only DOCX files are supported</span>
                <input
                  id="docx-upload-input"
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleDocxChange}
                  className="hidden"
                />
              </label>
              {docxFile && <div className="mb-2 text-[#00fff7] text-center">Selected: {docxFile.name}</div>}
              {docxError && <div className="mb-2 text-red-400 text-center">{docxError}</div>}
              <div className="flex justify-center">
                <button
                  onClick={handleDocxSubmit}
                  disabled={docxUploading}
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow-lg hover:scale-105 transition-all duration-300 text-lg font-bold disabled:opacity-50"
                >
                  {docxUploading ? 'Uploading...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (selectedContentType === 'XLSX') {
      return (
        <div className="w-full max-w-xl mx-auto mb-12">
          <div className="bg-[#050014]/80 border-2 border-[#1a0066] rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
            <h2 className="text-2xl font-bold text-[#00fff7] mb-6">Upload XLSX File</h2>
            <label
              htmlFor="xlsx-upload-input"
              className="w-full flex flex-col items-center justify-center px-6 py-10 mb-4 bg-gradient-to-br from-[#1a0066]/80 to-[#00fff7]/10 border-2 border-dashed border-[#00fff7] rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#ff00ea] hover:bg-[#1a0066]/60"
              style={{ minHeight: '140px' }}
            >
              <svg className="w-12 h-12 mb-2 text-[#00fff7] group-hover:text-[#ff00ea] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg font-medium text-[#00fff7] group-hover:text-[#ff00ea] transition-colors">Click or drag to select your XLSX file</span>
              <span className="text-xs text-[#e0e0ff] mt-1">Only XLSX files are supported</span>
              <input
                id="xlsx-upload-input"
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleXlsxChange}
                className="hidden"
              />
            </label>
            {xlsxFile && <div className="mb-2 text-[#00fff7]">Selected: {xlsxFile.name}</div>}
            {xlsxError && <div className="mb-2 text-red-400">{xlsxError}</div>}
            <button
              onClick={handleXlsxSubmit}
              disabled={xlsxUploading}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow-lg hover:scale-105 transition-all duration-300 text-lg font-bold disabled:opacity-50"
            >
              {xlsxUploading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </div>
      );
    }
    return pageMapping[selectedContentType || ""] || null;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-[240px]'}`}>
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: THEME.gradient, backgroundSize: '400% 400%' }}>
          <LandingBackground />
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-30 bg-[#050014]/80 backdrop-blur-md border-b-2 border-[#00fff7] px-8 py-4 mb-8 w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Technavya AI Logo" width={40} height={40} style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff00ea] to-[#00fff7] bg-clip-text text-transparent">Content Upload</h1>
              </div>
              <button
                onClick={() => router.push('/DashBoard')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
              >
                <FaArrowLeft className="text-[#7f00ff]" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 0 ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black border-[#00fff7]' : 'bg-[#1a0066] text-[#e0e0ff] border-[#1a0066]'}`}>1</div>
              <div className={`h-1 w-16 rounded-full ${step > 0 ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea]' : 'bg-[#1a0066]'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 1 ? 'bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black border-[#00fff7]' : 'bg-[#1a0066] text-[#e0e0ff] border-[#1a0066]'}`}>2</div>
            </div>
            <div className="flex justify-between text-xs text-[#e0e0ff] mt-2">
              <span>Select Content Type</span>
              <span>Upload Content</span>
            </div>
          </div>

          {/* Step 1: Select Content Type */}
          {step === 0 && (
            <div className="w-full max-w-6xl">
              <div className="text-center mb-12 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] rounded-full"></div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-transparent bg-clip-text mb-4 leading-tight">
                  Select the Content Type to Personalize Your Exam
                </h1>
                <p className="text-lg max-w-3xl mx-auto mb-6 text-[#e0e0ff]">
                  Choose the type of content that best suits your exam requirements. Upload new files from your collection or reuse existing materials to create a custom, interactive exam experience.
                </p>
              </div>
              {/* Top row: 4 main content types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {contentTypes.slice(0, 4).map((contentType) => (
                  <div
                    key={contentType.name}
                    onClick={() => handleSelectContentType(contentType.name)}
                    className={`cursor-pointer group flex flex-col items-center p-6 border-2 rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden
                      ${selectedContentType === contentType.name
                        ? "border-[#00fff7] shadow-lg bg-gradient-to-br from-[#1a0066] to-[#050014] scale-105"
                        : "border-[#1a0066] shadow-sm hover:shadow-md bg-[#050014]/80 hover:border-[#00fff7]"}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-16 h-16 rounded-full bg-[#1a0066] flex items-center justify-center mb-4 group-hover:bg-[#00fff7]/20 transition-colors duration-300">
                      <div className="text-3xl text-[#00fff7]">{contentType.icon}</div>
                    </div>
                    <h3 className="font-semibold text-lg text-[#e0e0ff] group-hover:text-[#00fff7] transition-colors duration-300">{contentType.name}</h3>
                    <p className="text-sm text-[#7f00ff] text-center mt-2 group-hover:text-[#00fff7] transition-colors duration-300">{contentType.description}</p>
                  </div>
                ))}
              </div>
              {/* File Upload Options section */}
              <div className="bg-[#050014]/60 border-2 border-[#1a0066] rounded-2xl shadow-lg p-8 mb-8" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#00fff7]">File Upload Options</h2>
                    <p className="text-sm text-[#e0e0ff]">Select from various file types to create your exam</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow hover:scale-105 transition-all font-medium text-sm">
                    Upload New File
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {contentTypes.slice(4).map((contentType) => (
                    <div
                      key={contentType.name}
                      onClick={() => handleSelectContentType(contentType.name)}
                      className={`cursor-pointer group flex flex-col items-center p-6 border-2 rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden
                        ${selectedContentType === contentType.name
                          ? "border-[#00fff7] shadow-lg bg-gradient-to-br from-[#1a0066] to-[#050014] scale-105"
                          : "border-[#1a0066] shadow-sm hover:shadow-md bg-[#050014]/80 hover:border-[#00fff7]"}`}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="w-16 h-16 rounded-full bg-[#1a0066] flex items-center justify-center mb-4 group-hover:bg-[#00fff7]/20 transition-colors duration-300">
                        <div className="text-3xl text-[#00fff7]">{contentType.icon}</div>
                      </div>
                      <h3 className="font-semibold text-lg text-[#e0e0ff] group-hover:text-[#00fff7] transition-colors duration-300">{contentType.name}</h3>
                      <p className="text-sm text-[#7f00ff] text-center mt-2 group-hover:text-[#00fff7] transition-colors duration-300">{contentType.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content Input/Upload */}
          {step === 1 && selectedContentType && (
            <div id="content-upload-form" className="w-full max-w-3xl mx-auto mb-12">
              <div className="bg-[#050014]/80 border-2 border-[#1a0066] rounded-2xl shadow-lg p-8 mb-8" style={{ boxShadow: `0 0 16px ${THEME.accent1}` }}>
                <h2 className="text-2xl font-bold text-[#00fff7] mb-4">{selectedContentType} Content</h2>
                {renderSelectedPage()}
              </div>
            </div>
          )}

          {/* Step 3: Success/Continue */}
          {step === 2 && (
            <div className="w-full max-w-2xl mx-auto text-center mt-16">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#00fff7] to-[#ff00ea] flex items-center justify-center shadow-lg mb-4">
                  <FaCheckCircle className="text-4xl text-black" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent mb-2">Content Uploaded Successfully!</h2>
                <p className="text-lg text-[#e0e0ff]">You can now proceed to set up your exam type and parameters.</p>
              </div>
              <button
                onClick={handleContinue}
                className="px-10 py-4 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] text-black rounded-xl shadow-lg hover:scale-105 transition-all duration-300 text-lg font-bold"
              >
                Continue to Exam Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ExamContentUpload);