import NavBar from "@/components/common/NavBar/NavBar";
import Sidebar from "@/components/common/SideBar/Sidebar";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          <NavBar />
          <main className="flex-1 p-6 bg-[#E9E9E9]">{children}</main>
        </div>
      </div>
    </>
  );
}
