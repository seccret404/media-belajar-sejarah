import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    History,
    LayoutDashboard,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import guru from '@/routes/guru';
import siswa from '@/routes/siswa';
import type { Auth, NavItem } from '@/types';

const guruNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Kelola Kuis',
        href: guru.modul.index(),
        icon: ClipboardList,
    },
    {
        title: 'Riwayat Kuis',
        href: guru.riwayat.index(),
        icon: History,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Modul',
        href: siswa.modul.index(),
        icon: BookOpen,
    },
    {
        title: 'Riwayat',
        href: siswa.riwayat.index(),
        icon: History,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const mainNavItems =
        auth.user.role === 'guru' ? guruNavItems : siswaNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
