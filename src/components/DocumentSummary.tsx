'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, BookOpen } from 'lucide-react';
import { DocumentAnalysis } from '@/lib/document-processor';

interface DocumentSummaryProps {
  analysis: DocumentAnalysis;
  fileName: string;
}

export function DocumentSummary({ analysis, fileName }: DocumentSummaryProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avançado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle className="text-lg">Resumo do Documento</CardTitle>
          </div>
          <Badge className={getDifficultyColor(analysis.difficulty)}>
            {analysis.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {fileName}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo Principal */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold">Resumo</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Pontos-Chave */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-green-500" />
            <h3 className="font-semibold">Pontos-Chave</h3>
          </div>
          <ul className="space-y-2">
            {analysis.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analysis.keyPoints.length}</p>
            <p className="text-xs text-gray-500">Pontos-Chave</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analysis.questions.length}</p>
            <p className="text-xs text-gray-500">Perguntas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{analysis.quiz.length}</p>
            <p className="text-xs text-gray-500">Quiz</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}