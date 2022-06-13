//import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
//import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
//import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
//import js from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
//import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import DisplayEditorContent from "../../rich-text-editor/display-editor-content";
//import PostHeader from "./post-header";
import classes from "./post-content.module.css";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import ExamForm from "./exam-form";
// SyntaxHighlighter.registerLanguage("js", js);
// SyntaxHighlighter.registerLanguage("css", css);
//import NotificationContext from "../../store/notification-context";
import NotificationContext from "../../../store/notification-context";
import { useSession, signOut } from "next-auth/react";
import AnimatedOrbitalDiag from "../../miscellaneous/animated-orbital-diag";
import PeriodicTableOfElem from "../../miscellaneous/periodic-table";
import PeriodicTrends from "../../miscellaneous/periodic-trend";
import AtomicModel from "../../miscellaneous/atomic-model";
import NamingIonicCompounds from "../../miscellaneous/naming-ionic";
import Modal from "../../ui/modal/modal";
import Button from "../../ui/button";
//import { getDomainLocale } from "next/dist/next-server/lib/router/router";
//import { adminArray } from "../../../helpers/db-utils";
const replaceBannerImg = {
  "61f946e3e72eb408e83024f5": () => <AnimatedOrbitalDiag />,
  "62106ec04c9caa17288669ce": () => <PeriodicTableOfElem />,
  "61c9123391ac2a163428c8b6": () => <AtomicModel />,
  "61caeb6af20c7613b029ff06": () => <NamingIonicCompounds />,
};
const appendAtEnd = {
  // "62106ec04c9caa17288669ce": () => <PeriodicTrends />,
};
async function changeLikeHandler(likedData) {
  const response = await fetch("/api/blog-content/", {
    method: "PATCH",
    body: JSON.stringify(likedData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  // console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
}

async function sendAuthData(authDetails, setFunc) {
  //console.log({ authDetails });
  const response = await fetch("/api/restrict-route", {
    method: "POST",
    body: JSON.stringify(authDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log({ data }, "authDetails");
  console.log({ data }, "authDetails");
  if (!response.ok) {
    setFunc(false);
    //throw new Error(data.message || "Something went wrong!");
  } else {
    setFunc(data.message);
  }
}

async function sendAuthDataModerate(authDetails, setFunc) {
  const response = await fetch("/api/moderating-post", {
    method: "POST",
    body: JSON.stringify(authDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log({ data }, "authDetails");
  if (!response.ok) {
    // throw new Error(data.message || "Something went wrong!");
    setFunc(false);
  } else {
    setFunc(data.message);
  }
}

function PostContent(props) {
  const { post } = props;
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();
  const imagePath = post.image;
  console.log(imagePath, "post-content");
  console.log(post.id, "post for animation");
  console.log(props.date, "date in content");

  const formattedDatePublished = new Date(post.date).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedDateUpdated = new Date(post.updateDate).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const linkPath = `/posts/questions/${post.id}/rev-ques`;
  const linkPathForUpdate = `/posts/updates/${post.id}`;
  const linkPathForComment = `/comments/${post.id}`;

  console.log(post.imageProfileUrl, "profile-image");
  console.log({ linkPathForUpdate });
  const {data:session, status} = useSession();
  const [isContentOpen, setisContentOpen] = useState(false);
  const [contenButText, setcontenButText] = useState("Read More");
  const [authValue, setauthValue] = useState();
  const [moderatedValue, setmoderatedValue] = useState();
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [examFormIsOpen, setexamFormIsOpen] = useState(false);

  let likeNo;
  //const adminArray = [process.env.admin_1, process.env.admin_2];
  //console.log({ post }, "content");
  const { authorId, moderated } = post;
  useEffect(() => {
    const result = sendAuthData({ authorId }, setauthValue);
    console.log({ result });
    //setauthValue(result.message);
    //console.log({ result }, "postContent");
    // return () => {
    //   cleanup
    // }
  }, [session, authorId]);

  useEffect(() => {
    const result = sendAuthDataModerate(
      { authorId, moderated },
      setmoderatedValue
    );
  }, [authorId, moderated]);

  useEffect(() => {
    setshowDeleteModal(false);
    setexamFormIsOpen(false);
  }, []);

  const handleUpdateData = () => {
    console.log("from handle update");
    notificationCtx.blogUpdateHandler({
      post,
      idValue: post.id,
    });
    router.push(linkPathForUpdate);
  };
  if (post.likes) {
    likeNo = post.likes.likeValue;
  } else {
    likeNo = 0;
  }

  const deletePostHandler = async () => {
    notificationCtx.showNotification({
      title: "Deleting blog...",
      message: "Your blog is currently being deleted from the database.",
      status: "pending",
    });
    try {
      const response = await fetch("/api/blog-content", {
        method: "DELETE",
        body: JSON.stringify({ blogId: post.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      notificationCtx.showNotification({
        title: "Success!",
        message: "Your blog was deleted!",
        status: "success",
      });
      router.push("/");
    } catch (error) {
      //setRequestError(error.message);
      //setRequestStatus("error");
      notificationCtx.showNotification({
        title: "Error!",
        message: error.message || "Something went wrong!",
        status: "error",
      });
    }
    setshowDeleteModal(false);
  };

  const deleteConfirm = () => {
    setshowDeleteModal(true);
  };

  const checkLikeObject = (likeObj, usernameValue) => {
    let newLikeObj = {};
    for (const key in likeObj) {
      if (Object.hasOwnProperty.call(likeObj, key)) {
        const element = likeObj[key];
        if (element === usernameValue) {
          continue;
        }
        newLikeObj[key] = element;
      }
    }
    newLikeObj = { ...newLikeObj, likeValue: newLikeObj.likeValue - 1 };
    return newLikeObj;
  };
  const handleLikeBlog = async () => {
    //check whether the blog has likes field
    //if it has not put the like field
    //if it has, check whether the user has likeed it before
    //if he has liked it before remove him and decrease the liked
    //else increase the liked.

    let newPost;
    if (!session) {
      notificationCtx.showNotification({
        title: "Liking blog operation aborted...",
        message: "Your have to login to like blogs.",
        status: "pending",
      });
      return;
    }
    notificationCtx.showNotification({
      title: "Liking blog...",
      message: "Your blog like request is being executed please wait.",
      status: "pending",
    });
    if (post.likes) {
      //has the current user already liked
      const hasAlreadyLiked =
        Object.values(post.likes).indexOf(session.user.name) > -1;
      if (hasAlreadyLiked) {
        //newPost = checkLikeObject(post.likes, session.user.name);
        newPost = {
          ...post,
          likes: checkLikeObject(post.likes, session.user.name),
        };
        console.log({ newPost }, "ONE");
      } else {
        newPost = {
          ...post,
          likes: {
            ...post.likes,
            [session.user.email]: session.user.name,
            likeValue: post.likes.likeValue + 1,
          },
        };
      }
    } else {
      newPost = {
        ...post,
        likes: { [session.user.email]: session.user.name, likeValue: 1 },
      };
    }
    console.log({ newPost }, "TWO");
    try {
      await changeLikeHandler(newPost);
      notificationCtx.showNotification({
        title: "Success!",
        message: "Your blog like operation was successfull!",
        status: "success",
      });
      router.push(`/posts/${post.id}`);
    } catch (error) {
      notificationCtx.showNotification({
        title: "Error!",
        message: error.message || "Something went wrong!",
        status: "error",
      });
    }
  };
  const handleContenButText = () => {
    setisContentOpen(!isContentOpen);
    if (contenButText === "Read More") {
      setcontenButText("Read Less");
    } else {
      setcontenButText("Read More");
    }
  };
  return (
    <>
      {examFormIsOpen && (
        <ExamForm setexamFormIsOpen={setexamFormIsOpen} post={post} />
      )}
      {showDeleteModal && (
        <Modal
          deletePostHandler={deletePostHandler}
          text={`Do you really want to delete this post?
           Deleting this post will also delete all the 
           questions and comments associated with it`}
          setshowDeleteModal={setshowDeleteModal}
          showDeleteModal={showDeleteModal}
        />
      )}

      <div className={moderatedValue ? classes.showItem : classes.hideItem}>
        {/* {!moderated && (
          <span style={{ color: "red" }}>
            {" "}
            Moderation in progressing, this may take a while, until this action
            is complete only you can see this post, newly created or updated
            post are examined by the admin before it is shown to the public.This
            message will be removed as soon as the process is complete. You may
            continue to work on your post while this process is on...
          </span>
        )} */}
        {/* <article className={classes.content}>
        
          <div className={classes.card}>
            <div className={classes.cardprofile}>
              <img
                className={classes.profileimg}
                src={post.imageProfileUrl}
                alt={post.title}
                width={150}
                height={150}
              />
              <div
                className={classes.cardprofileinfo}
                style={{ marginTop: "2rem" }}
              >
                <h3 className={classes.profilename} style={{ margin: "0" }}>
                  {post.author}
                </h3>
                <span className={classes.profilefollowers}>
                  (Msc Biochemistry)
                </span>
              </div>
            </div>
            <div className={classes.cardbanner}>
              
              {post.id in replaceBannerImg ? (
                replaceBannerImg[post.id]()
              ) : (
                <img
                  className={classes.bannerimg}
                  src={imagePath}
                  alt="banner"
                  width={900}
                  height={800}
                />
              )}
            </div>
            <div className={classes.cardbody}>
              <div className={classes.buttonAction}>
                
                <Button link={linkPath}>Review Questions</Button>

                <Button link={linkPathForComment}>Comments</Button>

                <Button onClick={handleLikeBlog}>
                  <span>{likeNo}</span> like
                </Button>

                {authValue && (
                  <Button onClick={handleUpdateData}>Update</Button>
                )}
                {authValue && <Button onClick={deleteConfirm}>Delete</Button>}
              </div>
              
              <h3 className={classes.blogtitle}>{post.title}</h3>
              <h5 className={classes.excerpt}>
                {post.excerpt}{" "}
                <button onClick={handleContenButText}>{contenButText}</button>
              </h5>
              <div
                className={classes.blogdescription}
                style={{ width: "100%" }}
              >
                {isContentOpen && (
                  <DisplayEditorContent
                    contentFromServer={post.content}
                    toolbarPresent={false}
                  />
                )}
              </div>
              {post.id in appendAtEnd && isContentOpen ? (
                <div
                  className={classes.blogdescription}
                  style={{ width: "80%", overflowX: "auto" }}
                >
                  {appendAtEnd[post.id]()}
                </div>
              ) : null}
            </div>
          </div>

        </article> */}
        <section id="instructors" class="p-5 bg-primary">
          <div class="container">
            {/* <h2 class="text-center text-white">{post.title}</h2> */}
            {/* <p class="lead text-center text-white mb-5">
              Our instructors all have 5+ years working as a web developer in
              the industry
            </p> */}
            <div class="row g-4 align-items-center justify-content-center">
              <div class="col-md-10 ">
                <div class="card bg-light">
                  <div class="card-header">
                    <h3 class="text-center fw-bolder display-3">
                      {post.title}
                    </h3>
                  </div>

                  <div class="card-body text-center">
                    <h6 class="card-subtitle mb-2 text-muted">By</h6>
                    <img
                      src={post.imageProfileUrl}
                      class="rounded-circle mb-3"
                      alt={post.title}
                    />

                    <h3 class="card-title mb-1">{post.author}</h3>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Published:{formattedDatePublished}
                    </h6>
                    <h6 class="card-subtitle mb-2 text-muted">
                      Updated: {formattedDateUpdated}
                    </h6>
                    <div className="w-100 overflow-auto">
                      {post.id in replaceBannerImg ? (
                        replaceBannerImg[post.id]()
                      ) : (
                        <img
                          class="mb-3 img-fluid"
                          src={imagePath}
                          alt="banner"
                        />
                      )}
                    </div>
                    {/* <p class="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Assumenda accusamus nobis sed cupiditate iusto? Quibusdam.
                    </p> */}

                    <div class="card-body d-flex justify-content-around align-items-center flex-column  flex-md-row ">
                      {post.id !== "629a90cdf0d77814603145f7" ? (
                        <Link href={linkPath}>
                          <a class="btn btn-link btn-lg">Review Questions</a>
                        </Link>
                      ) : (
                        <button
                          onClick={() => setexamFormIsOpen(true)}
                          className="btn btn-primary"
                        >
                          Start Exam
                        </button>
                      )}
                      <Link href={linkPathForComment}>
                        <a class="btn btn-link btn-lg">Comments</a>
                      </Link>
                      {authValue && (
                        <button
                          onClick={handleUpdateData}
                          class="btn btn-link btn-lg"
                        >
                          Update
                        </button>
                      )}
                      <button
                        onClick={handleLikeBlog}
                        class="btn btn-light btn-lg"
                      >
                        <span>{likeNo}</span> like
                      </button>
                      {authValue && (
                        <button
                          onClick={deleteConfirm}
                          class="btn btn-light btn-lg"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <h5>
                      {post.excerpt}
                      <button
                        onClick={handleContenButText}
                        class="btn btn-light btn-lg"
                      >
                        {contenButText}
                      </button>
                    </h5>
                    <div
                    // className={classes.blogdescription}
                    // style={{ width: "100%" }}
                    >
                      {isContentOpen && (
                        <DisplayEditorContent
                          contentFromServer={post.content}
                          toolbarPresent={false}
                        />
                      )}

                      {/* {post.id in appendAtEnd && isContentOpen ? (
                        <div
                          className={classes.blogdescription}
                          style={{ width: "80%", overflowX: "auto" }}
                        >
                          {appendAtEnd[post.id]()}
                        </div>
                      ) : null} */}
                    </div>

                    {/* <a href="#">
              <i class="bi bi-twitter text-dark mx-1"></i>
            </a>
            <a href="#">
              <i class="bi bi-facebook text-dark mx-1"></i>
            </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PostContent;
