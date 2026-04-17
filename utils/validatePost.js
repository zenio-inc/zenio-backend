export const validatePost = (data) => {
  const errors = [];

  const title = data.title?.trim();
  const content = data.content?.trim();
  const postType = data.postType;

  if (!title) {
    errors.push({
      field: "title",
      code: "TITLE_REQUIRED",
      message: "Title is required"
    });
  }

  if (!content) {
    errors.push({
      field: "content",
      code: "CONTENT_REQUIRED",
      message: "Content is required"
    });
  }

  const allowedTypes = ["text", "image", "link", "repost"];

  if (!postType) {
    errors.push({
      field: "postType",
      code: "POST_TYPE_REQUIRED",
      message: "Post type is required"
    });
  } else if (!allowedTypes.includes(postType)) {
    errors.push({
      field: "postType",
      code: "INVALID_POST_TYPE",
      message: "Invalid post type"
    });
  }

  return errors;
};