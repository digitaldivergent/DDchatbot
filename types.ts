export type MessageSender = 'user' | 'bot';

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export interface LeadData {
  nameOrBusiness: string;
  industry: string;
  answers: string[];
  recommendation: string;
  email?: string;
  phone?: string;
  submittedAt: string;
}