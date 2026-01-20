'use client';

import { X, BookOpen, Zap, MapPin, Eye } from 'lucide-react';

interface Insect {
  id: string;
  name: string;
  commonName: string;
  confidence: number;
  image: string;
  class: string;
  description?: string;
  url?: string;
}

interface InsectDetailDialogProps {
  insect: Insect & Record<string, any>;
  uploadedImage: string;
  uploadedFile: File;
  onClose: () => void;
  onSave: (insect: Insect, uploadedImage: string, uploadedFile: File) => void;
}

export default function InsectDetailDialog({
  insect,
  uploadedImage,
  uploadedFile,
  onClose,
  onSave,
}: InsectDetailDialogProps) {
  const handleSave = () => {
    onSave(insect, uploadedImage, uploadedFile);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex justify-center p-0 md:p-4">
        <div
          className="bg-background w-full h-screen md:h-auto md:max-w-2xl md:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h3 className="text-xl font-semibold text-foreground truncate">
              {insect.commonName}
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Main Image */}
              <img
                src={insect.image || "/placeholder.svg"}
                alt={insect.commonName}
                className="w-full aspect-video object-cover bg-muted"
              />

              {/* Scientific Name */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Scientific Name
                </p>
                <p className="text-lg italic text-foreground">{insect.name}</p>
              </div>

              {/* Classification */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Class
                  </p>
                  <p className="text-foreground font-medium">{insect.class}</p>
                </div>
                <div className="border border-border p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Confidence
                  </p>
                  <p className="text-foreground font-medium">{insect.confidence}%</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Description</h4>
                </div>
                <p className="text-foreground leading-relaxed">
                  {insect.description ||
                    `The ${insect.commonName} is a fascinating species known for its intricate wing
                  patterns and graceful flight. These insects play an important role in their
                  ecosystems as pollinators and indicators of environmental health. They exhibit
                  remarkable adaptations for survival and reproduction in diverse habitats.`}
                </p>
              </div>

              {/* Characteristics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-accent" />
                  <h4 className="font-semibold text-foreground">Characteristics</h4>
                </div>
                <ul className="space-y-2 text-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary">▸</span>
                    <span>
                      Distinctive wing coloration and pattern with iridescent qualities
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary">▸</span>
                    <span>Wingspan typically ranges from 70-100mm</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary">▸</span>
                    <span>Active during warm, sunny periods</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary">▸</span>
                    <span>Feeds on various flowering plants and fruits</span>
                  </li>
                </ul>
              </div>

              {/* Habitat & Behavior */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Habitat</h4>
                  </div>
                  <p className="text-foreground">
                    Found in tropical and subtropical regions, preferring gardens, forests, and open
                    meadows with abundant flowering plants.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold text-foreground">Behavior</h4>
                  </div>
                  <p className="text-foreground">
                    These insects are highly mobile and territorial, spending most of their time
                    searching for food and mates. They are swift fliers capable of rapid directional
                    changes.
                  </p>
                </div>
              </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-border text-foreground hover:bg-muted transition-colors font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold"
              >
                Save Species
              </button>
            </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-4 flex-shrink-0 md:hidden">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border text-foreground hover:bg-muted transition-colors font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-semibold"
            >
              Save Species
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
