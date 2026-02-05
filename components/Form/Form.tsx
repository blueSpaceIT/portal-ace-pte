/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode } from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface IFromProps {
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  form: UseFormReturn<any>;
}

const Form = ({ children, onSubmit, form }: IFromProps) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;


