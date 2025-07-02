"use client";

import { useState } from "react";
import { album } from "@/lib/music-data";

export default function AudioDebugPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testAudioFiles = async () => {
    setIsTesting(true);
    const results = [];

    for (const track of album.tracks) {
      try {
        console.log(`Testing: ${track.audioUrl}`);
        
        // Test if file exists
        const response = await fetch(track.audioUrl, { method: 'HEAD' });
        
        results.push({
          title: track.title,
          url: track.audioUrl,
          status: response.status,
          statusText: response.statusText,
          size: response.headers.get('content-length'),
          type: response.headers.get('content-type'),
          exists: response.ok
        });
      } catch (error) {
        results.push({
          title: track.title,
          url: track.audioUrl,
          status: 'ERROR',
          statusText: error instanceof Error ? error.message : 'Unknown error',
          exists: false
        });
      }
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const testSingleFile = async (url: string) => {
    try {
      const audio = new Audio(url);
      
      return new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve({
            duration: audio.duration,
            canPlay: true
          });
        });
        
        audio.addEventListener('error', (e) => {
          resolve({
            error: 'Audio loading failed',
            canPlay: false
          });
        });
        
        audio.load();
      });
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error', canPlay: false };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audio Debug Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={testAudioFiles}
          disabled={isTesting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test All Audio Files'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Test Results:</h2>
          
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-4 border rounded ${result.exists ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
            >
              <h3 className="font-bold">{result.title}</h3>
              <p><strong>URL:</strong> {result.url}</p>
              <p><strong>Status:</strong> {result.status} - {result.statusText}</p>
              <p><strong>Size:</strong> {result.size ? `${(result.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}</p>
              <p><strong>Type:</strong> {result.type || 'Unknown'}</p>
              <p><strong>Exists:</strong> {result.exists ? '✅ Yes' : '❌ No'}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Manual Tests:</h2>
        
        {album.tracks.map((track, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{track.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{track.audioUrl}</p>
            
            <div className="space-x-2">
              <a 
                href={track.audioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Direct Link
              </a>
              
              <button 
                onClick={async () => {
                  const result = await testSingleFile(track.audioUrl);
                  alert(JSON.stringify(result, null, 2));
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Test Audio Element
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
