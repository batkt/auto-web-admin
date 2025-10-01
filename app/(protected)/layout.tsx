import { AppSidebar } from '@/components/app-sidebar';
import HeaderBreadcrumb from '@/components/header-breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AuthProvider from '@/contexts/auth-context';
import { ACCESS_TOKEN_KEY, getCookie, USER_KEY } from '@/lib/cookie';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
    const user = await getCookie(USER_KEY);

    if (!user) {
        redirect('/');
    }
    const token = await getCookie(ACCESS_TOKEN_KEY);

    return (
        <AuthProvider user={user} token={token}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                            <HeaderBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
};

export default ProtectedLayout;
