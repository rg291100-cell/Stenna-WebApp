import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
                    <h1 className="text-2xl font-serif mb-4">Something went wrong.</h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        We apologize for the inconvenience. The application encountered an unexpected error.
                    </p>
                    <div className="bg-gray-100 p-4 rounded text-left overflow-auto max-w-2xl w-full mb-8 font-mono text-xs">
                        <p className="text-red-500 font-bold mb-2">{this.state.error?.toString()}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:opacity-80"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
