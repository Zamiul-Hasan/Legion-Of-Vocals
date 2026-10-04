import React from "react";
import { AlertTriangle, RefreshCw, Home, LogOut } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[LOV React Crash Caught by ErrorBoundary]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleClearAndReset = () => {
    try {
      localStorage.removeItem("lov_current_user_v2");
      localStorage.removeItem("lov_current_user");
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-red-500/30 p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-5">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We encountered an unexpected display issue while rendering this section. You can reload the page or return to the Legion of Vocals home.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left overflow-x-auto text-xs text-red-300/80 font-mono max-h-32">
                {String(this.state.error.message || this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 text-gray-300 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={16} />
                Return Home
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={this.handleClearAndReset}
                className="text-xs text-gray-500 hover:text-red-400 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={13} />
                Reset Session & Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
