import apiClient from "./client";
import type {
  ScanPayload,
  ScanSuccessResponse,
  Ticket,
} from "@/types";

// Scanner endpoints use a different auth header than JWT
// We pass the API key directly as a parameter
export const scannerApi = {
  scan: async (
    payload: ScanPayload,
    apiKey: string
  ): Promise<ScanSuccessResponse> => {
    const { data } = await apiClient.post<ScanSuccessResponse>(
      "/tickets/scan",
      payload,
      { headers: { "X-Scanner-Key": apiKey } }
    );
    return data;
  },

  lookup: async (code: string, apiKey: string): Promise<Ticket> => {
    const { data } = await apiClient.get<{ ticket: Ticket }>(
      `/tickets/${code}`,
      { headers: { "X-Scanner-Key": apiKey } }
    );
    return data.ticket;
  },
};