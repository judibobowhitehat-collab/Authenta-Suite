import React, { useState, useRef } from 'react';
import { Upload, X, ShieldAlert, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { analyzeDocument } from '../services/geminiService';
import { VerificationResult, VerificationStatus } from '../types';

export const VerificationTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!previewUrl || !file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data without prefix
      const base64Data = previewUrl.split(',')[1];
      const analysis = await analyzeDocument(base64Data, file.type);
      setResult(analysis);
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED: return 'text-green-600 bg-green-50 border-green-200';
      case VerificationStatus.REJECTED: return 'text-red-600 bg-red-50 border-red-200';
      case VerificationStatus.SUSPICIOUS: return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED: return <CheckCircle className="w-6 h-6" />;
      case VerificationStatus.REJECTED: return <X className="w-6 h-6" />;
      case VerificationStatus.SUSPICIOUS: return <AlertTriangle className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Upload Section */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Upload</h3>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-h-[300px]
              ${file ? 'border-slate-300 bg-slate-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-[300px] max-w-full object-contain rounded-lg shadow-sm"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreviewUrl(null);
                    setResult(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG (Max 10MB)</p>
              </>
            )}
          </div>

          <div className="mt-6">
            <Button 
              className="w-full" 
              onClick={handleAnalyze} 
              disabled={!file} 
              isLoading={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing Document...' : 'Analyze with Gemini'}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Analysis Results</h3>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm mb-4 flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {!result && !isAnalyzing && !error && (
             <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                <p>Upload a document to view analysis results</p>
             </div>
          )}

          {isAnalyzing && (
            <div className="h-[300px] flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p>Gemini is inspecting security features...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* Header Status */}
              <div className={`p-4 rounded-lg border flex items-center gap-4 ${getStatusColor(result.status)}`}>
                <div className="p-2 bg-white/50 rounded-full">
                  {getStatusIcon(result.status)}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Verification Status</p>
                  <p className="text-xl font-bold">{result.status}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-medium opacity-80">Confidence</p>
                  <p className="text-2xl font-bold">{result.confidenceScore}%</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Analysis Summary</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                  {result.summary}
                </p>
              </div>

              {/* Extracted Data */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Extracted Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(result.extractedData).map(([key, value]) => (
                     value ? (
                      <div key={key} className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="block text-xs text-slate-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium text-slate-800">{value as string}</span>
                      </div>
                     ) : null
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {result.riskFactors.length > 0 && (
                <div>
                   <h4 className="text-sm font-semibold text-slate-900 mb-2">Risk Factors</h4>
                   <ul className="space-y-2">
                      {result.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                   </ul>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
