import { useQuery } from "@tanstack/react-query";

import {
  fetchReferralUsers,
  type AuxiliaryValue,
  type ReferralNode,
} from "@/utils/private-fetcher";

export type { AuxiliaryValue, ReferralNode };

export function useReferralQuery() {
  return useQuery({
    queryKey: ["referral-users"],
    queryFn: fetchReferralUsers,
  });
}
