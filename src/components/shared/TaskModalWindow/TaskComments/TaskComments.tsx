import { useState } from "react";
import { useComments } from "../../../../hooks/useComments";
import { useAuth } from "../../../../hooks/useAuth";

import type { Comment } from "../../../../types/comments.type";

import { toError } from "../../../../utils/errors";
import { formatDateTime } from "../../../../utils/date";

import Loader from "../../Loader/Loader";
import ProfileIcon from "../../ProfileIcon/ProfileIcon";
import ErrorModalWindow from "../../ErrorModalWindow/ErrorModalWindow";

import deleteIcon from "../../../../assets/delete.svg";
import sendIcon from "../../../../assets/send.svg";

import s from "../TaskModalWindow.module.css";

interface TaskCommentsProps {
  taskId: string;
  onError: (error: Error) => void;
}

function TaskComments({ taskId, onError }: TaskCommentsProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const {
    data,
    isLoading,
    error,
    createComment,
    isCreating,
    deleteComment,
    isDeleting,
  } = useComments(taskId);

  const handleCreateComment = async () => {
    if (!user?.id) {
      onError(new Error("You must be logged in to create a comment."));
      return;
    }

    try {
      await createComment({
        task_id: taskId,
        user_id: user.id,
        content: comment,
      });
      setComment("");
    } catch (commentError: unknown) {
      onError(toError(commentError, "Failed to create comment"));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (commentError: unknown) {
      onError(toError(commentError, "Failed to delete comment"));
    }
  };

  return (
    <div className={s.container}>
      <h3 className={s.label}>COMMENTS</h3>

      {error && <ErrorModalWindow error={error} />}

      <div className={s.commentsDiv}>
        <div className={s.commentScroll}>
          {isLoading ? (
            <Loader />
          ) : data.length > 0 ? (
            data.map((currentComment: Comment) => (
              <div key={currentComment.id} className={s.comment}>
                <div>
                  <ProfileIcon
                    name={currentComment.profile?.name ?? "Unknown user"}
                    avatarUrl={currentComment.profile?.avatar_url ?? null}
                  />
                </div>
                <div className={s.commentTextContainer}>
                  <div className={s.commentText}>
                    <div className={s.commentInfoContainer}>
                      <p className={s.commentInfo}>
                        {currentComment.profile?.name ?? "Unknown user"}
                      </p>
                      <p className={s.dateInfo}>
                        {formatDateTime(currentComment.created_at)}
                      </p>
                    </div>

                    <div className={s.commentContent}>
                      <p>{currentComment.content}</p>
                      {user?.id === currentComment.user_id && (
                        <button
                          className={s.deleteButton}
                          type="button"
                          onClick={() => handleDeleteComment(currentComment.id)}
                          disabled={isDeleting}
                        >
                          <img src={deleteIcon} alt="Delete comment" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={s.noComments}>No comments yet.</p>
          )}
        </div>

        <div className={s.commentInput}>
          <textarea
            className={s.input}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Write a comment"
          />

          <button
            className={s.sendButton}
            type="button"
            onClick={handleCreateComment}
            disabled={comment.trim() === "" || isCreating}
          >
            <img className={s.sendImage} src={sendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskComments;
