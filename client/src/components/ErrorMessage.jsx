import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  message = 'Something went wrong while loading data.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-50/60 border border-rose-200/80 rounded-2xl max-w-md mx-auto my-6 animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-900 mb-1">Error Encountered</h4>
      <p className="text-sm text-rose-700 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline text-rose-800 border-rose-300 hover:bg-rose-100/50">
          <RefreshCw className="w-4 h-4 mr-1.5" /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
