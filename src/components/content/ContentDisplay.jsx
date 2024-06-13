import React, { useEffect, useState } from "react";
import Posts from "@/functions/Posts";
import PostDisplay from "../posts/PostDisplay";
import Accounts from "@/functions/Accounts";

const ContentDisplay = ({ posts, setPosts }) => {
  const [postDetails, setPostDetails] = useState([]);

  useEffect(() => {
    const fetchPostsDetails = async () => {
      try {
        const details = await Promise.all(
          posts.map(async (post) => {
            const account = await Accounts.getOneById(post?.account_id);
            return { ...post, account };
          })
        );

        const postDetailsMap = details.reduce((acc, curr) => {
          acc[curr.account_id] = curr.account;
          return acc;
        }, {});

        setPostDetails(postDetailsMap);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsDetails();
  }, []);

  return (
    <>
      <div className="h-full">
        {posts == undefined || posts?.length < 1 ? (
          <div className="flex items-center justify-center h-full">
            No Posts Available
          </div>
        ) : (
          <>
            <div className="p-2">
              {posts?.map((post, index) => (
                <div key={index} className={`flex w-full`}>
                  <PostDisplay
                    post={post}
                    owner={postDetails[post?.account_id]}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ContentDisplay;
