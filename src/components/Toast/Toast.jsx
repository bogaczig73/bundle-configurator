import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const TOAST_TYPES = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-400'
  },
  error: {
    icon: XMarkIcon,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-400'
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-400'
  }
};

export function Toast({ message, type = 'info', onClose, autoClose = true }) {
  const toastStyle = TOAST_TYPES[type];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-md p-4 ${toastStyle.bgColor} border ${toastStyle.borderColor} shadow-lg max-w-md`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <toastStyle.icon className={`h-6 w-6 ${toastStyle.iconColor}`} aria-hidden="true" />
        </div>
        <div className={`ml-3 ${toastStyle.textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${toastStyle.textColor} hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 