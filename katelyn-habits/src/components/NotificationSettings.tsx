import { useState } from 'react';
import type { NotificationSettings as NS } from '../types';

interface Props {
  settings: NS;
  onChange: (s: Partial<NS>) => void;
  onRequestPermission: () => Promise<boolean>;
}

export function NotificationSettings({ settings, onChange, onRequestPermission }: Props) {
  const [open, setOpen] = useState(false);
  const [permDenied, setPermDenied] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'denied',
  );

  async function handleToggle() {
    if (!settings.enabled) {
      const granted = await onRequestPermission();
      if (!granted) {
        setPermDenied(true);
        return;
      }
    }
    onChange({ enabled: !settings.enabled });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔔</span>
          <div>
            <p className="text-sm font-medium text-gray-800">Reminders</p>
            <p className="text-xs text-gray-400">
              {settings.enabled ? 'Notifications on' : 'Notifications off'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle */}
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              settings.enabled ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onClick={e => { e.stopPropagation(); handleToggle(); }}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm mt-1 transition-transform ${
                settings.enabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-gray-400 text-sm">{open ? '▴' : '▾'}</span>
        </div>
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-4 border-t border-gray-50">
          {permDenied && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              Notifications are blocked in your browser settings. Allow them for this site to enable reminders.
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Water reminders
            </p>
            <div className="grid grid-cols-2 gap-2">
              {settings.waterReminders.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={t}
                    onChange={e => {
                      const next = [...settings.waterReminders];
                      next[i] = e.target.value;
                      onChange({ waterReminders: next });
                    }}
                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => {
                      const next = settings.waterReminders.filter((_, j) => j !== i);
                      onChange({ waterReminders: next });
                    }}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onChange({ waterReminders: [...settings.waterReminders, '09:00'] })}
              className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              + Add reminder
            </button>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Movement reminder
            </p>
            <input
              type="time"
              value={settings.movementReminder}
              onChange={e => onChange({ movementReminder: e.target.value })}
              className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
