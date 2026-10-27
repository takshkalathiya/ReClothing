import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Try adjusting your search filters or check back later.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/60 border border-dashed border-border rounded-2xl animate-fade-in max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-muted-600 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLink && actionText && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}

      {onAction && actionText && !actionLink && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
