'use client';

import { useState, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';
import LandingPage from '@/components/landing-page';
import UploadPage from '@/components/upload-page';
import ResultsPage from '@/components/results-page';
import SavedCollectionPage from '@/components/saved-collection-page';

interface SavedInsect {
  id: string;
  name: string;
  commonName: string;
  confidence: number;
  image: string;
  class: string;
  uploadedImage: string;
  uploadedFile?: File;
  savedAt: string;
}

type PageState = 'landing' | 'upload' | 'results' | 'collection';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [identificationResults, setIdentificationResults] = useState<any[] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [savedInsects, setSavedInsects] = useState<SavedInsect[]>([]);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Load saved insects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedInsects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out entries with invalid File objects
        setSavedInsects(parsed.filter((item: SavedInsect) => item.id && item.commonName));
      } catch (e) {
        console.log('Could not parse saved insects');
      }
    }
  }, []);

  // Save insects to localStorage
  const saveInsect = (insect: any, uploadedImage: string, uploadedFile: File) => {
    const newSavedInsect: SavedInsect = {
      id: `${insect.id}-${Date.now()}`,
      name: insect.name,
      commonName: insect.commonName,
      confidence: insect.confidence,
      image: insect.image,
      class: insect.class,
      uploadedImage,
      savedAt: new Date().toISOString(),
    };

    const updated = [...savedInsects, newSavedInsect];
    setSavedInsects(updated);
    // Only save serializable data
    localStorage.setItem('savedInsects', JSON.stringify(updated));
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const deleteInsect = (id: string) => {
    const updated = savedInsects.filter((item) => item.id !== id);
    setSavedInsects(updated);
    localStorage.setItem('savedInsects', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 border border-primary/50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Species saved successfully!</span>
        </div>
      )}

      {/* Page Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('landing')}
            className={`font-semibold transition-colors ${
              currentPage === 'landing'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Animal Insight
          </button>

          <div className="flex items-center gap-4">
            {(currentPage === 'upload' || currentPage === 'results') && (
              <button
                onClick={() => setCurrentPage('landing')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </button>
            )}

            <button
              onClick={() => setCurrentPage('collection')}
              className={`px-4 py-2 text-sm font-semibold border transition-colors ${
                currentPage === 'collection'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              Saved ({savedInsects.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div>
        {currentPage === 'landing' && (
          <LandingPage onGetStarted={() => setCurrentPage('upload')} />
        )}

        {currentPage === 'upload' && (
          <UploadPage
            onImageSelected={(image, file, results, token) => {
              setUploadedImage(image);
              setUploadedFile(file);
              setIdentificationResults(results || null);
              setAccessToken(token || null);
              setCurrentPage('results');
            }}
            onBack={() => setCurrentPage('landing')}
          />
        )}

        {currentPage === 'results' && uploadedImage && uploadedFile && (
          <ResultsPage
            uploadedImage={uploadedImage}
            uploadedFile={uploadedFile}
            identificationResults={identificationResults}
            accessToken={accessToken}
            onBack={() => {
              setCurrentPage('upload');
              setUploadedImage(null);
              setUploadedFile(null);
              setIdentificationResults(null);
              setAccessToken(null);
            }}
            onSave={saveInsect}
          />
        )}

        {currentPage === 'collection' && (
          <SavedCollectionPage
            savedInsects={savedInsects}
            onDelete={deleteInsect}
            onBack={() => setCurrentPage('landing')}
          />
        )}
      </div>
    </main>
  );
}
