import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { BaseInputProps } from "./type";

interface SingleSelectProps extends BaseInputProps {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export function SingleSelect({
  name,
  label,
  description,
  placeholder = "Select an option",
  options = [],
  onChange,
  disabled = false,
  required,
}: SingleSelectProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {/* {required ? <span className="text-red-500">*</span> : null} */}
            </FormLabel>
          )}
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={`w-full ${
                  disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
