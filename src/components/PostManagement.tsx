'use client';

import { deletePost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function PostManagement({ postId, textColor }: { postId: string, textColor: string }) {
    const router = useRouter();

    async function handleDelete() {
        if (confirm('Are you sure you want to delete this column? This action cannot be undone.')) {
            const result = await deletePost(postId);
            if (result.success) {
                router.push('/');
                router.refresh();
            } else {
                alert(result.error || 'Failed to delete post');
            }
        }
    }

    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '2rem',
            justifyContent: 'center'
        }}>
            <Link href={`/p/${postId}/edit`} className="caps" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: textColor,
                opacity: 0.6,
                textDecoration: 'none'
            }}>
                <Edit size={14} />
                <span>Edit Story</span>
            </Link>

            <button onClick={handleDelete} className="caps" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#c41e3a',
                opacity: 0.6
            }}>
                <Trash2 size={14} />
                <span>Delete Permanent</span>
            </button>
        </div>
    );
}
