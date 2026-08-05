"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/components/providers/locale-provider";

export function ProductInfoTabs({
  careInfo,
  returnsPolicy,
  shipping,
  about,
}: {
  careInfo: string;
  returnsPolicy: string;
  shipping: string;
  about: string;
}) {
  const { t } = useLocale();

  const sections = [
    { value: "care", title: t.artwork.careInfoTitle, body: careInfo },
    { value: "returns", title: t.artwork.returnsTitle, body: returnsPolicy },
    { value: "shipping", title: t.artwork.shippingTitle, body: shipping },
    { value: "about", title: t.artwork.aboutTitle, body: about },
  ];

  return (
    <Accordion type="single" collapsible className="mt-10 border-t border-border">
      {sections.map((section) => (
        <AccordionItem key={section.value} value={section.value}>
          <AccordionTrigger className="py-4 text-sm font-medium tracking-wide uppercase">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>{section.body}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
