import React, { useEffect, useState, useRef } from "react";
import style from "./Posts.module.css";
import SinglePost from "./SinglePost";
import { db } from "../../../../Firebase/firebase";
import darkLoad from "../../../../static/img/darkLoader.gif";
// import Stories from "./Stories/Stories";
function Posts({ followingUsers }) {
  const [posts, setPosts] = useState([]);
  const [loadingData, setloadingData] = useState(false);
  const [error, setError] = useState(false);
  const limit = 4;
  let lastNameOfPerson = "";
  let reachedEnd = false;
  const ref = useRef(lastNameOfPerson);
  const reachedEndRef = useRef(reachedEnd);
  const dataExtracted = useRef(0);

  useEffect(() => {
    const following = [...followingUsers];
    const followingToUse = [];

    following.forEach(data => followingToUse.push(data.followingUserName));
    let followingSliced = followingToUse.slice(0, 10);

    setloadingData(true);
    if (followingSliced.length > 0) {
      const getPostDataFirstTime = () => {
        const arr = [];
        db.collection("posts")
          .where("authorUserName", "in", followingSliced)
          .orderBy("timeStamp")
          .limit(limit)
          .get()
          .then(res => {
            setloadingData(false);
            res.forEach(data => {
              console.log("bef", data.data().authorUserName);
              arr.push(data.data());
              setPosts(prevPost => [
                ...prevPost,
                { ...data.data(), docId: data.id },
              ]);
            });

            if (arr.length !== 0) {
              ref.current = arr[arr.length - 1].timeStamp;
              console.log(ref.current, "refcurrentaft");
            } else {
              dataExtracted.current += 10;

              if (dataExtracted.current >= followingToUse.length) {
                reachedEndRef.current = true;
              } else {
                followingSliced = followingToUse.slice(
                  dataExtracted.current,
                  dataExtracted.current + 10
                );
              }
            }
          })
          .catch(err => setError(true));
      };

      getPostDataFirstTime();
      const getPostDataNextTime = () => {
        const arr = [];
        if (!reachedEndRef.current) {
          db.collection("posts")
            .where("authorUserName", "in", followingSliced)
            .orderBy("timeStamp")
            .startAfter(ref.current)
            .limit(limit)
            .get()
            .then(res => {
              setloadingData(false);
              res.forEach(data => {
                arr.push(data.data());
                console.log("aft", data.data().authorUserName);
                setPosts(prevPost => [
                  ...prevPost,
                  { ...data.data(), docId: data.id },
                ]);
              });

              if (arr.length !== 0) {
                ref.current = arr[arr.length - 1].timeStamp;
                console.log(ref.current, "refcurrent");
              } else {
                dataExtracted.current += 10;
                if (dataExtracted.current >= followingToUse.length) {
                  reachedEndRef.current = true;
                } else {
                  followingSliced = followingToUse.slice(
                    dataExtracted.current,
                    dataExtracted.current + 10
                  );

                  getPostDataFirstTime();
                }
              }
            })
            .catch(err => setError(true));
        }
      };
      const progressBarFunction = () => {
        const windowHeight =
          "innerHeight" in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
          console.log("i am getting triggered");

          getPostDataNextTime();
        }
        //  else {
        //   console.log("not at boottom");
        // }
        // if (
        //   document.documentElement.scrollHeight - window.innerHeight ===
        //   window.scrollY
        //   // document.documentElement.scrollHeight - window.innerHeight ===
        //   //   parseInt(window.scrollY) + 1 ||
        //   // document.documentElement.scrollHeight - window.innerHeight ===
        //   //   parseInt(window.scrollY) - 1
        // ) {
        //   console.log("i am causing re-render");
        // }
      };
      document.addEventListener("scroll", progressBarFunction);
      return function cleanUp() {
        document.removeEventListener("scroll", progressBarFunction);
      };
    }
  }, [followingUsers, reachedEnd]);

  return (
    <div className={style.mainPostsWrappers}>
      {!loadingData ? (
        <>
          <span>{error}</span>
          {posts.length > 0 ? (
            <>
              {posts.map(
                (data, index) => (
                  <SinglePost postData={data} key={index} />
                ),
                []
              )}
            </>
          ) : (
            <h2 className={style.noPostMsg}>No Posts to display</h2>
          )}
        </>
      ) : (
        <img src={darkLoad} width="40px" height="40" alt="" />
      )}
    </div>
  );
}

export default Posts;
