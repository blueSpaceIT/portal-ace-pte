/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BaseInputProps } from "./type";

interface SingleImageUploaderProps extends BaseInputProps {
  defaultImage?: string;
  className?: string;
  setImageFile?: React.Dispatch<React.SetStateAction<File | null>>;
}

export function SingleImageUploader({
  name,
  label = "Upload profile photo",
  description,
  defaultImage,
  className,
  setImageFile,
}: SingleImageUploaderProps) {
  const { control, setValue } = useFormContext();
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultImage || null
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (defaultImage) {
      setImagePreview(defaultImage);
      setFile(null);
    }
  }, [defaultImage]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile?.(selectedFile);
      onChange(selectedFile);
      setValue(name, selectedFile, { shouldValidate: true });
    }
    event.target.value = "";
  };

  const handleRemoveImage = (onChange: (value: File | null) => void) => {
    setFile(null);
    setImagePreview(null);
    setImageFile?.(null);
    onChange(null);
    setValue(name, null, { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className={className}>
          <div className="flex items-center gap-4">
            {/* Circular Profile Preview */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 cursor-pointer  rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover w-24 h-24 border rounded-full"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleRemoveImage(onChange)}
                      className="absolute -top-1 -right-1 w-6 h-6 p-0 rounded-full bg-red-500 hover:bg-red-600 z-10"
                    >
                      <X className="w-3 h-3 text-white cursor-pointer" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div>
              <Input
                id={`${name}-upload`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, onChange)}
                value=""
                {...field}
              />
              <FormControl>
                <label
                  htmlFor={`${name}-upload`}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              </FormControl>
            </div>
          </div>

          {description && (
            <FormDescription className="mt-2">{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
