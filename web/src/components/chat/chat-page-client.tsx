'use client';

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  createChat,
  fetchChatDetail,
  fetchChatSummaries,
  getErrorMessage,
  sendChatMessage,
} from '@/lib/api';
import type { AppLocale } from '@/lib/constants';
import { useAuth } from '@/components/providers/auth-provider';
import type { ChatDetail, ChatMessage, ChatSummary } from '@/types/api';

type UiMessage = ChatMessage & {
  pending?: boolean;
};

type UiChat = Omit<ChatDetail, 'messages'> & {
  messages: UiMessage[];
};

export function ChatPageClient() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const { status, token } = useAuth();
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
  const [currentChat, setCurrentChat] = useState<UiChat | null>(null);
  const [draft, setDraft] = useState('');
  const [pageError, setPageError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages.length]);

  async function animateAssistantResponse(chat: ChatDetail) {
    const assistantIndex = chat.messages.length - 1;
    const finalMessage = chat.messages[assistantIndex];

    if (!finalMessage) {
      setCurrentChat(chat);
      return;
    }

    const baseMessages = chat.messages.map((message, index) =>
      index === assistantIndex ? { ...message, content: '' } : message,
    );

    setCurrentChat({
      ...chat,
      messages: baseMessages,
    });

    const step = Math.max(3, Math.floor(finalMessage.content.length / 24));

    for (
      let index = step;
      index <= finalMessage.content.length + step;
      index += step
    ) {
      await new Promise((resolve) => window.setTimeout(resolve, 18));

      setCurrentChat((activeChat) => {
        if (!activeChat || activeChat.id !== chat.id) {
          return activeChat;
        }

        const nextMessages = activeChat.messages.slice();
        const existingAssistantMessage = nextMessages[assistantIndex];

        if (!existingAssistantMessage) {
          return activeChat;
        }

        nextMessages[assistantIndex] = {
          ...existingAssistantMessage,
          content: finalMessage.content.slice(
            0,
            Math.min(index, finalMessage.content.length),
          ),
        };

        return {
          ...activeChat,
          messages: nextMessages,
        };
      });
    }

    setCurrentChat(chat);
  }

  const loadConversations = useCallback(
    async (chatId?: string) => {
      if (!token) {
        return;
      }

      setPageError(null);
      setIsBootstrapping(true);

      try {
        const summaries = await fetchChatSummaries(token);
        setChatSummaries(summaries);

        const nextChatId = chatId ?? summaries[0]?.id;

        if (nextChatId) {
          const chat = await fetchChatDetail(token, nextChatId);
          setCurrentChat(chat);
        } else {
          setCurrentChat(null);
        }
      } catch (error) {
        setPageError(getErrorMessage(error, t('chat.loadError')));
      } finally {
        setIsBootstrapping(false);
      }
    },
    [t, token],
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status !== 'authenticated' || !token) {
      return;
    }

    void loadConversations();
  }, [loadConversations, router, status, token]);

  async function handleSelectChat(chatId: string) {
    if (!token) {
      return;
    }

    setIsChatLoading(true);
    setPageError(null);

    try {
      const chat = await fetchChatDetail(token, chatId);
      setCurrentChat(chat);
    } catch (error) {
      setPageError(getErrorMessage(error, t('chat.loadError')));
    } finally {
      setIsChatLoading(false);
    }
  }

  function handleNewChat() {
    setCurrentChat(null);
    setDraft('');
    setPageError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || isSending) {
      return;
    }

    const message = draft.trim();

    if (!message) {
      return;
    }

    const existingChatId =
      currentChat && currentChat.id !== 'pending' ? currentChat.id : null;
    const timestamp = new Date().toISOString();

    setDraft('');
    setPageError(null);
    setIsSending(true);
    setCurrentChat((activeChat) => {
      const optimisticMessages: UiMessage[] = [
        ...(activeChat?.messages ?? []),
        {
          role: 'user',
          content: message,
          createdAt: timestamp,
        },
        {
          role: 'assistant',
          content: t('chat.thinking'),
          createdAt: timestamp,
          pending: true,
        },
      ];

      return {
        id: activeChat?.id ?? 'pending',
        title: activeChat?.title ?? truncate(message, 56),
        createdAt: activeChat?.createdAt ?? timestamp,
        updatedAt: timestamp,
        messages: optimisticMessages,
      };
    });

    try {
      const response = existingChatId
        ? await sendChatMessage(token, existingChatId, {
            message,
            locale,
          })
        : await createChat(token, {
            message,
            locale,
          });

      await animateAssistantResponse(response);
      const summaries = await fetchChatSummaries(token);
      setChatSummaries(summaries);
    } catch (error) {
      setPageError(getErrorMessage(error, t('chat.sendError')));
      setDraft(message);

      if (existingChatId) {
        await handleSelectChat(existingChatId);
      } else {
        setCurrentChat(null);
      }
    } finally {
      setIsSending(false);
    }
  }

  if (status === 'loading' || isBootstrapping) {
    return (
      <div className="glass-panel mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center rounded-[32px] px-8 py-16 text-center">
        <div className="mb-5 h-14 w-14 animate-pulse rounded-full bg-accent-soft" />
        <h1 className="text-2xl font-semibold text-foreground">
          {t('chat.guardTitle')}
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted">
          {t('chat.guardDescription')}
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="glass-panel mesh-panel rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {t('chat.history')}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {t('chat.title')}
              </h2>
            </div>
            <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">
              {t('chat.connected')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="mt-5 w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong"
          >
            {t('chat.new')}
          </button>

          <div className="mt-5 space-y-3">
            {chatSummaries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line px-4 py-6 text-sm text-muted">
                {t('chat.noConversations')}
              </div>
            ) : null}

            {chatSummaries.map((summary) => {
              const isActive = summary.id === currentChat?.id;

              return (
                <button
                  key={summary.id}
                  type="button"
                  onClick={() => void handleSelectChat(summary.id)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    isActive
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-background/72 hover:border-accent/40 hover:bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">
                      {summary.title}
                    </p>
                    <span className="shrink-0 text-xs text-muted">
                      {formatTimestamp(summary.updatedAt, locale)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">
                    {summary.lastMessagePreview || t('chat.continue')}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex h-full min-h-[70vh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  {t('nav.workspace')}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground">
                  {currentChat?.title ?? t('chat.emptyTitle')}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-muted">
                  {currentChat ? t('chat.subtitle') : t('chat.emptyDescription')}
                </p>
              </div>
              {pageError ? (
                <button
                  type="button"
                  onClick={() =>
                    void loadConversations(
                      currentChat?.id !== 'pending' ? currentChat?.id : undefined,
                    )
                  }
                  className="rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary"
                >
                  {t('chat.retry')}
                </button>
              ) : null}
            </div>

            {pageError ? (
              <div className="mt-5 rounded-3xl border border-secondary/20 bg-secondary/10 px-4 py-4 text-sm text-secondary">
                {pageError}
              </div>
            ) : null}

            <div className="mt-5 flex-1 overflow-y-auto rounded-[24px] border border-line bg-surface/80 p-4 sm:p-5">
              {currentChat?.messages.length ? (
                <div className="space-y-4">
                  {currentChat.messages.map((message, index) => {
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={`${message.createdAt}-${index}`}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-[26px] px-4 py-3 shadow-sm sm:max-w-[72%] ${
                            isUser
                              ? 'bg-accent text-white'
                              : 'border border-line bg-card text-foreground'
                          }`}
                        >
                          <p
                            className={`whitespace-pre-wrap text-sm leading-7 ${
                              message.pending ? 'italic opacity-80' : ''
                            }`}
                          >
                            {message.content}
                          </p>
                          <p
                            className={`mt-2 text-xs ${
                              isUser ? 'text-white/80' : 'text-muted'
                            }`}
                          >
                            {formatTimestamp(message.createdAt, locale)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              ) : (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="mb-5 h-16 w-16 rounded-full bg-accent-soft" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    {t('chat.welcome')}
                  </h2>
                  <p className="mt-3 max-w-xl text-base text-muted">
                    {t('chat.welcomeDescription')}
                  </p>
                </div>
              )}
            </div>

            <form className="mt-5" onSubmit={handleSubmit}>
              <label htmlFor="chat-message" className="sr-only">
                {t('chat.placeholder')}
              </label>
              <div className="rounded-[28px] border border-line bg-card p-3 shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
                <textarea
                  id="chat-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
                    }
                  }}
                  rows={4}
                  placeholder={t('chat.placeholder')}
                  className="w-full resize-none bg-transparent px-3 py-2 text-base text-foreground outline-none placeholder:text-muted"
                />
                <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted">{t('chat.composerHint')}</p>
                  <button
                    type="submit"
                    disabled={isSending || isChatLoading}
                    className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSending ? t('chat.thinking') : t('chat.send')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTimestamp(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
