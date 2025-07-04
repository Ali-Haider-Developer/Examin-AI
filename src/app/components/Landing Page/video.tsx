"use client";

import { FC, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const YOUTUBE_VIDEO_ID = "1tvvu7Zpp2Y";
const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

const VideoDemoSection: FC = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    // Animate section elements
    gsap.fromTo(headingRef.current,
      {
        opacity: 0,
        y: -30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8
      }
    );

    gsap.fromTo(textRef.current,
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2
      }
    );

    gsap.fromTo(videoRef.current,
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.4
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#050014] text-[#e0e0ff] py-10 flex flex-col items-center overflow-hidden">
      {/* Heading */}
      <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00fff7] to-[#ff00ea] bg-clip-text text-transparent">
        Discover How Our Solution Works
      </h2>
      <p ref={textRef} className="text-center text-[#00fff7] mb-6">
        Watch the video to see our platform in action and understand how it can benefit you.
      </p>

      {/* YouTube Video or Thumbnail */}
      <div ref={videoRef} className="relative w-full max-w-xl aspect-video rounded-lg overflow-hidden shadow-lg border-4 border-[#1a0066]">
        {showPlayer ? (
          <iframe
            className="w-full h-full"
            src={YOUTUBE_EMBED_URL}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <button
            className="w-full h-full relative group focus:outline-none"
            onClick={() => setShowPlayer(true)}
            aria-label="Play video"
          >
            <img
              src={YOUTUBE_THUMBNAIL}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/60 rounded-full p-4">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#00fff7" fillOpacity="0.8" />
                  <polygon points="20,16 36,24 20,32" fill="#1a0066" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Rotating Gears */}
      <div
        className="absolute top-1/4 left-10 w-20 h-20 bg-[#7f00ff] rounded-full opacity-30"
        style={{
          animation: "spin-slow 10s linear infinite",
        }}
      ></div>
      <div
        className="absolute bottom-1/4 right-10 w-24 h-24 bg-[#00fff7] rounded-full opacity-30"
        style={{
          animation: "spin-reverse-slow 12s linear infinite",
        }}
      ></div>

      {/* Custom CSS directly in the component */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default VideoDemoSection;
