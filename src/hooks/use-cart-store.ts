import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = {
  id: string;
  artworkId: string;
  title: string;
  sizeLabel?: string;
  frameLabel?: string;
  unitPrice: number;
  quantity: number;
  /** Highest quantity purchasable for this line, based on available stock. */
  maxQuantity?: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.id === line.id);
          if (existing) {
            const max = existing.maxQuantity ?? line.maxQuantity;
            const nextQuantity = existing.quantity + line.quantity;
            return {
              lines: state.lines.map((l) =>
                l.id === line.id
                  ? {
                      ...l,
                      quantity: max ? Math.min(nextQuantity, max) : nextQuantity,
                    }
                  : l
              ),
            };
          }
          const max = line.maxQuantity;
          return {
            lines: [
              ...state.lines,
              { ...line, quantity: max ? Math.min(line.quantity, max) : line.quantity },
            ],
          };
        }),
      removeLine: (id) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.id === id
              ? { ...l, quantity: l.maxQuantity ? Math.min(quantity, l.maxQuantity) : quantity }
              : l
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}
