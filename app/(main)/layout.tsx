import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="px-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <SidebarTrigger className="border border-green-50 hover:bg-green-50 shadow-sm shadow-accents/20 cursor-pointer rounded-md p-2"/>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
