// Import Settings
import React, { useEffect, useState } from "react";

// Import Redux
import { useDispatch, useSelector } from "react-redux";
import { handleGetSinglePost } from "../../actions/post";

// Import Components
import CommentDetails from "../CommentDetails/CommentDetails";
import PostDetails from "../PostDetails/PostDetails";

// Import Material-ui
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";

function CommentDialog(props) {
  const { isOpen, handleClose, postId } = props;
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.singlePost);
  const comments = useSelector((state) => state.comment.comments);
  const [postDetails, setPostDetails] = useState("");

  useEffect(() => {
    const postData = {
      title: post.title,
      content: post.content,
      comments: post.comments,
      userName: post.userName,
      displayDate: post.displayDate,
    };
    setPostDetails(postData);
  }, [isOpen]);

  useEffect(() => {
    if (postId) {
      dispatch(handleGetSinglePost(postId));
    }
  }, [postId]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>
        <PostDetails post={postDetails} />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {comments ? (
            comments.map((comment) => (
              <Grid item xs={12} sm={12} md={12} key={comment._id}>
                <Card variant="outlined">
                  <CardContent>
                    <CommentDetails comment={comment} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <div></div>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="small-orange-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommentDialog;