import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GenerateReplyInput {
  locale: 'en' | 'vi';
  history: AiMessage[];
  message: string;
}

@Injectable()
export class AiService {
  private client: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {}

  async generateReply(input: GenerateReplyInput): Promise<string> {
    try {
      const completion = await this.getClient().chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(input.locale),
          },
          ...input.history,
          {
            role: 'user',
            content: input.message,
          },
        ],
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (!reply) {
        throw new BadGatewayException('AI service returned an empty response.');
      }

      return reply;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException('AI service is temporarily unavailable.');
    }
  }

  private getClient() {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
      });
    }

    return this.client;
  }

  private buildSystemPrompt(locale: 'en' | 'vi') {
    const languageInstruction =
      locale === 'vi'
        ? 'Respond in Vietnamese unless the user explicitly asks for another language.'
        : 'Respond in English unless the user explicitly asks for another language.';

    return [
      'You are a reliable multilingual AI assistant for a production web app.',
      languageInstruction,
      'Keep answers helpful, accurate, safe, and reasonably concise.',
      'If the user asks for code or structured output, format it clearly.',
    ].join(' ');
  }
}
