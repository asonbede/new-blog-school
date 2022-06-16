import { useRef, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import classes from "./profile-form.module.css";
//import NotificationContext from "../../store/notification-context";
import NotificationContext from "../../store/notification-context";

import { useSession, signOut } from "next-auth/react";

// async function onChangeReview(reviewData) {
//   const response = await fetch("/api/user/review", {
//     method: "PATCH",
//     body: JSON.stringify(reviewData),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await response.json();

//   //console.log(data);
//   if (!response.ok) {
//     throw new Error(data.message || "Something went wrong!");
//   }
// }

function ResultRetrivForm(props) {
  const resultRetrivRef = useRef();
  const ref = useRef(null);
  const reviewRef = useRef();
  const notificationCtx = useContext(NotificationContext);
  //const [session, loading] = useSession();
  const { data: session, status } = useSession();
  const [name, setName] = useState();
  const [username, setuserName] = useState();
  // const [review, setreview] = useState();
  const [isSuccess, setisSuccess] = useState(true);
  const router = useRouter();

  console.log({ session });
  //   function logoutHandler() {
  //     signOut();
  //   }
  useEffect(() => {
    if (session) {
      setName(session.user.name.name);
      setuserName(session.user.name.username);
      // setreview(props.review);
    }
  }, []);
  async function submitHandler(event) {
    event.preventDefault();

    const enteredExamNo = resultRetrivRef.current.value;
    // const enteredExamNo = "55555666";
    // const enteredReview = reviewRef.current.value;
    console.log({ enteredExamNo });
    // optional: Add validation

    notificationCtx.showNotification({
      title: "Retrieving Results...",
      message: "Your result is currently being retrieved, please wait...",
      status: "pending",
    });

    try {
      // await props.onChangeReview({
      //   examNo: enteredExamNo,

      //   name,
      //   username,
      // });
      console.log(ref.current, "MODAL");
      notificationCtx.showNotification({
        title: "Success!",
        message: "Your review was successfully submitted!",
        status: "success",
      });
      // setisSuccess(false);

      router.push(`/results/${enteredExamNo}`);
      // ref.current.click();
    } catch (error) {
      notificationCtx.showNotification({
        title: "Error!",
        message: error.message || "Something went wrong!",
        status: "error",
      });
    }
  }

  return (
    <>
      <div
        class="modal fade"
        id="retrievResult"
        tabIndex="-6"
        aria-labelledby="retrievResultLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ zIndex: 0 }}>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="retrievResult">
                Retriev Result
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p class="lead">Fill out this form to Retriev your result </p>
              <form onSubmit={submitHandler}>
                <div class="mb-3">
                  <label htmlFor="name" class="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    value={name}
                  />
                </div>

                <div class="mb-3">
                  <label htmlFor="userName" class="form-label">
                    userName
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="userName"
                    value={username}
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="exam-no" class="col-form-label">
                    Exam Number :
                  </label>
                  <input
                    class="form-control"
                    type="text"
                    id="exam-no"
                    ref={resultRetrivRef}
                    required
                  />
                </div>

                {/* <div class="modal-body"> */}
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={ref}
                  >
                    Close
                  </button>
                  <button class="btn btn-primary">Submit</button>
                </div>
                {/* </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultRetrivForm;
