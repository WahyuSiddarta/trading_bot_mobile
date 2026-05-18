import { exchanger_master_data } from "@/constant/exchanger";

export function getExchanger(exchangerId: number) {
  return exchanger_master_data.find(
    (item) => item.exchanger_id === exchangerId,
  );
}
