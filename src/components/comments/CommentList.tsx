"use client";

import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
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

function CommentItem({ comment, postId, onReply, onCommentAdded }: { comment: Comment; postId: string; onReply: (id: string) => void; onCommentAdded: () => void }) {
  const displayName = comment.user?.name || comment.user?.username || comment.name || "匿名用户";
  const displayImage = comment.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <img
          src={displayImage}
          alt={displayName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{displayName}</span>
            {comment.user && (
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                已登录
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: zhCN })}
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </div>
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs text-brand hover:underline"
          >
            回复
          </button>
        </div>
      </div>

      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={reply.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user?.name || reply.name || "匿名")}`}
                  alt={reply.user?.name || reply.name || "匿名"}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{reply.user?.name || reply.user?.username || reply.name || "匿名用户"}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: zhCN })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {reply.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

