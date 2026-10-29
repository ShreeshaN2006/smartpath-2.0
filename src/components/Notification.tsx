import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface NotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <aside
      id="notification-container"
      aria-label="System notifications"
      className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />,
          danger: <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />,
        };

        const borderClasses = {
          success: 'border-[#22C55E]/40 bg-[#111827]/95',
          warning: 'border-[#F59E0B]/40 bg-[#111827]/95',
          danger: 'border-[#EF4444]/40 bg-[#111827]/95',
          info: 'border-[#38BDF8]/40 bg-[#111827]/95',
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
              borderClasses[toast.type]
            }`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#F8FAFC]">{toast.title}</h4>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};

