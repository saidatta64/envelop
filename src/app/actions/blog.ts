'use server';

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to post' };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const backgroundColor = formData.get('backgroundColor') as string;
  const fontFamily = formData.get('fontFamily') as string;
  const textColor = formData.get('textColor') as string;

  if (!title || !content) {
    return { error: 'Title and content are required' };
  }

  await dbConnect();

  try {
    await Post.create({
      title,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
      author: (session as { userId: string }).userId,
      isAnonymous: false, // Changed to show username as requested
      style: {
        backgroundColor: backgroundColor || '#ffffff',
        fontFamily: fontFamily || 'serif',
        textColor: textColor || '#000000',
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to create post' };
  }
}

export async function getPosts() {
  try {
    await dbConnect();
    // Ensure User model is registered for population
    // This handles a common Next.js issue where models aren't registered yet
    if (!User) {
      console.log('User model not loaded');
    }
    
    // Populate the author field and select only the username
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'author', model: User, select: 'username' })
      .lean();
    
    // Convert Mongo object IDs to strings for Next.js components
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Database error in getPosts:", error);
    return [];
  }
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await dbConnect();
  try {
    const post = await Post.findById(postId);
    if (!post) return { error: 'Post not found' };
    
    if (post.author.toString() !== (session as { userId: string }).userId) {
      return { error: 'Unauthorized' };
    }

    await Post.findByIdAndDelete(postId);
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to delete post' };
  }
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const backgroundColor = formData.get('backgroundColor') as string;
  const fontFamily = formData.get('fontFamily') as string;
  const textColor = formData.get('textColor') as string;

  await dbConnect();
  try {
    const post = await Post.findById(postId);
    if (!post) return { error: 'Post not found' };
    
    if (post.author.toString() !== (session as { userId: string }).userId) {
      return { error: 'Unauthorized' };
    }

    await Post.findByIdAndUpdate(postId, {
      title,
      content,
      excerpt: content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
      style: {
        backgroundColor,
        fontFamily,
        textColor,
      }
    });

    revalidatePath(`/p/${postId}`);
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to update post' };
  }
}
