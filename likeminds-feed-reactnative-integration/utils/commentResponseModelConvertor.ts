export const commentResponseModelConvertor = (response) => {
  // Destructure the comment object for easy access
  const { comment, users } = response;

  // Overwrite Id with id
  //comment.id = comment.Id;
  //delete comment.Id;

  // Uplift user data from users object to comment
  comment.user = users[comment.uuid];

  // Assuming each reply is an object, you can now create an array of objects for replies
  const repliesArray = comment.replies.map((reply) => {
    // Process each reply object if needed
    reply.user = users[reply.uuid];
    return reply;
  });

  // Modify the comment object to include the replies array
  comment.replies = repliesArray;
  return comment;
};
