"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type Comment = {
  id: string;
  content: string;
  name?: string | null;
  email?: string | null;
  createdAt: Date;
  user?: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  } | null;
  replies: Comment[];
};

type Props = {
  postId: string;
};

export default function CommentSection({ postId }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("获取评论失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments();
    setReplyingTo(null);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">加载评论中...</div>;
  }

  return (
    <div className="space-y-6 mt-12">
      <h2 className="text-2xl font-bold">评论 ({comments.length})</h2>
      
      {/* 评论表单 */}
      <CommentForm
        postId={postId}
        parentId={replyingTo}
        onSuccess={handleCommentAdded}
        onCancel={() => setReplyingTo(null)}
      />

      {/* 评论列表 */}
      <CommentList
        comments={comments}
        postId={postId}
        onReply={(id) => setReplyingTo(id)}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}

