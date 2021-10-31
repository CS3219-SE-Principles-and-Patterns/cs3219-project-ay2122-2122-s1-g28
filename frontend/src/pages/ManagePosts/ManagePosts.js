// Import Settings
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

// Import Redux
import { useSelector } from "react-redux";

// Import Material-ui
import { Box, Grid, Paper, Tab, Tabs, Typography } from "@material-ui/core";

// Import Components
import PageTitle from "../../components/PageTitle/PageTitle.js";
import Navbar from "../../components/Navbar/Navbar.js";
import UserPosts from "../../components/UserPosts/UserPosts.js";
import UserComments from "../../components/UserComments/UserComments.js";
import BackButton from "../../components/BackButton/BackButton.js";

// Import Constants
import { FORUM_ICONS } from "../../constants/ForumConstants.js";

// Import CSS
import styles from "./ManagePosts.module.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ManagePosts() {
  const [tabValue, setTabValue] = useState(0);

  const history = useHistory();

  const auth = useSelector((state) => state.auth);
  const topic = useSelector((state) => state.post.forumTopic);
  const posts = useSelector((state) => state.post.posts);
  const comments = useSelector((state) => state.comment.userComments);

  const pageTitle = "Manage Posts & Comments - " + topic;

  if (!auth.token) {
    return <Redirect to="/login" />;
  }

  const handleOnBack = () => {
    const path = "/forum/" + topic;
    history.push(path);
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Navbar />
      <Grid item md={12} className="center-text">
        <PageTitle title={pageTitle} icon={FORUM_ICONS[topic]} />
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={10} sm={10} md={10}>
          <BackButton handleOnBack={handleOnBack} />
        </Grid>
      </Grid>
      <Grid container justifyContent="center" className={styles.container}>
        <Grid item xs={10} sm={10} md={10}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              TabIndicatorProps={{
                className: styles.tabIndicator,
              }}
            >
              <Tab label="Posts" />
              <Tab label="Comments" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <UserPosts posts={posts} topic={topic} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <UserComments comments={comments} topic={topic} />{" "}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManagePosts;
