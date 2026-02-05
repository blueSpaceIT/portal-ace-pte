/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { loginUser } from "@/lib/auth";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { loginUser } from "@/service/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await loginUser(values.email, values.password);
      console.log("🚀 ~ onSubmit ~ res:", res);
      toast.success(res.message);
      // Check for organizationId and store in localStorage
      const organizationId = res?.data?.user?.organizationId;
      if (organizationId) {
        localStorage.setItem("organizationId", organizationId);
      }

      // ✅ Redirect after login (example: dashboard)
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text- mb-6">Sign In</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <span className="text-sm text-gray-600">Remember me</span>
                </FormItem>
              )}
            />
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-secondary underline cursor-pointer hover:text-primary"
            >
              Forgot Password?
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ED4961] cursor-pointer hover:bg-[#d93e55] text-white"
          >
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}
