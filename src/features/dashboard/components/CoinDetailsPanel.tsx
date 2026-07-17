import { useI18n } from "@/shared/hooks/useI18n";
import { formatDateTime } from "@/shared/utils/formatDate";
import {
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui";
import type { Coin } from "@/features/dashboard/types";
import { cn } from "@/shared/utils/cn";

interface CoinDetailsProps {
  coin: Coin;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

function CoinDetailsHeader({ coin }: CoinDetailsProps) {
  return (
    <div className="flex items-center gap-3">
      <img src={coin.image} alt={coin.name} className="size-10 shrink-0" />
      <div className="min-w-0">
        <p className="truncate font-semibold">{coin.name}</p>
        <p className="text-muted-foreground uppercase">{coin.symbol}</p>
      </div>
    </div>
  );
}

function CoinDetailsBody({ coin }: CoinDetailsProps) {
  const { t } = useI18n();
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground">
          {t("common:dashboard.details.price")}
        </p>
        <p className="font-mono text-xl font-semibold">
          {formatUsd(coin.current_price)}
        </p>
        <p
          className={cn(
            "font-mono",
            isPositive
              ? "text-emerald-600 dark:text-emerald-500"
              : "text-red-600 dark:text-red-500",
          )}
        >
          {isPositive ? "+" : ""}
          {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted-foreground">
            {t("common:dashboard.details.high24h")}
          </p>
          <p className="font-mono">{formatUsd(coin.high_24h)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">
            {t("common:dashboard.details.low24h")}
          </p>
          <p className="font-mono">{formatUsd(coin.low_24h)}</p>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground">
          {t("common:dashboard.details.volume24h")}
        </p>
        <p className="font-mono">{formatUsd(coin.total_volume)}</p>
      </div>

      <div>
        <p className="text-muted-foreground">
          {t("common:dashboard.details.lastUpdated")}
        </p>
        <p>{formatDateTime(coin.last_updated)}</p>
      </div>
    </div>
  );
}

export function CoinDetailsPanel({ coin }: CoinDetailsProps) {
  return (
    <Card className="hidden lg:flex lg:w-[320px] lg:shrink-0 lg:sticky lg:top-20 lg:self-start lg:min-h-[250px]  flex-col">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <CoinDetailsHeader coin={coin} />
      </CardHeader>
      <CardContent className="pt-0">
        <CoinDetailsBody coin={coin} />
      </CardContent>
    </Card>
  );
}

interface CoinDetailsDialogProps extends CoinDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Mobile: the same details shown as a modal instead of a side panel. */
export function CoinDetailsDialog({
  coin,
  open,
  onOpenChange,
}: CoinDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-0 sm:max-w-lg">
        <DialogTitle className="sr-only">
          {coin.name} ({coin.symbol})
        </DialogTitle>
        <div className="mb-2">
          <CoinDetailsHeader coin={coin} />
        </div>
        <CoinDetailsBody coin={coin} />
      </DialogContent>
    </Dialog>
  );
}
