import React, { Component, ErrorInfo, ReactNode } from 'react';
import { getSettings } from '../../lib/storage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  theme: 'manuscript' | 'sanctum' | 'cosmic';
  shade: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    theme: 'manuscript',
    shade: 'tadpatra',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    let theme: 'manuscript' | 'sanctum' | 'cosmic' = 'manuscript';
    let shade = 'tadpatra';
    try {
      if (typeof window !== 'undefined') {
        const s = getSettings();
        if (s?.backgroundTheme) theme = s.backgroundTheme;
        if (s?.manuscriptShade) shade = s.manuscriptShade;
      }
    } catch (_) {}
    return { hasError: true, error, errorInfo: null, copied: false, theme, shade };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Jain Jinvani:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    // Client telemetry hook (e.g. Sentry / custom logger / error beacon)
    try {
      if (typeof window !== 'undefined' && (window as any).__JAIN_JINVANI_LOG_ERROR__) {
        (window as any).__JAIN_JINVANI_LOG_ERROR__({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (_) {
      // Ignore telemetry dispatch errors to prevent cascading failures
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, copied: false });
    window.location.href = '/';
  };

  private handleCopyError = async () => {
    const { error, errorInfo } = this.state;
    const text = `Jain Jinvani Error Report:\nURL: ${typeof window !== 'undefined' ? window.location.href : ''}\nTime: ${new Date().toISOString()}\nError: ${error?.toString()}\nStack:\n${error?.stack || ''}\nComponentStack:\n${errorInfo?.componentStack || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (_) {
      // Fallback if clipboard API unavailable
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { theme, shade } = this.state;
      const isManuscript = theme === 'manuscript';

      return (
        <div
          className={`error-boundary-screen min-h-screen w-full flex items-center justify-center p-6 transition-colors duration-300 ${
            isManuscript
              ? `theme-manuscript shade-${shade} bg-[var(--neu-bg,#FAF6EE)] text-[var(--neu-ink,#1C1917)]`
              : theme === 'sanctum'
              ? 'theme-sanctum dark bg-[#05070d] text-amber-50'
              : 'theme-cosmic dark bg-[#030712] text-slate-100'
          }`}
        >
          <div
            className={`error-boundary-card relative z-10 max-w-md w-full p-6 sm:p-7 rounded-2xl text-center shadow-2xl transition-all ${
              isManuscript
                ? 'bg-[var(--neu-bg-card,#FFFDF9)] border border-[var(--neu-border,rgba(184,134,11,0.28))]'
                : 'bg-slate-900/95 border border-amber-500/30 backdrop-blur-xl'
            }`}
          >
            <div
              className={`error-boundary-icon w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border transition-all ${
                isManuscript
                  ? 'bg-amber-100/80 text-amber-800 border-amber-600/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2
              className={`error-boundary-title text-xl font-notoserif font-bold mb-2 tracking-tight ${
                isManuscript ? 'text-[#78350F]' : 'text-amber-200'
              }`}
            >
              पेज लोड करने में त्रुटि हुई
            </h2>
            <p
              className={`error-boundary-desc text-xs font-gotu mb-4 leading-relaxed ${
                isManuscript ? 'text-[#78716C]' : 'text-slate-300'
              }`}
            >
              कृपया मुख्य पृष्ठ पर लौटकर पुनः प्रयास करें। समस्या बनी रहे तो हमें बताएं।
            </p>
            {this.state.error && (
              <div
                className={`error-boundary-error-box my-3 p-3.5 rounded-xl text-left overflow-auto max-h-48 custom-scrollbar border ${
                  isManuscript
                    ? 'bg-red-50/80 border-red-200/80'
                    : 'bg-red-950/60 border-red-500/30'
                }`}
              >
                <p
                  className={`error-boundary-error-text text-xs font-mono font-bold break-words mb-1 ${
                    isManuscript ? 'text-[#991B1B]' : 'text-red-300'
                  }`}
                >
                  {this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <pre
                    className={`error-boundary-stack text-[10px] font-mono whitespace-pre-wrap leading-tight ${
                      isManuscript ? 'text-[#B91C1C]/80' : 'text-red-200/60'
                    }`}
                  >
                    {this.state.error.stack.split('\n').slice(1, 4).join('\n')}
                  </pre>
                )}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleCopyError}
                className={`error-boundary-copy-btn px-4 py-2.5 rounded-xl font-medium text-xs font-gotu transition-all cursor-pointer border ${
                  isManuscript
                    ? 'bg-[var(--neu-bg-card,#FFFDF9)] hover:bg-[var(--neu-bg-sunken,#F1ECE2)] text-[#78350F] border-[var(--neu-border,rgba(184,134,11,0.28))]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/20'
                }`}
              >
                {this.state.copied ? 'कॉपी हो गया ✓' : 'त्रुटि कॉपी करें'}
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className={`error-boundary-home-btn px-5 py-2.5 rounded-xl font-bold text-sm font-gotu shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                  isManuscript
                    ? 'bg-gradient-to-r from-[#D97706] to-[#B45309] text-white focus-visible:ring-amber-600/60'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 focus-visible:ring-amber-400/80'
                }`}
              >
                मुख्य पृष्ठ (Go Home)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
