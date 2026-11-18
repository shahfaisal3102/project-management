import api from "../../../services/api";
import type { ApiResponse } from "../../../types/api.types";

export interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
}

export const dashboardService = {
  async getHealth(): Promise<HealthStatus> {
    const response = await api.get<ApiResponse<never>>("/health");

    return {
      success: response.data.success,
      message: response.data.message,
      timestamp: response.data.timestamp ?? "",
    };
  },
};