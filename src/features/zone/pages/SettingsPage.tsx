import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getErrorMessage } from "../../../services/http";
import PageHeader from "../../../shared/components/PageHeader";
import {
	getZoneSettings,
	getZones,
	updateZoneSettings,
	type ZoneOption,
	type ZoneSettings,
} from "../services/zoneApi";
import "./SettingsPage.css";

interface ZoneSettingsFormProps {
	settings: ZoneSettings;
	isSaving: boolean;
	onSave: (settings: ZoneSettings) => Promise<ZoneSettings>;
}

function ZoneSettingsForm({
	settings,
	isSaving,
	onSave,
}: ZoneSettingsFormProps) {
	const [form, setForm] = useState(settings);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(false);

	function updateForm(values: Partial<ZoneSettings>) {
		setForm((current) => ({ ...current, ...values }));
		setError("");
		setSaved(false);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (
			form.highConsumptionThresholdKwh <= 0
			|| form.lowVoltageThresholdVolts <= 0
			|| form.highVoltageThresholdVolts <= form.lowVoltageThresholdVolts
		) {
			setError(
				"Thresholds must be positive, and the high voltage threshold must exceed the low voltage threshold.",
			);
			setSaved(false);
			return;
		}

		setError("");
		try {
			const updated = await onSave(form);
			setForm(updated);
			setSaved(true);
		} catch (saveError) {
			setError(getErrorMessage(saveError));
			setSaved(false);
		}
	}

	return (
		<form className="zone-settings__form" onSubmit={(event) => void handleSubmit(event)}>
			<fieldset className="zone-settings__fieldset">
				<legend>Alert thresholds</legend>
				<p className="zone-settings__help">
					Set the limits used by the zone team when reviewing meter alerts.
				</p>
				<div className="zone-settings__thresholds">
					<label className="zone-settings__field">
						<span>High daily consumption (kWh)</span>
						<input
							type="number"
							min="0.1"
							step="0.1"
							value={form.highConsumptionThresholdKwh}
							onChange={(event) =>
								updateForm({ highConsumptionThresholdKwh: Number(event.target.value) })
							}
						/>
					</label>
					<label className="zone-settings__field">
						<span>Low voltage limit (V)</span>
						<input
							type="number"
							min="1"
							step="1"
							value={form.lowVoltageThresholdVolts}
							onChange={(event) =>
								updateForm({ lowVoltageThresholdVolts: Number(event.target.value) })
							}
						/>
					</label>
					<label className="zone-settings__field">
						<span>High voltage limit (V)</span>
						<input
							type="number"
							min="1"
							step="1"
							value={form.highVoltageThresholdVolts}
							onChange={(event) =>
								updateForm({ highVoltageThresholdVolts: Number(event.target.value) })
							}
						/>
					</label>
				</div>
			</fieldset>

			<fieldset className="zone-settings__fieldset">
				<legend>Notification channels</legend>
				<p className="zone-settings__help">
					Choose which channels are enabled for alerts in this zone.
				</p>
				<div className="zone-settings__channels">
					<label className="zone-settings__toggle">
						<input
							type="checkbox"
							checked={form.emailNotificationsEnabled}
							onChange={(event) =>
								updateForm({ emailNotificationsEnabled: event.target.checked })
							}
						/>
						<span>
							<strong>Email notifications</strong>
							<small>Send alert notices by email.</small>
						</span>
					</label>
					<label className="zone-settings__toggle">
						<input
							type="checkbox"
							checked={form.smsNotificationsEnabled}
							onChange={(event) =>
								updateForm({ smsNotificationsEnabled: event.target.checked })
							}
						/>
						<span>
							<strong>SMS notifications</strong>
							<small>Send urgent alert notices by SMS.</small>
						</span>
					</label>
					<label className="zone-settings__toggle">
						<input
							type="checkbox"
							checked={form.inAppNotificationsEnabled}
							onChange={(event) =>
								updateForm({ inAppNotificationsEnabled: event.target.checked })
							}
						/>
						<span>
							<strong>In-app notifications</strong>
							<small>Show alerts in the MDMS application.</small>
						</span>
					</label>
				</div>
			</fieldset>

			{error && <p className="zone-settings__error" role="alert">{error}</p>}
			{saved && <p className="zone-settings__success" role="status">Zone settings saved.</p>}
			<button className="zone-settings__save" type="submit" disabled={isSaving}>
				{isSaving ? "Saving…" : "Save settings"}
			</button>
		</form>
	);
}

export default function SettingsPage() {
	const [zones, setZones] = useState<ZoneOption[]>([]);
	const [zonesError, setZonesError] = useState("");
	const [isLoadingZones, setIsLoadingZones] = useState(true);
	const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
	const [settingsResult, setSettingsResult] = useState<{
		zoneId: number;
		data?: ZoneSettings;
		error?: string;
	} | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		getZones(controller.signal)
			.then((items) => setZones(items))
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setZonesError(getErrorMessage(error));
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					setIsLoadingZones(false);
				}
			});
		return () => controller.abort();
	}, []);

	const zoneId = selectedZoneId ?? zones[0]?.id ?? null;

	useEffect(() => {
		if (zoneId === null) return;
		const controller = new AbortController();
		getZoneSettings(zoneId, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setSettingsResult({ zoneId, data });
				}
			})
			.catch((error: unknown) => {
				if (!controller.signal.aborted) {
					setSettingsResult({ zoneId, error: getErrorMessage(error) });
				}
			});
		return () => controller.abort();
	}, [zoneId]);

	async function saveSettings(settings: ZoneSettings): Promise<ZoneSettings> {
		setIsSaving(true);
		try {
			const updated = await updateZoneSettings(settings);
			setSettingsResult({ zoneId: updated.zoneId, data: updated });
			return updated;
		} finally {
			setIsSaving(false);
		}
	}

	const settings =
		settingsResult?.zoneId === zoneId ? (settingsResult.data ?? null) : null;
	const settingsError =
		settingsResult?.zoneId === zoneId ? (settingsResult.error ?? "") : "";

	return (
		<section className="zone-settings">
			<PageHeader
				title="Zone Settings"
				subtitle="Configure alert thresholds and notification channels for a zone."
				actions={
					<label className="zone-settings__zone-picker">
						<span>Zone</span>
						<select
							aria-label="Select settings zone"
							value={zoneId ?? ""}
							onChange={(event) => setSelectedZoneId(Number(event.target.value))}
							disabled={isLoadingZones || zones.length === 0}
						>
							{zones.map((zone) => (
								<option key={zone.id} value={zone.id}>{zone.name}</option>
							))}
						</select>
					</label>
				}
			/>

			{zonesError && <p className="zone-settings__error" role="alert">{zonesError}</p>}
			{settingsError && <p className="zone-settings__error" role="alert">{settingsError}</p>}
			{isLoadingZones || (zoneId !== null && !settings && !settingsError) ? (
				<p className="zone-settings__state" role="status">Loading zone settings…</p>
			) : settings ? (
				<ZoneSettingsForm
					key={settings.zoneId}
					settings={settings}
					isSaving={isSaving}
					onSave={saveSettings}
				/>
			) : !zonesError && !settingsError ? (
				<p className="zone-settings__state">No zones are available.</p>
			) : null}
		</section>
	);
}
