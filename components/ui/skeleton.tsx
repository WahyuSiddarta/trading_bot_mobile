import { cn } from "@/lib/utils";
import { EaseView } from "react-native-ease";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof EaseView>) {
  return (
    <EaseView
      className={cn("bg-accent rounded-md", className)}
      initialAnimate={{ opacity: 0.45 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "timing",
        duration: 900,
        easing: "easeInOut",
        loop: "reverse",
      }}
      {...props}
    />
  );
}

export { Skeleton };
