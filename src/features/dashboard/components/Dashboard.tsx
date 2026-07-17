import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { getCoins } from "@/features/dashboard/api/coinsApi";
import type { Coin } from "@/features/dashboard/types";
import {
  COINS_PER_PAGE,
  TOTAL_PAGES,
  TOTAL_COINS,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
} from "@/features/dashboard/constants";
import { useI18n } from "@/shared/hooks/useI18n";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { cn } from "@/shared/utils/cn";
import { formatCurrency, formatCompactCurrency } from "@/shared/utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Button,
  DataError,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import {
  CoinDetailsPanel,
  CoinDetailsDialog,
} from "@/features/dashboard/components/CoinDetailsPanel";

// Matches the lg breakpoint the table/panel layout switches on below.
const PANEL_BREAKPOINT = 1024;

export default function Dashboard() {
  const { t } = useI18n();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const isMobile = useIsMobile(PANEL_BREAKPOINT);

  const {
    data: coins = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["coins", page, currency],
    queryFn: () => getCoins({ page, vsCurrency: currency }),
    refetchInterval: 10000 * 6,
  });

  const filteredCoins = useMemo(() => {
    const query = debouncedSearchText.trim().toLowerCase();
    if (!query) return coins;
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query),
    );
  }, [coins, debouncedSearchText]);

  const selectedCoin: Coin | undefined = coins.find(
    (coin) => coin.id === selectedCoinId,
  );

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    setPage(1);
    setSelectedCoinId(null);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setSelectedCoinId(null);
  };

  const rangeStart = (page - 1) * COINS_PER_PAGE + 1;
  const rangeEnd = Math.min(page * COINS_PER_PAGE, TOTAL_COINS);

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("common:dashboard.title")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("common:dashboard.description")}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      {!isError && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative min-w-[300px]">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("common:dashboard.searchPlaceholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="ltr:ps-9 rtl:pe-9"
            />
          </div>

          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="sm:ms-auto"
          >
            <RefreshCw
              className={cn("h-4 w-4 me-2", isFetching && "animate-spin")}
            />
            {t("common:refresh")}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {isError ? (
            <DataError
              title={t("settings:errors.couldntLoadData")}
              message={t("common:dashboard.errors.failedToLoad")}
              retryText={t("common:retry")}
              onRetry={() => refetch()}
            />
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="ps-6 py-4 font-medium">
                        {t("common:dashboard.table.asset")}
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium text-end">
                        {t("common:dashboard.table.price")}
                      </TableHead>
                      <TableHead className="px-6 py-4 font-medium text-end">
                        {t("common:dashboard.table.change24h")}
                      </TableHead>
                      <TableHead className="pe-6 py-4 font-medium text-end">
                        {t("common:dashboard.table.volume24h")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell className="ps-6 py-5">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[80px] ms-auto" />
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <Skeleton className="h-4 w-[60px] ms-auto" />
                          </TableCell>
                          <TableCell className="pe-6 py-5">
                            <Skeleton className="h-4 w-[100px] ms-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredCoins.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          {t("common:dashboard.noResults")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCoins.map((coin) => {
                        const isPositive =
                          (coin.price_change_percentage_24h ?? 0) >= 0;
                        const isSelected = coin.id === selectedCoinId;

                        return (
                          <TableRow
                            key={coin.id}
                            onClick={() =>
                              setSelectedCoinId(
                                isSelected ? null : coin.id,
                              )
                            }
                            data-state={isSelected ? "selected" : undefined}
                            className="cursor-pointer"
                          >
                            <TableCell className="ps-6 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={coin.image}
                                  alt={coin.name}
                                  className="size-8 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">
                                    {coin.name}
                                  </p>
                                  <p className="text-muted-foreground uppercase">
                                    {coin.symbol}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-3 text-end font-mono">
                              {formatCurrency(coin.current_price, currency)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "px-6 py-3 text-end font-mono",
                                isPositive
                                  ? "text-emerald-600 dark:text-emerald-500"
                                  : "text-red-600 dark:text-red-500",
                              )}
                            >
                              {isPositive ? "+" : ""}
                              {(coin.price_change_percentage_24h ?? 0).toFixed(
                                2,
                              )}
                              %
                            </TableCell>
                            <TableCell className="pe-6 py-3 text-end font-mono">
                              {formatCompactCurrency(coin.total_volume, currency)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t bg-muted/20">
                <div className="text-muted-foreground py-2">
                  {t("common:pagination.showing")} {rangeStart}-{rangeEnd}{" "}
                  {t("common:pagination.of")} {TOTAL_COINS}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    title={t("common:previous")}
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={isFetching}
                      >
                        {pageNumber}
                      </Button>
                    ),
                  )}
                  <Button
                    title={t("common:next")}
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === TOTAL_PAGES || isFetching}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedCoin && !isMobile && (
          <CoinDetailsPanel
            coin={selectedCoin}
            currency={currency}
            onClose={() => setSelectedCoinId(null)}
          />
        )}
      </div>

      {selectedCoin && (
        <CoinDetailsDialog
          coin={selectedCoin}
          currency={currency}
          open={isMobile}
          onOpenChange={(open) => {
            if (!open) setSelectedCoinId(null);
          }}
        />
      )}
    </div>
  );
}
