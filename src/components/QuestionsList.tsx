'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { DocumentAnalysis } from '@/lib/document-processor';

interface QuestionsListProps {
  analysis: DocumentAnalysis;
}

export function QuestionsList({ analysis }: QuestionsListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Perguntas para Reflexão
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use estas perguntas para aprofundar seu entendimento do conteúdo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysis.questions.map((question, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  {question}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Dica de Estudo
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Tente responder cada pergunta mentalmente ou por escrito antes de revisar o documento. 
            Isso ajuda a consolidar o aprendizado e identificar pontos que precisam de mais atenção.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}