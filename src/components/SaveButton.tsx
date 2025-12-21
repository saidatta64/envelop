'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleSavePost } from '@/app/actions/bookmarks';
import { toast } from 'sonner';

export default function SaveButton({ postId, initialIsSaved }: { postId: string, initialIsSaved: boolean }) {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic update
        const newState = !isSaved;
        setIsSaved(newState);

        const result = await toggleSavePost(postId);

        if (result.error) {
            // Revert on error
            setIsSaved(!newState);
            toast.error(result.error);
        } else {
            toast.success(newState ? 'Post saved to reading list' : 'Post removed from reading list');
        }

        setIsLoading(false);
    }

    return (
        <button
            onClick={handleToggle}
            className="btn-outline"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                backgroundColor: isSaved ? 'var(--foreground)' : 'transparent',
                color: isSaved ? 'var(--background)' : 'inherit',
                borderColor: 'var(--foreground)',
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
            }}
            disabled={isLoading}
            title={isSaved ? "Remove from Reading List" : "Add to Reading List"}
        >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            <span className="caps" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {isSaved ? 'Saved' : 'Save'}
            </span>
        </button>
    );
}
