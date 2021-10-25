// Import Settings
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Import Redux
import { useDispatch, useSelector } from "react-redux";
import { handleDeletePost, handleGetUserPosts } from "../../actions/post";

// Import Components
import EditPostDialog from "../../components/EditPostDialog/EditPostDialog.js";

// Import Material-ui
import { Button, Grid, Typography } from "@material-ui/core";

// Import FontAwesome
import { faComment, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import CSS
import styles from "./UserPosts.module.css";

function UserPosts(props) {
  const { posts, topic } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const postDeleted = useSelector((state) => state.post.deletePostSuccess);
  const postEdited = useSelector((state) => state.post.editPostSuccess);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState("");

  const onClickDeletePost = (postId) => {
    dispatch(handleDeletePost(postId));
  };

  const handleDialogOpen = (post) => {
    setEditPost(post);
    setDialogOpen(true);
  };

  useEffect(() => {
    dispatch(handleGetUserPosts(topic, history));
  }, [postDeleted, postEdited]);

  return (
    <Grid container direction="column">
      {posts ? (
        posts.map((post) => (
          <Grid
            container
            key={post._id}
            className={styles.postContainer}
            justifyContent="center"
          >
            <Button
              className={styles.postButton}
              variant="outlined"
              // onClick={() => onClickSelectedPost(post._id)}
            >
              <Grid container direction="column" className={styles.postDetails}>
                <Typography variant="h6" align="left" className={styles.title}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body1"
                  align="left"
                  className={styles.content}
                >
                  {post.content}
                </Typography>
              </Grid>
              <Typography variant="caption" className={styles.comments}>
                <FontAwesomeIcon
                  icon={faComment}
                  className={styles.commentIcon}
                />
                {post.comments.length} Comments
              </Typography>
              <Typography variant="caption" className={styles.userName}>
                Posted by {post.userName} on {post.displayDate}
              </Typography>
            </Button>
            <Grid
              container
              direction="row-reverse"
              spacing={2}
              className={styles.buttonContainer}
            >
              <Grid item>
                <Button
                  size="small"
                  className={styles.editButton}
                  onClick={() => handleDialogOpen(post)}
                >
                  Edit Post
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  className={styles.deleteButton}
                  onClick={() => onClickDeletePost(post._id)}
                >
                  Delete Post <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ))
      ) : (
        <div></div>
      )}
      <EditPostDialog
        isOpen={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        post={editPost}
      />
    </Grid>
  );
}

export default UserPosts;
