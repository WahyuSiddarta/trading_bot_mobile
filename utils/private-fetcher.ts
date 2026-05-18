const referralResponse = {
  code: "DATA_REFERRAL_RETRIEVED",
  elapsed: 0.002031161,
  status: "OK",
  tree: '[{"id": "stail002","label": "stail002","auxiliary": [{"level": "0"},{"activated": true },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": null},{"id": "stail004","label": "stail004","auxiliary": [{"level": "0"},{"activated": true },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": "stail002"},{"id": "stail003","label": "stail003","auxiliary": [{"level": "0"},{"activated": false },{"personal_gas": 0.00000 },{"community_gas": 0.00000 },{"community_gas_reset": 0.00000 }],"parentId": "stail002"}]',
};

const shouldMockReferralError = true;
const shouldMockTelegramLinkError = false;
const shouldMockAnnouncementsError = false;

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

export type Announcement = {
  announcement_id: string;
  title: string;
  publish: boolean;
  content: string;
  created_at: string;
};

export type AnnouncementsResponse = {
  status: "OK";
  code: string;
  data: Announcement[];
  elapsed: number;
};

const telegramLinkResponse: TelegramLinkCode = {
  status: "OK",
  code: "TELEGRAM_LINK_CODE_RETRIEVED",
  telegram_link_code: "telelink:LTbifeoi5p8eRJcRIyKTMcy7",
  telegram_link_expires_at: "2026-05-18T13:46:22.541405Z",
  elapsed: 0.002379313,
};

const announcementsResponse: AnnouncementsResponse = {
  status: "OK",
  code: "ANNOUNNCEMENT_GET",
  elapsed: 0.00198922,
  data: [
    {
      announcement_id: "019e3b7c-e512-73a9-b19b-f659493374bc",
      title: "Ramdom 1",
      publish: true,
      content:
        "&lt;p style=&quot;text-align: center;&quot;&gt;hello &lt;strong&gt;my &lt;/strong&gt;&lt;em&gt;name &lt;/em&gt;&lt;span style=&quot;text-decoration: underline;&quot;&gt;is&amp;nbsp;&lt;/span&gt; &lt;s&gt;wahyu&lt;/s&gt;&amp;nbsp; &lt;em&gt;&lt;strong&gt;tata&lt;/strong&gt;&lt;/em&gt;&lt;/p&gt;\r\n&lt;p style=&quot;text-align: center;&quot;&gt;&lt;em&gt;&lt;strong&gt;&lt;br&gt;&lt;/strong&gt;&lt;/em&gt;&lt;s&gt;&lt;strong&gt;&lt;br&gt;&lt;br&gt;&lt;/strong&gt;&lt;/s&gt;&lt;/p&gt;\r\n&lt;ol&gt;\r\n&lt;li style=&quot;text-align: left;&quot;&gt;&lt;em&gt;&lt;strong&gt;kekekek&lt;/strong&gt;&lt;/em&gt;&lt;/li&gt;\r\n&lt;li style=&quot;text-align: left;&quot;&gt;&lt;em&gt;&lt;strong&gt;asaskas&lt;br&gt;&lt;/strong&gt;&lt;/em&gt;&lt;/li&gt;\r\n&lt;/ol&gt;\r\n&lt;ul&gt;\r\n&lt;li style=&quot;text-align: left;&quot;&gt;&lt;em&gt;&lt;strong&gt;hello&lt;br&gt;😬&lt;br&gt;&lt;/strong&gt;&lt;/em&gt;&lt;/li&gt;\r\n&lt;/ul&gt;",
      created_at: "2026-05-18T14:28:24.462005Z",
    },
    {
      announcement_id: "019e3b81-d322-7132-9174-267fdc768bbe",
      title: "Engine Maintenance",
      publish: true,
      content:
        "&lt;p&gt;&lt;strong&gt;Maintenance window&lt;/strong&gt; will run tonight. Trading alerts stay active, but some account updates may be delayed.&lt;/p&gt;&lt;ul&gt;&lt;li&gt;No action needed&lt;/li&gt;&lt;li&gt;Keep your bot online&lt;/li&gt;&lt;/ul&gt;",
      created_at: "2026-05-18T10:15:11.462005Z",
    },
  ],
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

export async function fetchAnnouncements() {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (shouldMockAnnouncementsError) {
    return Promise.reject(createMockError());
  }

  return announcementsResponse.data.filter((item) => item.publish);
}
