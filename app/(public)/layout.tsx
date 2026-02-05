export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex-1 p-6 bg-[#E9E9E9] h-screen">{children}</main>;
}
