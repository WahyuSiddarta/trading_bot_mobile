import Svg, { Path } from "react-native-svg";

type TelegramIconProps = {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

export function TelegramIcon({ color = "#38BDF8", size = 24 }: TelegramIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M21.72 3.54c.25-.95-.66-1.75-1.56-1.38L2.9 9.2c-1.05.43-1 1.94.08 2.3l4.4 1.47 1.7 5.35c.31.96 1.52 1.28 2.26.6l2.44-2.25 4.47 3.3c.82.6 1.99.14 2.25-.84L21.72 3.54ZM8.05 11.92l8.6-5.3c.27-.17.55.2.32.42l-7.1 6.7-.28 3.02-1.16-3.66a1.72 1.72 0 0 0-.38-.68Zm2.6 4.77.16-1.77 1.45 1.07-1.61 1.5v-.8Z"
        fill={color}
      />
    </Svg>
  );
}
