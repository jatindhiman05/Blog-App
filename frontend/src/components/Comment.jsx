import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import axios from "axios";
import {
  deleteCommentAndReply,
  setCommentLikes,
  setComments,
  setReplies,
  setUpdatedComments,
} from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  X,
  MoreVertical,
  ThumbsUp,
  ThumbsUpIcon,
  MessageCircle,
  Edit,
  Trash2
} from "lucide-react";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [currentEditComment, setCurrentEditComment] = useState(null);

  const {
    _id: blogId,
    comments,
    creator: { _id: creatorId },
  } = useSelector((state) => state.selectedBlog);

  const { token, id: userId } = useSelector((state) => state.user);

  async function handleComment() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${blogId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      dispatch(setComments(res.data.newComment));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="bg-white h-screen p-5 fixed top-0 right-0 w-[350px] border-l drop-shadow-xl overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
        <h1 className="text-xl font-semibold">
          Comments ({comments.length})
        </h1>
        <button
          onClick={() => dispatch(setIsOpen(false))}
          className="text-gray-700 hover:text-red-500 p-1 rounded-full transition duration-200"
          aria-label="Close comment sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <div className="my-4">
        <textarea
          value={comment}
          placeholder="Comment..."
          className="h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-7 py-3 my-2 rounded-md shadow-md"
        >
          Add
        </button>
      </div>

      <div className="mt-4">
        <DisplayComments
          comments={comments}
          userId={userId}
          blogId={blogId}
          token={token}
          activeReply={activeReply}
          setActiveReply={setActiveReply}
          currentPopup={currentPopup}
          setCurrentPopup={setCurrentPopup}
          currentEditComment={currentEditComment}
          setCurrentEditComment={setCurrentEditComment}
          creatorId={creatorId}
        />
      </div>
    </div>
  );
}

function DisplayComments({
  comments,
  userId,
  blogId,
  token,
  setActiveReply,
  activeReply,
  currentPopup,
  setCurrentPopup,
  currentEditComment,
  setCurrentEditComment,
  creatorId,
}) {
  const [reply, setReply] = useState("");
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const dispatch = useDispatch();

  async function handleReply(parentCommentId) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${parentCommentId}/${blogId}`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReply("");
      setActiveReply(null);
      dispatch(setReplies(res.data.newReply));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleCommentLike(commentId) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like-comment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      dispatch(setCommentLikes({ commentId, userId }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  async function handleCommentUpdate(id) {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/edit-comment/${id}`,
        { updatedCommentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      dispatch(setUpdatedComments(res.data.updatedComment));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
    }
  }

  async function handleCommentDelete(id) {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      dispatch(deleteCommentAndReply(id));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
    }
  }

  return (
    <>
      {comments.map((comment) => (
        <div key={comment._id}>
          <hr className="my-2" />
          <div className="flex flex-col gap-2 my-4">
            {currentEditComment === comment._id ? (
              <div className="my-4">
                <textarea
                  defaultValue={comment.comment}
                  placeholder="Edit comment..."
                  className="h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                  onChange={(e) => setUpdatedCommentContent(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentEditComment(null)}
                    className="bg-red-500 px-7 py-3 my-2 rounded-3xl text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCommentUpdate(comment._id)}
                    className="bg-green-500 px-7 py-3 my-2 rounded-3xl text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex w-full justify-between">
                  <Link to={`/@${comment.user.username}`} className="flex gap-2">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 aspect-square rounded-full overflow-hidden">
                        <img
                          src={
                            comment?.user?.profilePic
                              ? comment?.user?.profilePic
                              : `https://api.dicebear.com/9.x/initials/svg?seed=${comment?.user?.name}`
                          }
                          alt="profile"
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="capitalize font-medium">{comment?.user?.name}</p>
                        <p>{formatDate(comment?.createdAt)}</p>
                      </div>
                    </div>
                  </Link>

                  {(comment?.user?._id === userId || userId === creatorId) &&
                    (currentPopup === comment._id ? (
                      <div className="bg-gray-100 w-[120px] rounded-md relative p-2 text-sm shadow">
                        <button
                          onClick={() => setCurrentPopup(null)}
                          className="absolute top-1 right-1 text-gray-700 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>

                        {comment.user._id === userId && (
                          <button
                            className="flex items-center gap-2 p-2 hover:bg-blue-100 w-full text-left"
                            onClick={() => {
                              setCurrentEditComment(comment._id);
                              setCurrentPopup(null);
                            }}
                          >
                            <Edit size={16} /> Edit
                          </button>
                        )}
                        <button
                          className="flex items-center gap-2 p-2 hover:bg-blue-100 w-full text-left"
                          onClick={() => {
                            handleCommentDelete(comment._id);
                            setCurrentPopup(null);
                          }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCurrentPopup(comment._id)}
                        className="text-gray-600 hover:text-black"
                      >
                        <MoreVertical size={20} />
                      </button>
                    ))}
                </div>

                <p className="font-medium text-lg">{comment.comment}</p>

                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div
                      className="cursor-pointer flex gap-2 items-center"
                      onClick={() => handleCommentLike(comment._id)}
                    >
                      {comment.likes.includes(userId) ? (
                        <ThumbsUp className="text-blue-600" size={20} fill="currentColor" />
                      ) : (
                        <ThumbsUpIcon className="text-gray-500" size={20} />
                      )}
                      <p className="text-lg">{comment.likes.length}</p>
                    </div>

                    <div
                      className="flex gap-2 items-center cursor-pointer"
                      onClick={() => handleActiveReply(comment._id)}
                    >
                      <MessageCircle className="text-gray-500" size={20} />
                      <p className="text-lg">{comment.replies.length}</p>
                    </div>
                  </div>
                </div>

                {activeReply === comment._id && (
                  <div className="my-4">
                    <textarea
                      value={reply}
                      placeholder="Write your reply..."
                      className="h-[100px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                      onClick={() => handleReply(comment._id)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-7 py-3 my-2 rounded-md shadow-md"
                    >
                      Reply
                    </button>
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <div className="pl-6 border-l border-gray-300 ml-2 mt-2">
                    <DisplayComments
                      comments={comment.replies}
                      userId={userId}
                      blogId={blogId}
                      token={token}
                      activeReply={activeReply}
                      setActiveReply={setActiveReply}
                      currentPopup={currentPopup}
                      setCurrentPopup={setCurrentPopup}
                      currentEditComment={currentEditComment}
                      setCurrentEditComment={setCurrentEditComment}
                      creatorId={creatorId}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default Comment;
