import { useQuery } from "@tanstack/react-query";

import { fetchApiKeys } from "@/api/api-keys";
import {
  fetchAnnouncements,
  fetchTelegramLinkCode,
  fetchReferralUsers,
  type Announcement,
  type AuxiliaryValue,
  type ReferralNode,
  type TelegramLinkCode,
} from "@/utils/private-fetcher";

export type { Announcement, AuxiliaryValue, ReferralNode, TelegramLinkCode };

export function useReferralQuery() {
  return useQuery({
    queryKey: ["referral-users"],
    queryFn: fetchReferralUsers,
  });
}

export function useTelegramLinkCodeQuery() {
  return useQuery({
    queryKey: ["telegram-link-code"],
    queryFn: fetchTelegramLinkCode,
  });
}

export function useAnnouncementsQuery() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });
}

export function useApiKeysQuery() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: fetchApiKeys,
  });
}
