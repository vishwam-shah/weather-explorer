"use client";

import { useState } from "react";
import InputPanel from "@/components/inputPanel";
import StoredFiles from "@/components/storedFiles";
import DataVisualization from "@/components/dataVisualization";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="material-symbols-outlined text-4xl text-accent-blue">
            cloud
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1c1e] tracking-tight">
            Weather Explorer
          </h1>
        </div>
        <p className="text-[#3c3c43]/40 text-[15px] max-w-md mx-auto">
          Fetch historical weather data, store in AWS S3, and visualize
          temperature trends
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <InputPanel />
          <StoredFiles
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>
        <div className="lg:col-span-2">
          <DataVisualization selectedFile={selectedFile} />
        </div>
      </div>
    </main>
  );
}
