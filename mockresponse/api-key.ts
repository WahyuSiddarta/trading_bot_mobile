export type ApiKeyItem = {
  exchanger_id: number;
  user_id: string;
  api_key: string;
  api_name: string;
  enabled: boolean;
};

export type ApiServerItem = {
  exchanger_id: number;
  ip_addr: string;
};

export type ApiKeyResponse = {
  code: string;
  data: ApiKeyItem[];
  elapsed: number;
  len: number;
  server: ApiServerItem[];
  status: string;
};

export const apiKeyMock: ApiKeyResponse = {
  code: "DATA_API_RETRIEVED",
  data: [
    {
      exchanger_id: 1,
      user_id: "faf0df75-4c9a-48db-ab17-6c509cf5735b",
      api_key:
        "RODc0fZueLkK82Q1XvTDxaqOHHyV73LEdkQloQqc42YZTBvJCH1Ajk4w3hFFgHc5",
      api_name: "BINANCE",
      enabled: true,
    },
  ],
  elapsed: 0.003624728,
  len: 1,
  server: [
    {
      exchanger_id: 1,
      ip_addr: "167.172.72.180",
    },
  ],
  status: "OK",
};

export async function fetchApiKeysMock() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return apiKeyMock;
}
