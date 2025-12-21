'use server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleSavePost(postId: string) {
    const session = await getSession();
    if (!session) {
        return { error: 'Must be logged in to save posts' };
    }

    await dbConnect();

    try {
        const userId = (session as any).userId;
        const user = await User.findById(userId);
        
        // Robust ID check
        const isSaved = user?.savedPosts?.some((id: any) => id.toString() === postId);

        if (isSaved) {
            await User.findByIdAndUpdate(userId, {
                $pull: { savedPosts: postId }
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { savedPosts: postId }
            });
        }

        revalidatePath(`/p/${postId}`);
        return { success: true, isSaved: !isSaved };
    } catch (error) {
        console.error('Save post error:', error);
        return { error: 'Failed to update saved posts' };
    }
}

export async function getSavedPosts() {
    const session = await getSession();
    if (!session) {
        return [];
    }

    await dbConnect();
    
    try {
        const userId = (session as any).userId;
        
        // Debug: Check raw user data first
        const rawUser = await User.findById(userId).lean();
        console.log('Raw user savedPosts:', rawUser?.savedPosts);

        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            strictPopulate: false,
            populate: { path: 'author', select: 'username' }
        }).lean();

        if (!user || !user.savedPosts) {
            console.log('No saved posts found for user (populated)');
            return [];
        }
        
        console.log('Populated savedPosts length:', user.savedPosts.length);

        // Filter out any null posts
        const validPosts = user.savedPosts.filter((post: any) => post && post._id);
        
        console.log('Valid posts to return:', validPosts.length);

        // Return the populated posts
        return JSON.parse(JSON.stringify(validPosts.reverse()));
    } catch (error) {
        console.error('Get saved posts error:', error);
        return [];
    }
}

export async function checkIsSaved(postId: string) {
    const session = await getSession();
    if (!session) {
        return false;
    }

    await dbConnect();

    try {
        const user = await User.findById((session as any).userId);
        if (!user || !user.savedPosts) return false;
        
        return user.savedPosts.some((id: any) => id.toString() === postId);
    } catch (error) {
        return false;
    }
}
