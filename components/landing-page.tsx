'use client';

import { useState } from 'react';
import { Leaf, Search, Save } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="pt-12 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Leaf className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            InsectID
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Instantly identify insects and animals from photos
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Features Grid */}
        <div className="w-full max-w-2xl space-y-8 mb-12">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 bg-primary text-primary-foreground">
                <Search className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Smart Identification
              </h3>
              <p className="text-muted-foreground">
                Capture or upload images to instantly identify insects and animals with detailed accuracy.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 bg-accent text-accent-foreground">
                <Leaf className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Species Details
              </h3>
              <p className="text-muted-foreground">
                Explore comprehensive information about similar species, including characteristics and behavior.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 bg-primary text-primary-foreground">
                <Save className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Save & Discover
              </h3>
              <p className="text-muted-foreground">
                Keep your discoveries in a personal collection for reference and future exploration.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="bg-primary text-primary-foreground px-8 py-3 text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Explore the natural world at your fingertips</p>
      </footer>
    </div>
  );
}
