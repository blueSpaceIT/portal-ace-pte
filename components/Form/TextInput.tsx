"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TextInputProps } from "./type";

export function TextInput({
  name,
  label,
  description,
  placeholder,
  type,
  disabled = false,
  required,
}: TextInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center">
            {label}
            {required && (
              <span className="text-red-500 font-bold -ml-2">*</span>
            )}
          </FormLabel>
          <FormControl>
            <Input
              className="text-xs"
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              // ✅ Add onChange handler to convert string to number
              onChange={(e) => {
                if (type === "number") {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                } else {
                  field.onChange(e.target.value);
                }
              }}
              // ✅ Convert number to string for display
              value={
                type === "number" && field.value ? field.value : field.value
              }
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-xs font-extralight" />
        </FormItem>
      )}
    />
  );
}
