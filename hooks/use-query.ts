import { useQuery } from "@tanstack/react-query";

import {
  fetchTelegramLinkCode,
  fetchReferralUsers,
  type AuxiliaryValue,
  type ReferralNode,
  type TelegramLinkCode,
} from "@/utils/private-fetcher";

export type { AuxiliaryValue, ReferralNode, TelegramLinkCode };

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
