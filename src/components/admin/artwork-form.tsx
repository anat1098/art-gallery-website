"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { artworkSchema, type ArtworkInput } from "@/lib/validation/artwork";
import { createArtwork, updateArtwork } from "@/server/actions/artwork";
import { useLocale } from "@/components/providers/locale-provider";

type Option = { id: string; name: string };

export function ArtworkForm({
  artworkId,
  categories,
  mediums,
  defaultValues,
}: {
  artworkId?: string;
  categories: Option[];
  mediums: Option[];
  defaultValues?: Partial<ArtworkInput>;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const f = t.admin.artworkForm;
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ArtworkInput>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      type: "PRINT",
      title: "",
      titleHe: "",
      slug: "",
      description: "",
      materials: "",
      categoryId: undefined,
      mediumId: undefined,
      isFeatured: false,
      isNewArrival: false,
      isPublished: false,
      isSold: false,
      inventory: 1,
      printSizes: [],
      frameOptions: [],
      ...defaultValues,
    },
  });

  const type = form.watch("type");
  const sizesArray = useFieldArray({ control: form.control, name: "printSizes" });
  const framesArray = useFieldArray({ control: form.control, name: "frameOptions" });

  async function onSubmit(values: ArtworkInput) {
    setSubmitting(true);
    setError(null);
    try {
      const result = artworkId
        ? await updateArtwork(artworkId, values)
        : await createArtwork(values);

      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/artworks");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-8" noValidate>
      <div>
        <Label htmlFor="type">{f.type}</Label>
        <Select
          value={form.watch("type")}
          onValueChange={(v) => form.setValue("type", v as "PRINT" | "ORIGINAL")}
        >
          <SelectTrigger id="type" className="mt-2 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRINT">{f.print}</SelectItem>
            <SelectItem value="ORIGINAL">{f.original}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">{f.title}</Label>
          <Input id="title" className="mt-2" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="titleHe">{f.titleHe}</Label>
          <Input id="titleHe" className="mt-2" dir="rtl" {...form.register("titleHe")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="slug">{f.slug}</Label>
          <Input id="slug" className="mt-2" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.slug.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">{f.description}</Label>
          <Textarea id="description" rows={4} className="mt-2" {...form.register("description")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="materials">{f.materials}</Label>
          <Input id="materials" className="mt-2" {...form.register("materials")} />
        </div>

        <div>
          <Label htmlFor="categoryId">{f.category}</Label>
          {categories.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {f.noCategoriesYet}{" "}
              <Link href="/admin/categories" className="underline underline-offset-4">
                {f.addOneFirst}
              </Link>
              .
            </p>
          ) : (
            <Select
              value={form.watch("categoryId") ?? ""}
              onValueChange={(v) => form.setValue("categoryId", v)}
            >
              <SelectTrigger id="categoryId" className="mt-2 w-full rounded-none">
                <SelectValue placeholder={f.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label htmlFor="mediumId">{f.medium}</Label>
          {mediums.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {f.noMediumsYet}{" "}
              <Link href="/admin/mediums" className="underline underline-offset-4">
                {f.addOneFirst}
              </Link>
              .
            </p>
          ) : (
            <Select
              value={form.watch("mediumId") ?? ""}
              onValueChange={(v) => form.setValue("mediumId", v)}
            >
              <SelectTrigger id="mediumId" className="mt-2 w-full rounded-none">
                <SelectValue placeholder={f.selectMedium} />
              </SelectTrigger>
              <SelectContent>
                {mediums.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isPublished")} />
          {t.admin.artworks.published}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isFeatured")} />
          {t.admin.artworks.featured}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isNewArrival")} />
          {t.admin.artworks.newArrival}
        </label>
      </div>

      {type === "ORIGINAL" && (
        <div className="space-y-4 rounded-sm border border-border p-4 sm:p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {f.originalDetails}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="originalPrice">{f.price}</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                className="mt-2"
                {...form.register("originalPrice", { valueAsNumber: true })}
              />
              {form.formState.errors.originalPrice && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.originalPrice.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="yearCreated">{f.yearCreated}</Label>
              <Input
                id="yearCreated"
                type="number"
                className="mt-2"
                {...form.register("yearCreated", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="originalWidthCm">{f.widthCm}</Label>
              <Input
                id="originalWidthCm"
                type="number"
                step="0.1"
                className="mt-2"
                {...form.register("originalWidthCm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="originalHeightCm">{f.heightCm}</Label>
              <Input
                id="originalHeightCm"
                type="number"
                step="0.1"
                className="mt-2"
                {...form.register("originalHeightCm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="inventory">{f.availableQuantity}</Label>
              <Input
                id="inventory"
                type="number"
                min={0}
                className="mt-2"
                {...form.register("inventory", { valueAsNumber: true })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {f.availableQuantityHint}
              </p>
              {form.formState.errors.inventory && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.inventory.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingTimeNote">{f.shippingNote}</Label>
              <Input id="shippingTimeNote" className="mt-2" {...form.register("shippingTimeNote")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("isSold")} />
            {f.sold}
          </label>
        </div>
      )}

      {type === "PRINT" && (
        <div className="space-y-6">
          <div className="rounded-sm border border-border p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {f.printSizes}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={() =>
                  sizesArray.append({
                    label: "",
                    widthCm: 0,
                    heightCm: 0,
                    price: 0,
                    inventory: 0,
                  })
                }
              >
                <Plus className="mr-1 size-4" /> {f.addSize}
              </Button>
            </div>
            {form.formState.errors.printSizes?.message && (
              <p className="mt-2 text-xs text-destructive">
                {form.formState.errors.printSizes.message}
              </p>
            )}
            <div className="mt-4 space-y-4">
              {sizesArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 items-end gap-2 border-b border-border pb-4 sm:grid-cols-5 sm:border-none sm:pb-0"
                >
                  <Input
                    placeholder={f.sizeLabelPlaceholder}
                    className="col-span-2 sm:col-span-1"
                    {...form.register(`printSizes.${index}.label`)}
                  />
                  <Input
                    type="number"
                    placeholder={f.widthPlaceholder}
                    step="0.1"
                    {...form.register(`printSizes.${index}.widthCm`, { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder={f.heightPlaceholder}
                    step="0.1"
                    {...form.register(`printSizes.${index}.heightCm`, { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder={f.pricePlaceholder}
                    step="0.01"
                    {...form.register(`printSizes.${index}.price`, { valueAsNumber: true })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={f.inventoryPlaceholder}
                      {...form.register(`printSizes.${index}.inventory`, { valueAsNumber: true })}
                    />
                    <button
                      type="button"
                      onClick={() => sizesArray.remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={f.removeSize}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {f.frameOptions}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={() => framesArray.append({ label: "", priceDelta: 0, isDefault: false })}
              >
                <Plus className="mr-1 size-4" /> {f.addFrame}
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {framesArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-2 items-end gap-2 border-b border-border pb-4 sm:grid-cols-4 sm:border-none sm:pb-0"
                >
                  <Input
                    placeholder={f.framePlaceholder}
                    className="col-span-2 sm:col-span-1"
                    {...form.register(`frameOptions.${index}.label`)}
                  />
                  <Input
                    type="number"
                    placeholder={f.priceAddOnPlaceholder}
                    step="0.01"
                    {...form.register(`frameOptions.${index}.priceDelta`, { valueAsNumber: true })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...form.register(`frameOptions.${index}.isDefault`)} />
                    {f.default}
                  </label>
                  <button
                    type="button"
                    onClick={() => framesArray.remove(index)}
                    className="justify-self-start text-muted-foreground hover:text-destructive"
                    aria-label={f.removeFrame}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-dashed border-border p-4 text-sm text-muted-foreground sm:p-6">
        {t.admin.artworks.imageUploadNote}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full rounded-none sm:w-auto" disabled={submitting}>
        {submitting ? t.admin.saving : artworkId ? f.saveChanges : f.createArtwork}
      </Button>
    </form>
  );
}
