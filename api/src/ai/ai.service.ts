import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, {
  APIConnectionError,
  APIError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
} from 'openai';

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
  private readonly logger = new Logger(AiService.name);
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

      this.logger.error('OpenAI request failed', this.formatErrorForLog(error));
      throw new BadGatewayException(this.resolveUserMessage(error));
    }
  }

  private resolveUserMessage(error: unknown): string {
    if (error instanceof AuthenticationError) {
      return 'OpenAI API key is invalid. Check OPENAI_API_KEY on the server.';
    }

    if (error instanceof PermissionDeniedError) {
      return 'OpenAI access denied. Verify billing and project permissions.';
    }

    if (error instanceof RateLimitError) {
      return 'OpenAI rate limit or quota exceeded. Try again later or check billing.';
    }

    if (error instanceof APIConnectionError) {
      return 'Cannot reach OpenAI. Check network connectivity on the server.';
    }

    if (error instanceof APIError) {
      const model = this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

      if (error.status === 404) {
        return `OpenAI model "${model}" was not found. Check OPENAI_MODEL.`;
      }

      if (error.message) {
        return `OpenAI error: ${error.message}`;
      }
    }

    if (error instanceof Error && error.message) {
      return `AI service error: ${error.message}`;
    }

    return 'AI service is temporarily unavailable.';
  }

  private formatErrorForLog(error: unknown) {
    if (error instanceof APIError) {
      return {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      };
    }

    if (error instanceof Error) {
      return { message: error.message, name: error.name };
    }

    return { error };
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
