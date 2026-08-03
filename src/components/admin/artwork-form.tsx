"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
        <Label htmlFor="type">Type</Label>
        <Select
          value={form.watch("type")}
          onValueChange={(v) => form.setValue("type", v as "PRINT" | "ORIGINAL")}
        >
          <SelectTrigger id="type" className="mt-2 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRINT">Print</SelectItem>
            <SelectItem value="ORIGINAL">Original</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" className="mt-2" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="titleHe">Title (Hebrew)</Label>
          <Input id="titleHe" className="mt-2" {...form.register("titleHe")} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" className="mt-2" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} className="mt-2" {...form.register("description")} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="materials">Materials</Label>
          <Input id="materials" className="mt-2" {...form.register("materials")} />
        </div>

        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select
            value={form.watch("categoryId") ?? ""}
            onValueChange={(v) => form.setValue("categoryId", v)}
          >
            <SelectTrigger id="categoryId" className="mt-2 w-full rounded-none">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mediumId">Medium</Label>
          <Select
            value={form.watch("mediumId") ?? ""}
            onValueChange={(v) => form.setValue("mediumId", v)}
          >
            <SelectTrigger id="mediumId" className="mt-2 w-full rounded-none">
              <SelectValue placeholder="Select a medium" />
            </SelectTrigger>
            <SelectContent>
              {mediums.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isPublished")} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isFeatured")} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("isNewArrival")} />
          New Arrival
        </label>
      </div>

      {type === "ORIGINAL" && (
        <div className="space-y-4 rounded-sm border border-border p-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Original Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="originalPrice">Price</Label>
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
              <Label htmlFor="yearCreated">Year Created</Label>
              <Input
                id="yearCreated"
                type="number"
                className="mt-2"
                {...form.register("yearCreated", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="originalWidthCm">Width (cm)</Label>
              <Input
                id="originalWidthCm"
                type="number"
                step="0.1"
                className="mt-2"
                {...form.register("originalWidthCm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="originalHeightCm">Height (cm)</Label>
              <Input
                id="originalHeightCm"
                type="number"
                step="0.1"
                className="mt-2"
                {...form.register("originalHeightCm", { valueAsNumber: true })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="shippingTimeNote">Shipping Note</Label>
              <Input
                id="shippingTimeNote"
                className="mt-2"
                {...form.register("shippingTimeNote")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("isSold")} />
            Sold
          </label>
        </div>
      )}

      {type === "PRINT" && (
        <div className="space-y-6">
          <div className="rounded-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Print Sizes
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
                <Plus className="mr-1 size-4" /> Add Size
              </Button>
            </div>
            {form.formState.errors.printSizes?.message && (
              <p className="mt-2 text-xs text-destructive">
                {form.formState.errors.printSizes.message}
              </p>
            )}
            <div className="mt-4 space-y-3">
              {sizesArray.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-5 items-end gap-2">
                  <Input
                    placeholder="Label (A4)"
                    {...form.register(`printSizes.${index}.label`)}
                  />
                  <Input
                    type="number"
                    placeholder="Width cm"
                    step="0.1"
                    {...form.register(`printSizes.${index}.widthCm`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Height cm"
                    step="0.1"
                    {...form.register(`printSizes.${index}.heightCm`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    {...form.register(`printSizes.${index}.price`, {
                      valueAsNumber: true,
                    })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Inventory"
                      {...form.register(`printSizes.${index}.inventory`, {
                        valueAsNumber: true,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => sizesArray.remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove size"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Frame Options
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={() =>
                  framesArray.append({ label: "", priceDelta: 0, isDefault: false })
                }
              >
                <Plus className="mr-1 size-4" /> Add Frame
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {framesArray.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 items-end gap-2">
                  <Input
                    placeholder="Label (No Frame)"
                    {...form.register(`frameOptions.${index}.label`)}
                  />
                  <Input
                    type="number"
                    placeholder="Price add-on"
                    step="0.01"
                    {...form.register(`frameOptions.${index}.priceDelta`, {
                      valueAsNumber: true,
                    })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      {...form.register(`frameOptions.${index}.isDefault`)}
                    />
                    Default
                  </label>
                  <button
                    type="button"
                    onClick={() => framesArray.remove(index)}
                    className="justify-self-start text-muted-foreground hover:text-destructive"
                    aria-label="Remove frame option"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-dashed border-border p-6 text-sm text-muted-foreground">
        Image upload isn&apos;t connected yet — add an UploadThing token to{" "}
        <code>.env</code> to enable drag-and-drop image management here.
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="rounded-none" disabled={submitting}>
        {submitting ? "Saving…" : artworkId ? "Save Changes" : "Create Artwork"}
      </Button>
    </form>
  );
}
