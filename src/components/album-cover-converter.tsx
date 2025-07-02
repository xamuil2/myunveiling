"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export function AlbumCoverConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedImage(null);
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setIsConverting(true);
    
    try {
      const img = new Image();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Set canvas to square dimensions
      canvas.width = 1000;
      canvas.height = 1000;

      img.onload = () => {
        // Calculate dimensions to fit image in square while maintaining aspect ratio
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        // Draw image centered and cropped to square
        ctx.drawImage(
          img,
          offsetX, offsetY, size, size, // source rectangle
          0, 0, 1000, 1000 // destination rectangle
        );

        // Convert to JPEG
        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
        setConvertedImage(dataURL);
        setIsConverting(false);
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      console.error('Error converting image:', error);
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.download = 'album-cover.jpg';
    link.href = convertedImage;
    link.click();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Album Cover Converter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Convert your TIF file to a square JPG format for your album cover.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".tif,.tiff,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="space-y-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Image File
        </Button>

        {selectedFile && (
          <div className="text-sm text-muted-foreground">
            Selected: {selectedFile.name}
          </div>
        )}

        {selectedFile && !convertedImage && (
          <Button
            onClick={convertImage}
            disabled={isConverting}
            className="w-full"
          >
            {isConverting ? 'Converting...' : 'Convert to Square JPG'}
          </Button>
        )}

        {convertedImage && (
          <div className="space-y-4">
            <img
              src={convertedImage}
              alt="Converted album cover"
              className="w-full rounded-lg"
            />
            <Button
              onClick={downloadImage}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Album Cover
            </Button>
            <p className="text-xs text-muted-foreground">
              Save this as &quot;album-cover.jpg&quot; in your public folder.
            </p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
