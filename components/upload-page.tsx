'use client';

import React from "react"

import { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface UploadPageProps {
  onImageSelected: (
    image: string,
    file: File,
    results?: any[],
    accessToken?: string
  ) => void;
  onBack: () => void;
}

export default function UploadPage({ onImageSelected, onBack }: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setIsAnalyzing(true);
      try {
        // Upload to real API
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/identify', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to identify insect');
        }

        const data = await response.json();
        console.log('Identification results:', data);

        // Pass the results along with the image
        setIsAnalyzing(false);
        onImageSelected(result, file, data.results, data.accessToken);
      } catch (error) {
        console.error('Identification error:', error);
        setIsAnalyzing(false);
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to analyze image';
        setError(errorMsg);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-foreground hover:text-primary transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-foreground">Analyzing Image</h2>
          <div className="w-12" />
        </div>

        {/* Image Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-md mb-8">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full aspect-square object-cover bg-muted"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-white font-semibold text-sm">Analyzing...</p>
                </div>
              </div>
            )}
          </div>

          {!isAnalyzing && error && (
            <div className="max-w-md text-center">
              <p className="text-destructive font-medium mb-4">{error}</p>
              <button
                onClick={clearPreview}
                className="px-6 py-2 border border-border text-foreground hover:bg-muted transition-colors"
              >
                Try Another
              </button>
            </div>
          )}

          {!isAnalyzing && !error && (
            <div className="flex gap-4">
              <button
                onClick={clearPreview}
                className="px-6 py-2 border border-border text-foreground hover:bg-muted transition-colors"
              >
                Try Another
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-foreground hover:text-primary transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-foreground">Upload Image</h2>
        <div className="w-12" />
      </div>

      {/* Upload Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Camera Upload */}
          <div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-3 py-12 border border-border hover:bg-muted transition-colors group"
            >
              <Camera className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-foreground text-lg">Take Photo</p>
                <p className="text-sm text-muted-foreground">Use your device camera</p>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-border" />
            <span className="text-muted-foreground text-sm">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* File Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-3 py-12 border border-border hover:bg-muted transition-colors group"
            >
              <Upload className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-foreground text-lg">Upload File</p>
                <p className="text-sm text-muted-foreground">Choose from your library</p>
              </div>
            </button>
          </div>

          {/* Info */}
          <div className="p-4 bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              For best results, use clear, well-lit photos of insects or animals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
