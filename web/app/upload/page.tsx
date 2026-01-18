"use client";

import Link from "next/link";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import Image from "next/image";
import Webcam from "react-webcam";
import { useAuth } from "@/hooks/use_auth";
import { useSearchParams } from "next/navigation";
import { OPENSTREETMAP_URL } from "@/lib/env";
import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, RefreshCw, Upload, MapPin, User, AlertCircle, VideoOff } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const movieIdParam = searchParams.get("movieId");
  const movieTitleParam = searchParams.get("movieTitle");
  const { user } = useAuth({ middleware: 'auth' });

  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Browser does not support geolocation");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(OPENSTREETMAP_URL + `?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const state = data.address.state;
            const formatted = [city, state].filter(Boolean).join(", ");
            const finalLocation = formatted ? `${formatted} (${latitude.toFixed(5)}, ${longitude.toFixed(5)})` : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            setLocation(finalLocation);
          } else {
            setLocation(`${latitude},${longitude}`);
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
          setLocation(`${latitude},${longitude}`);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location timeout");
            break;
          default:
            setLocationError("Failed to get location");
        }
      }
    );
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      getLocation();
    }
  }, [webcamRef, getLocation]);

  const retake = useCallback(() => {
    setImgSrc(null);
    setUploadStatus("idle");
  }, []);

  const base64ToBlob = (base64: string) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = useCallback(async () => {
    if (!imgSrc || !user?.name || !movieIdParam) {
      alert("please ensure photo, name, and movie are present.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage(null);

    try {
      const blob = base64ToBlob(imgSrc);
      const file = new File([blob], "moment.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("movie_id", movieIdParam);
      formData.append("user_name", user.name);
      formData.append("image", file);
      if (location) {
        formData.append("location", location);
      }

      await axios.post("/api/moments", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus("success");
      setImgSrc(null);
    } catch (error) {
      setUploadStatus("error");
      if (isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Failed to upload moment");
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      }
    } finally {
      setIsUploading(false);
    }
  }, [imgSrc, user, movieIdParam, location]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!movieIdParam) {
    return (
      <div className="min-h-screen bg-[#141414] text-white p-4 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="bg-blue-500/10 p-6 rounded-full border border-blue-500/50">
          <AlertCircle className="w-12 h-12 text-blue-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-500">Invalid Access</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Movie not found. You must select a movie first before uploading a moment.
          </p>
        </div>
        <Link
          href="/"
          className="px-8 py-2 bg-white text-sm text-black font-bold rounded-md hover:bg-gray-200 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <header className="flex items-center gap-4 py-4">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Upload Momen</h1>
        </header>
        {uploadStatus === "success" ? (
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 rounded-md text-center space-y-4 animate-in fade-in zoom-in">
            <h2 className="text-2xl font-bold">Success!</h2>
            <p>Your moment has been successfully uploaded.</p>
            <Link
              href={`/movie/${movieIdParam}`}
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Back to Movie
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {uploadStatus === "error" && errorMessage && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Your Name</label>
              <div className="w-full bg-[#262626] border border-gray-700 rounded-md p-3 text-white flex items-center gap-2">
                <div className="bg-blue-600 p-1 rounded-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-gray-400 ml-auto">(Login)</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Movies watched</label>
              <div className="bg-[#262626] border border-gray-700 rounded-md p-3 text-gray-300">
                {movieTitleParam || "Pilih film dari halaman detail"}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-black shadow-2xl border border-white/10">
              {imgSrc ? (
                <>
                  <Image
                    src={imgSrc}
                    alt="Captured"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <MapPin className={`w-3 h-3 ${locationError ? "text-red-500" : "text-green-500"}`} />
                    {isLocating ? (
                      "Mencari lokasi..."
                    ) : locationError ? (
                      <span className="text-red-400">{locationError}</span>
                    ) : location ? (
                      <span className="max-w-[150px] truncate">{location}</span>
                    ) : (
                      "No Location"
                    )}
                  </div>
                </>
              ) : cameraError ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-2 p-6 text-center">
                  <VideoOff className="w-12 h-12 mb-2" />
                  <p className="font-semibold">Camera Not Available</p>
                  <p className="text-xs">Please ensure camera permission is granted.</p>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                  onUserMediaError={() => setCameraError(true)}
                />
              )}
            </div>
            <div className="flex gap-4">
              {imgSrc ? (
                <>
                  <button
                    onClick={retake}
                    className="flex-1 py-3 px-4 rounded-md bg-[#262626] hover:bg-[#262626]/20 font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Retake Photo
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !user}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {isUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Send
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={capture}
                  disabled={cameraError}
                  className="w-full py-4 bg-blue-600 text-white hover:bg-blue-600/50 rounded-md font-bold text-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-6 h-6" />
                  Take Foto
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}