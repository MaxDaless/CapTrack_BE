'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { parseCSVFile } from '@/lib/csv-parser';
import { useStore } from '@/lib/store';

export function CSVUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const addFile = useStore((state) => state.addFile);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.endsWith('.csv')
    );

    for (const file of files) {
      try {
        const broker = extractBrokerName(file.name);
        const csvFile = await parseCSVFile(file, broker);
        addFile(csvFile);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert(`Error parsing ${file.name}. Please check the file format.`);
      }
    }

    setIsProcessing(false);
  }, [addFile]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setIsProcessing(true);
    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        const broker = extractBrokerName(file.name);
        const csvFile = await parseCSVFile(file, broker);
        addFile(csvFile);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert(`Error parsing ${file.name}. Please check the file format.`);
      }
    }

    setIsProcessing(false);
    e.target.value = '';
  }, [addFile]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-6 md:p-10 lg:p-12 text-center transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/50'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50'}
      `}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <Upload className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
          <div>
            <p className="text-sm md:text-base lg:text-lg font-medium">
              {isProcessing ? 'Processing files...' : 'Drop CSV files here or click to browse'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
              Supports multiple files (Keytrade, Bolero, etc.)
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}

function extractBrokerName(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('keytrade')) return 'Keytrade';
  if (lower.includes('bolero')) return 'Bolero';
  if (lower.includes('degiro')) return 'Degiro';
  if (lower.includes('trading212')) return 'Trading 212';
  return 'Unknown';
}
