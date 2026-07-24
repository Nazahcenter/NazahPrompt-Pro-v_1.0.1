export type PromptRole = 'expert' | 'creative' | 'critic' | 'assistant' | 'teacher' | 'developer';
export type PromptTone = 'professional' | 'casual' | 'academic' | 'persuasive' | 'concise' | 'enthusiastic';
export type PromptFormat = 'markdown' | 'list' | 'paragraph' | 'step-by-step' | 'json';

export interface PromptConfig {
  role: PromptRole;
  tone: PromptTone;
  format: PromptFormat;
  audience: string;
  constraints: string;
}

export interface GeneratedPrompt {
  id: string;
  originalIdea: string;
  config: PromptConfig;
  result: string;
  timestamp: number;
}

export const INITIAL_CONFIG: PromptConfig = {
  role: 'expert',
  tone: 'professional',
  format: 'markdown',
  audience: 'Tout public',
  constraints: 'Pas de jargon technique inutile',
};
