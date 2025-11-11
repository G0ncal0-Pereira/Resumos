'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractTextFromFile } from '@/lib/document-processor';

interface FileUploadProps {
  onFileProcessed: (content: string, fileName: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileProcessed, isProcessing }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Validar tamanho do arquivo (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Arquivo muito grande. Máximo 10MB.');
      setUploadStatus('error');
      return;
    }

    // Validar tipo de arquivo
    const validTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validExtensions = ['.txt', '.pdf', '.doc', '.docx'];
    const hasValidType = validTypes.includes(file.type) || 
                        validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType) {
      setErrorMessage('Formato não suportado. Use: TXT, PDF, DOC ou DOCX.');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const content = await extractTextFromFile(file);
      
      if (!content.trim()) {
        throw new Error('Arquivo vazio ou não foi possível extrair o texto.');
      }

      setUploadStatus('success');
      onFileProcessed(content, file.name);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar arquivo.');
      setUploadStatus('error');
    }
  }, [onFileProcessed]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processando arquivo...';
      case 'success':
        return 'Arquivo carregado com sucesso!';
      case 'error':
        return 'Erro ao carregar arquivo';
      default:
        return 'Arraste um arquivo aqui ou clique para selecionar';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload de Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : uploadStatus === 'success'
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
              : uploadStatus === 'error'
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
          } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept=".txt,.pdf,.doc,.docx"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center gap-4">
            {getStatusIcon()}
            
            <div>
              <p className="text-lg font-medium mb-2">
                {getStatusText()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Suporte para: TXT, PDF, DOC, DOCX (máx. 10MB)
              </p>
            </div>

            {uploadStatus === 'idle' && (
              <Button variant="outline" size="sm" disabled={isProcessing}>
                Selecionar Arquivo
              </Button>
            )}
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>• Documentos são processados localmente para sua privacidade</p>
          <p>• Formatos suportados: texto, PDF, Word</p>
          <p>• Análise feita com inteligência artificial</p>
        </div>
      </CardContent>
    </Card>
  );
}