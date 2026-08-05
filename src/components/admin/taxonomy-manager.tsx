"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taxonomySchema, type TaxonomyInput } from "@/lib/validation/taxonomy";
import {
  createTaxonomy,
  updateTaxonomy,
  deleteTaxonomy,
} from "@/server/actions/taxonomy";
import { useLocale } from "@/components/providers/locale-provider";

type Item = { id: string; name: string; nameHe: string | null; slug: string };

export function TaxonomyManager({
  kind,
  items,
}: {
  kind: "category" | "medium";
  items: Item[];
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TaxonomyInput>({
    resolver: zodResolver(taxonomySchema),
    defaultValues: { name: "", nameHe: "", slug: "" },
  });

  function startEdit(item: Item) {
    setEditingId(item.id);
    form.reset({ name: item.name, nameHe: item.nameHe ?? "", slug: item.slug });
  }

  function startNew() {
    setEditingId(null);
    form.reset({ name: "", nameHe: "", slug: "" });
  }

  async function onSubmit(values: TaxonomyInput) {
    setSubmitting(true);
    setError(null);
    try {
      const result = editingId
        ? await updateTaxonomy(kind, editingId, values)
        : await createTaxonomy(kind, values);

      if (!result.ok) {
        setError(result.error);
        return;
      }
      startNew();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t.admin.taxonomy.deleteConfirm)) return;
    const result = await deleteTaxonomy(kind, id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 rounded-sm border border-border p-6 sm:grid-cols-4"
        noValidate
      >
        <div>
          <Label htmlFor="name">{t.admin.taxonomy.name}</Label>
          <Input id="name" className="mt-2" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="nameHe">{t.admin.taxonomy.nameHe}</Label>
          <Input id="nameHe" className="mt-2" {...form.register("nameHe")} />
        </div>
        <div>
          <Label htmlFor="slug">{t.admin.taxonomy.slug}</Label>
          <Input id="slug" className="mt-2" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" className="rounded-none" disabled={submitting}>
            {editingId ? t.admin.save : t.admin.add}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={startNew}>
              {t.admin.cancel}
            </Button>
          )}
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t.admin.taxonomy.noneYet}
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
            <div className="min-w-0">
              <p className="text-sm break-words">{item.name}</p>
              <p className="text-xs break-all text-muted-foreground">/{item.slug}</p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => startEdit(item)}
              >
                {t.admin.edit}
              </button>
              <button
                type="button"
                className="text-destructive underline underline-offset-4"
                onClick={() => onDelete(item.id)}
              >
                {t.admin.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
