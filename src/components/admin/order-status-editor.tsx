"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus, updateOrderTracking } from "@/server/actions/order-admin";
import { useLocale } from "@/components/providers/locale-provider";

const statuses = [
  "PENDING",
  "PAID",
  "PREPARING",
  "PRINTED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export function OrderStatusEditor({
  orderId,
  initialStatus,
  initialTrackingNumber,
  initialTrackingUrl,
}: {
  orderId: string;
  initialStatus: string;
  initialTrackingNumber: string;
  initialTrackingUrl: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [status, setStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);

  async function onStatusChange(next: string) {
    setStatus(next);
    setSavingStatus(true);
    setError(null);
    const result = await updateOrderStatus(orderId, next);
    setSavingStatus(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function onSaveTracking() {
    setSavingTracking(true);
    setError(null);
    const result = await updateOrderTracking(orderId, trackingNumber, trackingUrl);
    setSavingTracking(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-sm border border-border p-6">
      <div>
        <Label htmlFor="status">{t.admin.orders.orderStatus}</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status" className="mt-2 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {t.orderStatus[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {savingStatus && <p className="mt-1 text-xs text-muted-foreground">{t.admin.saving}</p>}
      </div>

      <div>
        <Label htmlFor="trackingNumber">{t.admin.orders.trackingNumber}</Label>
        <Input
          id="trackingNumber"
          className="mt-2"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="trackingUrl">{t.admin.orders.trackingUrl}</Label>
        <Input
          id="trackingUrl"
          className="mt-2"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="rounded-none"
        disabled={savingTracking}
        onClick={onSaveTracking}
      >
        {savingTracking ? t.admin.saving : t.admin.orders.saveTracking}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
