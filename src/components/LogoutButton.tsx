'use client';

import { logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.refresh();
        router.push('/');
    };

    return (
        <button onClick={handleLogout} className={`caps ${className || ''}`} style={{ fontWeight: 600, ...style }}>
            Logout
        </button>
    );
}
