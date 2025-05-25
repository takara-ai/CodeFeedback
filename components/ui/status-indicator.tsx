import {
  getStatusIndicatorClasses,
  StatusIndicatorProps,
} from "@/lib/ui-utils";

export function StatusIndicator({
  status,
  size = "sm",
  className,
}: StatusIndicatorProps) {
  return (
    <div className={getStatusIndicatorClasses({ status, size, className })} />
  );
}
