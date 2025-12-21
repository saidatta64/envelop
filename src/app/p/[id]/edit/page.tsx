import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import EditPostForm from './EditPostForm';

async function getPost(id: string) {
    await dbConnect();
    try {
        const post = await Post.findById(id).lean();
        if (!post) return null;
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        return null;
    }
}

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = (await getSession()) as any;
    const post = await getPost(params.id);

    if (!post) {
        notFound();
    }

    if (!session || session.userId !== post.author) {
        redirect(`/p/${params.id}`);
    }

    return <EditPostForm post={post} />;
}
