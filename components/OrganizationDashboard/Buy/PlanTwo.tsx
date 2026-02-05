"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Form from "../../Form/Form";
import { SingleSelect } from "../../Form/SingleSelect";
import { TextInput } from "../../Form/TextInput";

const formSchema = z.object({
  selectRange: z.string().min(1, "Please select a range"),
  selectPlan: z.string().min(1, "Please select a plan"),
  numberOfAccounts: z.number().min(1, "Please enter number of accounts"),
});

const PlanTwo = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectRange: "",
      selectPlan: "",
      numberOfAccounts: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const rangeOptions = [
    { value: "5-25", label: "05 to 25 Accounts" },
    { value: "26-50", label: "26 to 50 Accounts" },
    { value: "51-100", label: "51 to 100 Accounts" },
  ];

  const planOptions = [
    { value: "30days", label: "30-days" },
    { value: "60days", label: "60-days" },
    { value: "90days", label: "90-days" },
    { value: "180days", label: "180-days" },
    { value: "365days", label: "365-days" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">
        Unlimited Practice Questions + Limited Full & Sectional Mock Tests Each
      </h2>
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-6">
          {/* Select Range */}
          <SingleSelect
            name="selectRange"
            label="Select Range"
            placeholder="Select a range"
            options={rangeOptions}
            required
          />

          {/* Select Plan and Number of Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SingleSelect
              name="selectPlan"
              label="Select Plan"
              placeholder="Select a plan"
              options={planOptions}
              required
            />
            <TextInput
              name="numberOfAccounts"
              label="Number of Accounts"
              placeholder="Enter number"
              type="number"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <p className="font-medium text-sm mb-1">Notes:</p>
            <p className="text-sm text-muted-foreground">
              For a fully branded white-label option, please get in touch with
              our support by clicking{" "}
              <a href="#" className="text-blue-600 hover:underline">
                here
              </a>
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PlanTwo;
