import http from "../../../services/http";
import type { Meter } from "../types/Meter";

export async function getMeters(signal?: AbortSignal): Promise<Meter[]> {
  const response = await http.get<Meter[]>("/api/meters", { signal });
  return response.data;
}
