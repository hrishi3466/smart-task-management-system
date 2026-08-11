import { useState, useCallback } from 'react';
import { commentApi } from '../api/commentApi';
import { parseApiError } from '../api/client';

/**
 * Custom hook for task comments (REST-only)
 */
export const useComments = (taskId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async (tid = taskId) => {
    if (!tid) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentApi.getComments(tid);
      setComments(data || []);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  const addComment = async (content) => {
    if (!taskId) return;
    try {
      const newComment = await commentApi.createComment(taskId, content);
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err) {
      throw err;
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const updated = await commentApi.updateComment(commentId, content);
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      throw err;
    }
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  };
};
