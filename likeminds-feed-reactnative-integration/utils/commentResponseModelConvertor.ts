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
  comment.replies = repliesArray?.length > 0 ? repliesArray : [];
  return comment;
};

export function mergeReplies(obj1, obj2) {
  // Ensure both objects and their comments exist
  const comment1 = obj1?.comment;
  const comment2 = obj2?.comment;

  // If comment IDs don't match, return obj1 unchanged (or handle as needed)
  if (!comment1 || !comment2 || comment1.id !== comment2.id) {
    return obj2;
  }

  // Clone obj1 to avoid mutating it
  const merged = JSON.parse(JSON.stringify(obj1));

  const replies1 = comment1.replies ?? [];
  const replies2 = comment2.replies ?? [];

  // Deduplicate replies by reply.id
  const deduplicatedReplies = [
    ...new Map(
      [...replies1, ...replies2].map(reply => [reply.id, reply])
    ).values()
  ];

  // Sort by abs(Number(tempId)) in ascending order
  deduplicatedReplies.sort((a, b) => {
    const aTime = Math.abs(Number(a.tempId));
    const bTime = Math.abs(Number(b.tempId));
    return bTime - aTime;
  });

  merged.comment.replies = deduplicatedReplies;

  return merged;
}



