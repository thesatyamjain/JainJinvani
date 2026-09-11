import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Jain Jinvani:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050a14] text-white">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-500/40 text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-notoserif font-bold text-amber-200 mb-2">
              पेज लोड करने में त्रुटि हुई
            </h2>
            <p className="text-xs text-slate-300 font-gotu mb-4">
              कृपया मुख्य पृष्ठ पर लौटकर पुनः प्रयास करें। समस्या बनी रहे तो हमें बताएं।
            </p>
            {this.state.error && (
              <div className="my-3 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-left overflow-auto max-h-48 custom-scrollbar">
                <p className="text-xs text-red-300 font-mono font-bold break-words mb-1">
                  {this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-red-200/60 font-mono whitespace-pre-wrap leading-tight">
                    {this.state.error.stack.split('\n').slice(1, 4).join('\n')}
                  </pre>
                )}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm font-gotu shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              मुख्य पृष्ठ पर जाएं (Go Home)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
