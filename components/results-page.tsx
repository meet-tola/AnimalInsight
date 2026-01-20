'use client';

import { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import InsectDetailDialog from './insect-detail-dialog';

interface Insect {
  id: string;
  name: string;
  commonName: string;
  confidence: number;
  image: string;
  class: string;
}

interface ResultsPageProps {
  uploadedImage: string;
  uploadedFile: File;
  identificationResults?: any[];
  accessToken?: string;
  onBack: () => void;
  onSave: (insect: Insect, uploadedImage: string, uploadedFile: File) => void;
}

// Mock insect data
const mockInsects: Insect[] = [
  {
    id: '1',
    name: 'Papilio polytes',
    commonName: 'Common Mormon',
    confidence: 94,
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop',
    class: 'Insecta',
  },
  {
    id: '2',
    name: 'Heliconius sara',
    commonName: 'Sara Longwing',
    confidence: 87,
    image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400&h=400&fit=crop',
    class: 'Insecta',
  },
  {
    id: '3',
    name: 'Morpho peleides',
    commonName: 'Blue Morpho',
    confidence: 78,
    image: 'https://images.unsplash.com/photo-1526571142338-d31e59c8b6f4?w=400&h=400&fit=crop',
    class: 'Insecta',
  },
  {
    id: '4',
    name: 'Vanessa atalanta',
    commonName: 'Red Admiral',
    confidence: 71,
    image: 'https://images.unsplash.com/photo-1478632963381-916e93b83b54?w=400&h=400&fit=crop',
    class: 'Insecta',
  },
];

export default function ResultsPage({
  uploadedImage,
  uploadedFile,
  identificationResults,
  accessToken,
  onBack,
  onSave,
}: ResultsPageProps) {
  const [selectedInsect, setSelectedInsect] = useState<Insect | null>(null);
  const [loading, setLoading] = useState(false);

  // Transform API results to Insect format
  const insects: Insect[] = identificationResults
    ? identificationResults.map((result: any, index: number) => ({
        id: result.id || `insect-${index}`,
        name: result.name || 'Unknown Species',
        commonName: result.commonNames?.[0] || result.name || 'Unknown',
        confidence: Math.round((result.probability || 0) * 100),
        image: result.image || result.images?.[0]?.url || '/placeholder.svg',
        class: 'Insecta',
      }))
    : mockInsects;

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
        <h2 className="text-xl font-semibold text-foreground">Results</h2>
        <div className="w-12" />
      </div>

      {/* Uploaded Image */}
      <div className="px-6 py-8 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <img
            src={uploadedImage || "/placeholder.svg"}
            alt="Uploaded"
            className="w-full aspect-square object-cover bg-muted mb-4"
          />
          <p className="text-sm text-muted-foreground">
            Analyzing insect type and searching for matches in our database...
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-6">Similar Species</h3>

          <div className="space-y-4">
            {insects.map((insect) => (
              <div
                key={insect.id}
                className="group border border-border hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => setSelectedInsect(insect)}
                  className="w-full text-left"
                >
                  <div className="flex gap-4 p-4">
                    {/* Insect Image */}
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
                      </div>

                      {/* Confidence Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Confidence</span>
                          <span className="text-sm font-semibold text-foreground">
                            {insect.confidence}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${insect.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                      <Info className="w-5 h-5" />
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-12 p-4 bg-accent/10 border border-accent/20">
            <p className="text-sm text-foreground">
              These are the most likely matches based on the image analysis. Click on any species to view detailed information, then save your favorites.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedInsect && (
        <InsectDetailDialog
          insect={selectedInsect}
          uploadedImage={uploadedImage}
          uploadedFile={uploadedFile}
          onClose={() => setSelectedInsect(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
