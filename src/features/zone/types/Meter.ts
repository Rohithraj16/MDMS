export type MeterStatus = "Active" | "Inactive" | "Maintenance";

export interface Meter {
  id: string;
  zone: string;
  status: MeterStatus;
  readingKwh: number;
  lastUpdated: string;
}
