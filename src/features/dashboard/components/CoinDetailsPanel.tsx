import { X } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";
import { formatDateTime } from "@/shared/utils/formatDate";
import { formatCurrency, formatCompactCurrency } from "@/shared/utils/formatCurrency";
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
  currency: string;
}

function CoinDetailsHeader({ coin }: { coin: Coin }) {
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

function CoinDetailsBody({ coin, currency }: CoinDetailsProps) {
  const { t } = useI18n();
  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground">
          {t("common:dashboard.details.price")}
        </p>
        <p className="font-mono text-xl font-semibold">
          {formatCurrency(coin.current_price, currency)}
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
          <p className="font-mono">{formatCurrency(coin.high_24h, currency)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">
            {t("common:dashboard.details.low24h")}
          </p>
          <p className="font-mono">{formatCurrency(coin.low_24h, currency)}</p>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground">
          {t("common:dashboard.details.volume24h")}
        </p>
        <p className="font-mono">
          {formatCompactCurrency(coin.total_volume, currency)}
        </p>
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

interface CoinDetailsPanelProps extends CoinDetailsProps {
  onClose: () => void;
}

export function CoinDetailsPanel({ coin, currency, onClose }: CoinDetailsPanelProps) {
  const { t } = useI18n();

  return (
    <Card className="relative hidden lg:flex lg:w-[320px] lg:shrink-0 lg:sticky lg:top-20 lg:self-start lg:min-h-[250px] flex-col">
      <button
        type="button"
        onClick={onClose}
        className="absolute end-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">{t("common:close")}</span>
      </button>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <CoinDetailsHeader coin={coin} />
      </CardHeader>
      <CardContent className="pt-0">
        <CoinDetailsBody coin={coin} currency={currency} />
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
  currency,
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
        <CoinDetailsBody coin={coin} currency={currency} />
      </DialogContent>
    </Dialog>
  );
}
