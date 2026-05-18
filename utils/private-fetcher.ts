const referralResponse = {
  code: "DATA_REFERRAL_RETRIEVED",
  elapsed: 0.002031161,
  status: "OK",
  tree: '[{"id": "stail002","label": "stail002","auxiliary": [{"level": "0"},{"activated": true },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": null},{"id": "stail004","label": "stail004","auxiliary": [{"level": "0"},{"activated": true },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": "stail002"},{"id": "stail003","label": "stail003","auxiliary": [{"level": "0"},{"activated": false },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": "stail002"}]',
};

const shouldMockReferralError = true;
const shouldMockTelegramLinkError = false;

export type AuxiliaryValue = string | number | boolean;

export type PrivateFetcherError = {
  code: string;
  status: "ERROR";
};

export type ReferralNode = {
  id: string;
  label: string;
  auxiliary: Record<string, AuxiliaryValue>[];
  parentId: string | null;
};

export type TelegramLinkCode = {
  status: "OK";
  code: string;
  telegram_link_code: string;
  telegram_link_expires_at: string;
  elapsed: number;
};

const telegramLinkResponse: TelegramLinkCode = {
  status: "OK",
  code: "TELEGRAM_LINK_CODE_RETRIEVED",
  telegram_link_code: "telelink:LTbifeoi5p8eRJcRIyKTMcy7",
  telegram_link_expires_at: "2026-05-18T13:46:22.541405Z",
  elapsed: 0.002379313,
};

function getMockReferralUsers() {
  const referralTree = JSON.parse(referralResponse.tree) as ReferralNode[];

  return referralTree.filter((node) => node.parentId !== null);
}

function createMockError(): PrivateFetcherError {
  return {
    code: "QWERTY",
    status: "ERROR",
  };
}

export async function fetchReferralUsers() {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (shouldMockReferralError) {
    return Promise.reject(createMockError());
  }

  return getMockReferralUsers();
}

export async function fetchTelegramLinkCode() {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (shouldMockTelegramLinkError) {
    return Promise.reject(createMockError());
  }

  return telegramLinkResponse;
}
