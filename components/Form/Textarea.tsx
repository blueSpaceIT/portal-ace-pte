"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

import { useFormContext } from "react-hook-form";
import { TextareaProps } from "./type";

const Textarea = ({
  name,
  label,
  description,
  placeholder,
  required,
}: TextareaProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="text-xs">
          <FormLabel className="flex items-center gap-2 mb-1">
            {label}{" "}
            {required && (
              <span className="text-red-500 font-bold -ml-2">*</span>
            )}
          </FormLabel>
          <FormControl>
            <ShadcnTextarea
              className="text-xs"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-xs font-extralight" />
        </FormItem>
      )}
    />
  );
};

export default Textarea;
