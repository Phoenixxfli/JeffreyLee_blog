"use client";

import CommentItem from "./CommentItem";

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
  comments: Comment[];
  postId: string;
  onReply: (id: string) => void;
  onCommentAdded: () => void;
};

export default function CommentList({ comments, postId, onReply, onCommentAdded }: Props) {
  if (comments.length === 0) {
    return <div className="text-sm text-gray-500">暂无评论，快来抢沙发吧！</div>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onReply={onReply}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
}

