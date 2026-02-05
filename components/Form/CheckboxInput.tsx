"use client";
import { useFormContext } from "react-hook-form";
import { CheckboxProps } from "./type";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CheckboxInput({
  name,
  label,
  description,
  options,
}: CheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {options && options.length > 0 ? (
            // Multiple checkboxes
            <div className="space-y-3">
              {label && (
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  {label}
                </FormLabel>
              )}
              {options.map((option) => (
                <FormField
                  key={option.value}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={
                            Array.isArray(field.value) &&
                            field.value.includes(option.value)
                          }
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), option.value]
                              : field.value.filter(
                                  (v: string) => v !== option.value,
                                );
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          ) : (
            // Single checkbox - ✅ Label and checkbox in flex row
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                {label || description || "Enable"}
              </FormLabel>
            </div>
          )}
          {description && (
            <FormDescription className="text-xs text-muted-foreground mt-2">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs font-extralight text-destructive" />
        </FormItem>
      )}
    />
  );
}
