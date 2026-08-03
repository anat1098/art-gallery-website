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
];

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
        <Label htmlFor="status">Order Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status" className="mt-2 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {savingStatus && <p className="mt-1 text-xs text-muted-foreground">Saving…</p>}
      </div>

      <div>
        <Label htmlFor="trackingNumber">Tracking Number</Label>
        <Input
          id="trackingNumber"
          className="mt-2"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="trackingUrl">Tracking URL</Label>
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
        {savingTracking ? "Saving…" : "Save Tracking Info"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
