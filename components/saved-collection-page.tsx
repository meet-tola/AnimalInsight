'use client';

import { Trash2, BookOpen, Archive } from 'lucide-react';

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

interface SavedCollectionPageProps {
  savedInsects: SavedInsect[];
  onDelete: (id: string) => void;
  onBack: () => void;
}

export default function SavedCollectionPage({
  savedInsects,
  onDelete,
  onBack,
}: SavedCollectionPageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-16 bg-background border-b border-border px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Archive className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Your Discoveries</h2>
          </div>
          <p className="text-muted-foreground">
            {savedInsects.length} {savedInsects.length === 1 ? 'species' : 'species'} saved
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {savedInsects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved species yet</h3>
              <p className="text-muted-foreground max-w-xs">
                Start by uploading an image to identify insects and save your discoveries.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedInsects.map((insect) => (
                <div
                  key={insect.id}
                  className="border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex gap-4 p-4">
                    {/* Main Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={insect.image || "/placeholder.svg"}
                        alt={insect.commonName}
                        className="w-24 h-24 object-cover bg-muted"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="font-semibold text-foreground truncate">
                          {insect.commonName}
                        </p>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {insect.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-primary">{insect.confidence}% match</span>
                          <span>•</span>
                          <span>{formatDate(insect.savedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Image Thumbnail */}
                    <div className="flex-shrink-0 hidden sm:block">
                      <img
                        src={insect.uploadedImage || "/placeholder.svg"}
                        alt="Your upload"
                        className="w-20 h-20 object-cover bg-muted border border-border"
                      />
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${insect.commonName}" from your collection?`,
                          )
                        ) {
                          onDelete(insect.id);
                        }
                      }}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
