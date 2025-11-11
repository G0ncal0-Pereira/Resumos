'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Brain, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { DocumentSummary } from '@/components/DocumentSummary';
import { QuestionsList } from '@/components/QuestionsList';
import { QuizComponent } from '@/components/QuizComponent';
import { processDocument, DocumentAnalysis } from '@/lib/document-processor';

export default function Home() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileProcessed = async (content: string, name: string) => {
    setIsProcessing(true);
    setError('');
    setFileName(name);

    try {
      const result = await processDocument(content, name);
      setAnalysis(result);
    } catch (err) {
      console.error('Erro ao processar documento:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar documento.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analisador de Documentos IA
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Carregue qualquer documento e obtenha resumos inteligentes, perguntas para reflexão e quizzes interativos
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onFileProcessed={handleFileProcessed} isProcessing={isProcessing} />
        </div>

        {/* Processing State */}
        {isProcessing && (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analisando documento...</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nossa IA está processando seu documento e gerando insights personalizados
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {analysis && !isProcessing && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Perguntas</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Resultados</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <DocumentSummary analysis={analysis} fileName={fileName} />
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <QuestionsList analysis={analysis} />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <QuizComponent analysis={analysis} />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Análise Completa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Estatísticas do Documento</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Pontos-chave identificados:</span>
                          <span className="font-medium">{analysis.keyPoints.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Perguntas geradas:</span>
                          <span className="font-medium">{analysis.questions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Questões do quiz:</span>
                          <span className="font-medium">{analysis.quiz.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nível de dificuldade:</span>
                          <span className="font-medium">{analysis.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Próximos Passos</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Leia o resumo para uma visão geral</li>
                        <li>• Reflita sobre as perguntas propostas</li>
                        <li>• Teste seu conhecimento no quiz</li>
                        <li>• Revise os pontos onde teve dificuldade</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {!analysis && !isProcessing && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum documento carregado</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Faça upload de um documento para começar a análise inteligente
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium">Resumos IA</p>
                    <p className="text-gray-600 dark:text-gray-400">Análise automática</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">Perguntas</p>
                    <p className="text-gray-600 dark:text-gray-400">Para reflexão</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}