'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react';
import { DocumentAnalysis, QuizQuestion } from '@/lib/document-processor';

interface QuizComponentProps {
  analysis: DocumentAnalysis;
}

export function QuizComponent({ analysis }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizCompleted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < analysis.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    analysis.quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const progress = ((currentQuestion + 1) / analysis.quiz.length) * 100;
  const score = calculateScore();
  const total = analysis.quiz.length;

  if (showResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Resultados do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, total)}`}>
              {score}/{total}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {((score / total) * 100).toFixed(0)}% de acertos
            </p>
            <Badge className="mt-2" variant={score >= total * 0.8 ? 'default' : score >= total * 0.6 ? 'secondary' : 'destructive'}>
              {score >= total * 0.8 ? 'Excelente!' : score >= total * 0.6 ? 'Bom trabalho!' : 'Continue estudando!'}
            </Badge>
          </div>

          {/* Revisão das Respostas */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Revisão das Respostas
            </h3>
            {analysis.quiz.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="space-y-1 text-sm">
                        <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Sua resposta: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Resposta correta: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleRestart} className="w-full" variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = analysis.quiz[currentQuestion];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Quiz Interativo
          </CardTitle>
          <Badge variant="outline">
            {currentQuestion + 1} de {analysis.quiz.length}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pergunta */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Pergunta {currentQuestion + 1}
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            {currentQ.question}
          </p>
        </div>

        {/* Opções */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navegação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === analysis.quiz.length - 1 ? 'Finalizar' : 'Próxima'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}