"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SelectProps } from "./type";
import { Badge } from "@/components/ui/badge";

export function MultipleSelect({
  name,
  label,
  description,
  options,
  placeholder = "Select options",
}: SelectProps) {
  const { control, setValue, watch } = useFormContext();
  const selectedValues: string[] = watch(name) || [];

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setValue(name, newValues, { shouldValidate: true });
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== value);
    setValue(name, newValues, { shouldValidate: true });
  };

  const getSelectedLabels = () => {
    return selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">{label}</FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-auto min-h-10 text-left font-normal",
                    !selectedValues.length && "text-muted-foreground"
                  )}
                >
                  <div className="flex flex-wrap gap-1 flex-1">
                    {selectedValues.length > 0 ? (
                      getSelectedLabels().map((label) => (
                        <Badge
                          key={label}
                          variant="secondary"
                          className="mr-1 px-2 py-1 text-xs"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={(e) => {
                              const value = options.find(
                                (opt) => opt.label === label
                              )?.value;
                              if (value) handleRemove(value, e);
                            }}
                            className="ml-1 hover:bg-muted rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <div className="max-h-64 overflow-y-auto">
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleToggle(option.value)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleToggle(option.value);
                        }
                      }}
                      className={cn(
                        "flex w-full items-center px-4 py-2.5 text-sm cursor-pointer transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:bg-accent focus:text-accent-foreground",
                        isSelected && "bg-accent/50 font-medium"
                      )}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected && (
                        <svg
                          className="h-4 w-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
