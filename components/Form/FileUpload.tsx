import { useFormContext } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  name: string;
  label: string;
  accept?: string;
  placeholder?: string;
  description?: string;
  existingFile?: string | null;
  required?: boolean;
}

export const FileUpload = ({
  name,
  label,
  accept = "audio/*",
  placeholder,
  description,
  existingFile,
  required,
}: FileUploadProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setValue(name, null, { shouldValidate: true });
    setFileName("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 font-bold ">*</span>}
      </label>

      <div className="flex items-center gap-2">
        <input
          id={`${name}-file-upload`}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor={`${name}-file-upload`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            {fileName || placeholder || "Choose file"}
          </span>
        </label>

        {fileName && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>

      {fileName && (
        <p className="text-xs text-gray-500">Selected: {fileName}</p>
      )}

      {!fileName && existingFile && (
        <p className="text-xs text-blue-600">
          Current file available (will keep if no new file uploaded)
        </p>
      )}

      {description && <p className="text-xs text-gray-500">{description}</p>}

      {errors[name] && (
        <p className="text-red-500 text-xs">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
