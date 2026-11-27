
import { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import "./SettingsPage.css";

type Settings = {
  dataRetention: string;
  autoLogout: string;
  auditRetention: string;
  timezone: string;
  language: string;
  currency: string;
  emailNotifications: boolean;
  criticalAlerts: boolean;
  weeklyReports: boolean;
};

const initialSettings: Settings = {
  dataRetention: "365",
  autoLogout: "30",
  auditRetention: "365",
  timezone: "Asia/Kolkata",
  language: "en",
  currency: "INR",
  emailNotifications: true,
  criticalAlerts: true,
  weeklyReports: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [savedMessage, setSavedMessage] = useState("");

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
    setSavedMessage("");
  };

  const handleSave = () => {
    if (
      Number(settings.dataRetention) < 30 ||
      Number(settings.auditRetention) < 30
    ) {
      setSavedMessage("Retention periods must be at least 30 days.");
      return;
    }

    if (!settings.autoLogout) {
      setSavedMessage("Please select an auto-logout duration.");
      return;
    }

    setSavedMessage(
      "Settings validated successfully. Changes are currently local and have not been saved to the server."
    );
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSavedMessage("Settings have been reset to their default values.");
  };

  return (
    <div className="enterprise-settings-page">
      <PageHeader
        title="Enterprise Settings"
        subtitle="Configure platform policies, security, localization and notification preferences."
      />

      <div className="settings-intro">
        <div className="settings-intro-icon">⚙</div>
        <div>
          <h2>Platform Configuration</h2>
          <p>
            Manage the default configuration applied across your enterprise.
          </p>
        </div>
        <span className="settings-mode-label">Configuration</span>
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="settings-card">
            <div className="settings-section-heading">
              <span className="settings-section-icon retention-icon">◷</span>
              <div>
                <h2>Data Retention</h2>
                <p>Define how long platform data should be retained.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="data-retention">Data retention period</label>
                <select
                  id="data-retention"
                  value={settings.dataRetention}
                  onChange={(event) =>
                    updateSetting("dataRetention", event.target.value)
                  }
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                </select>
                <small>Proposed retention period for operational data.</small>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-heading">
              <span className="settings-section-icon security-icon">⌑</span>
              <div>
                <h2>Security Policies</h2>
                <p>Configure session security preferences.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="auto-logout">Automatic logout</label>
                <select
                  id="auto-logout"
                  value={settings.autoLogout}
                  onChange={(event) =>
                    updateSetting("autoLogout", event.target.value)
                  }
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
                <small>
                  Proposed inactivity duration before a user is logged out.
                </small>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-heading">
              <span className="settings-section-icon audit-icon">▤</span>
              <div>
                <h2>Audit Log Configuration</h2>
                <p>Set the retention period for audit activity records.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="audit-retention">
                  Audit log retention period
                </label>
                <select
                  id="audit-retention"
                  value={settings.auditRetention}
                  onChange={(event) =>
                    updateSetting("auditRetention", event.target.value)
                  }
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                </select>
                <small>
                  Proposed duration for keeping audit records.
                </small>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-heading">
              <span className="settings-section-icon localization-icon">◎</span>
              <div>
                <h2>Localization</h2>
                <p>Set the default regional preferences for the platform.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(event) =>
                    updateSetting("timezone", event.target.value)
                  }
                >
                  <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Dubai">Gulf Standard Time</option>
                  <option value="Europe/London">UK Time</option>
                </select>
              </div>

              <div className="settings-field">
                <label htmlFor="language">Default language</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(event) =>
                    updateSetting("language", event.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                </select>
              </div>

              <div className="settings-field">
                <label htmlFor="currency">Default currency</label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(event) =>
                    updateSetting("currency", event.target.value)
                  }
                >
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-heading">
              <span className="settings-section-icon notification-icon">♧</span>
              <div>
                <h2>Notification Preferences</h2>
                <p>Choose which platform notifications are enabled by default.</p>
              </div>
            </div>

            <div className="settings-options">
              <label className="settings-option">
                <span>
                  <strong>Email notifications</strong>
                  <small>Receive platform updates through email.</small>
                </span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(event) =>
                    updateSetting("emailNotifications", event.target.checked)
                  }
                />
              </label>

              <label className="settings-option">
                <span>
                  <strong>Critical alert notifications</strong>
                  <small>Notify administrators about critical meter alerts.</small>
                </span>
                <input
                  type="checkbox"
                  checked={settings.criticalAlerts}
                  onChange={(event) =>
                    updateSetting("criticalAlerts", event.target.checked)
                  }
                />
              </label>

              <label className="settings-option">
                <span>
                  <strong>Weekly reports</strong>
                  <small>Enable scheduled weekly consumption summaries.</small>
                </span>
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(event) =>
                    updateSetting("weeklyReports", event.target.checked)
                  }
                />
              </label>
            </div>
          </section>

          {savedMessage && (
            <div
              className={`settings-feedback ${
                savedMessage.startsWith("Settings validated")
                  ? "settings-feedback-success"
                  : "settings-feedback-info"
              }`}
              role="status"
            >
              {savedMessage}
            </div>
          )}

          <div className="settings-actions">
            <button
              type="button"
              className="settings-reset-button"
              onClick={handleReset}
            >
              Reset to Defaults
            </button>

            <button
              type="button"
              className="settings-save-button"
              onClick={handleSave}
            >
              Save Configuration
            </button>
          </div>
        </div>

        <aside className="settings-sidebar">
          <div className="settings-info-card">
            <span className="settings-info-icon">ⓘ</span>
            <h3>Configuration Information</h3>
            <p>
              These settings represent enterprise-wide defaults. In a
              production environment, changes should be validated and
              persisted through the backend.
            </p>
          </div>

          <div className="settings-summary-card">
            <h3>Current Configuration</h3>
            <div>
  <span>Timezone</span>
  <strong>{settings.timezone}</strong>
</div>
<div>
  <span>Currency</span>
  <strong>{settings.currency}</strong>
</div>
<div>
  <span>Language</span>
  <strong>
    {settings.language === "en"
      ? "English"
      : settings.language === "hi"
        ? "Hindi"
        : "Telugu"}
  </strong>
</div>
            <div>
              <span>Currency</span>
              <strong>{settings.currency}</strong>
            </div>
            <div>
              <span>Language</span>
              <strong>English</strong>
            </div>
            <div>
              <span>Audit retention</span>
              <strong>{settings.auditRetention} days</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
