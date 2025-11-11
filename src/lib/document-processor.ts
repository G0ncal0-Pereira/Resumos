import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface DocumentAnalysis {
  summary: string;
  questions: string[];
  quiz: QuizQuestion[];
  keyPoints: string[];
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function processDocument(content: string, fileName: string): Promise<DocumentAnalysis> {
  try {
    const prompt = `
Analise o seguinte documento e forneça:

1. RESUMO: Um resumo conciso e informativo (máximo 300 palavras)
2. PONTOS-CHAVE: 5-8 pontos principais do documento
3. PERGUNTAS: 5 perguntas abertas para reflexão sobre o conteúdo
4. QUIZ: 5 questões de múltipla escolha com 4 opções cada, indicando a resposta correta e explicação
5. DIFICULDADE: Classifique como Básico, Intermediário ou Avançado

Documento: "${fileName}"
Conteúdo:
${content.substring(0, 8000)} ${content.length > 8000 ? '...' : ''}

Responda APENAS em formato JSON válido:
{
  "summary": "resumo aqui",
  "keyPoints": ["ponto 1", "ponto 2", ...],
  "questions": ["pergunta 1", "pergunta 2", ...],
  "quiz": [
    {
      "question": "pergunta",
      "options": ["opção 1", "opção 2", "opção 3", "opção 4"],
      "correctAnswer": 0,
      "explanation": "explicação da resposta"
    }
  ],
  "difficulty": "Básico|Intermediário|Avançado"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = response.choices[0]?.message?.content;
    if (!result) throw new Error('Resposta vazia da IA');

    return JSON.parse(result);
  } catch (error) {
    console.error('Erro ao processar documento:', error);
    throw new Error('Falha ao analisar o documento. Tente novamente.');
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    }

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Para PDF, vamos usar uma abordagem simples com FileReader
      // Em produção, você usaria pdf-parse no backend
      const text = await file.text();
      return text || 'Conteúdo PDF detectado. Para melhor extração, use um arquivo de texto.';
    }

    if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      // Para DOCX, similar ao PDF
      const text = await file.text();
      return text || 'Documento Word detectado. Para melhor extração, salve como arquivo de texto.';
    }

    // Fallback para outros tipos
    return await file.text();
  } catch (error) {
    console.error('Erro ao extrair texto:', error);
    throw new Error('Não foi possível extrair o texto do arquivo. Tente um formato diferente.');
  }
}