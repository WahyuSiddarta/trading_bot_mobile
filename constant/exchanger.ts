import binance from "@/assets/icon/brands/binance.png";
import bybit from "@/assets/icon/brands/bybit.png";
import type { ImageSourcePropType } from "react-native";

export interface Exchanger {
  exchanger_id: number;
  name: string;
  logo_url: ImageSourcePropType;
}

export const exchanger_master_data: Exchanger[] = [
  {
    exchanger_id: 1,
    name: "Binance",
    logo_url: binance,
  },
  {
    exchanger_id: 2,
    name: "Bybit",
    logo_url: bybit,
  },
];
