/**
 * Label component from the shadcn/ui design system.
 * This component provides accessible labels for form controls and other UI elements.
 *
 * @module components/ui/label
 */
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * A label component that can be associated with form controls.
 * Provides proper accessibility attributes and styling consistent with the design system.
 *
 * @param props - Standard React props for the label element
 * @returns JSX element containing the styled label
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
