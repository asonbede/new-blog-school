import Image from "next/image";

//import classes from "./title.module.css";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import NotificationContext from "../../store/notification-context";
const examdDateValue = new Date().toLocaleDateString("en-US");
function ExamForm({ subjects, getSubjectMark, getAverageScore }) {
  //const linkPath = `/posts/questions/${props.post.id}/`;
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [examNo, setExamNo] = useState("");
  //const [selectedSubjects, setSelectedSubjects] = useState({});
  //const [pathValue, setPathValue] = useState("");
  const [examDate, setExamDate] = useState();
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 10);
  console.log({ small_id });
  console.log({ examDate });

  //router.push(linkPathForUpdate);
  // const router = useRouter();
  //  const handleUpdateData = () => {
  //    console.log("from handle update");
  //    notificationCtx.blogUpdateHandler({
  //      post,
  //      idValue: post.id,
  //    });
  //    router.push(linkPathForUpdate);
  //  };
  //console.log({ pathValue });
  //   function handleSubmit(event) {
  //     event.preventDefault();

  //     if (getSelectedSubjects().length > 4) {
  //       console.log("Not more than two subJEcts IS aloWed");
  //       notificationCtx.showNotification({
  //         title: "Error!",
  //         message: "You can not chose more than two subjects at a sitting !",
  //         status: "error",
  //       });
  //       return;
  //     }

  //     if (getSelectedSubjects().length < 1) {
  //       notificationCtx.showNotification({
  //         title: "Error!",
  //         message:
  //           "No subject chosen!! please chose a subject(s) before submitting form.",
  //         status: "error",
  //       });
  //       console.log("no subject selected");
  //       return;
  //     }

  //     //  notificationCtx.showNotification({
  //     //    title: "Sending blog...",
  //     //    message: "Your blog is currently being stored into a database.",
  //     //    status: "pending",
  //     //  });

  //     // notificationCtx.showNotification({
  //     //   title: "Success!",
  //     //   message: "Your blog was saved!",
  //     //   status: "success",
  //     // });

  //     // notificationCtx.showNotification({
  //     //   title: "Error!",
  //     //   message: error.message || "Something went wrong!",
  //     //   status: "error",
  //     // });
  //     console.log({ examNo });

  //     notificationCtx.showNotification({
  //       title: "Success!",
  //       message:
  //         "Your form was successfully submitted and your question is being set, please wait!",
  //       status: "success",
  //     });

  //     router.push(pathValue);
  //   }
  useEffect(() => {
    if (session) {
      setName(session.user.name.name);
      setUserName(session.user.name.username);
      //setExamNo()
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      setExamNo(`${small_id}${examdDateValue}`);
    }
  }, [name, username]);
  useEffect(() => {
    if (session) {
      setExamDate(examdDateValue);
    }
  }, []);

  function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //   useEffect(() => {
  //     if (session) {
  //       setPathValue(
  //         `/posts/questions/${props.post.id}/${getSelectedSubjects().join("/")}`
  //       );
  //     }
  //   }, [selectedSubjects]);

  //   function handleCheckBoxChange(e) {
  //     // const { name, value, checked } = e.target;
  //     const name = e.target.name;
  //     const checkedValue = e.target.checked;
  //     // if (checkedValue) {
  //     setSelectedSubjects({ ...selectedSubjects, [name]: checkedValue });
  //     // }
  //     // console.log({ name, value, checked });
  //   }
  //   function getSelectedSubjects() {
  //     const subjectArray = [];
  //     for (const key in selectedSubjects) {
  //       if (Object.hasOwnProperty.call(selectedSubjects, key)) {
  //         const subject = selectedSubjects[key];
  //         if (subject) {
  //           subjectArray.push(key);
  //         }
  //       }
  //     }
  //     return subjectArray;
  //   }

  return (
    <div class="accordion accordion-flush" id="report-card">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#report-card-butt"
          >
            See Report Card
          </button>
        </h2>
        <div
          id="report-card-butt"
          class="accordion-collapse collapse"
          data-bs-parent="#report-card"
        >
          <div class="accordion-body">
            <div
              class="fw-bolder border mt-5 p-1 shadow"
              style={{
                // position: "absolute",
                // top: "5%",
                // left: "10%",
                zIndex: "10",
                width: "100%",
                borderRadius: "2px",
              }}
            >
              <section>
                <div class="row text-center justify-content-center align-items-center bg-warning w-100">
                  <div class="d-flex justify-content-between align-items-center">
                    <img
                      // className={classes["post-image"]}
                      src={session.user.image.imageUrl}
                      class="rounded-circle mb-3 mr-3 img-fluid"
                      alt="card image"
                      style={{ width: "20%" }}
                    />
                    <div>
                      <h5 class="display-5 ">Asonditeck</h5>
                      <p class="lead">Report Card.</p>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="card m-1 w-100">
                      <div class="card-body text-center">
                        <form>
                          <fieldset class="border p-2">
                            <legend class="float-none w-auto p-2">
                              Personal Info:
                            </legend>
                            <div class="mb-3">
                              <label htmlFor="inputUsername" class="form-label">
                                Username
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="inputUsername"
                                aria-describedby="emailHelp"
                                value={username}
                              />
                            </div>
                            <div class="mb-3">
                              <label htmlFor="inputName" class="form-label">
                                Name
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="inputName"
                                value={name}
                              />
                            </div>
                            <div class="mb-3">
                              <label htmlFor="inputExamNo" class="form-label">
                                Exam Number
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="inputExamNo"
                                value={examNo}
                              />
                            </div>

                            <div class="mb-3">
                              <label htmlFor="inputDate" class="form-label">
                                Date
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="inputDate"
                                value={examDate}
                              />
                            </div>
                          </fieldset>

                          <fieldset class="border border-2 p-2">
                            <legend class="float-none w-auto p-2">
                              subject and score
                            </legend>
                            <ol class="list-group list-group-numbered">
                              <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                  <div class="fw-bold">SUBJECT</div>
                                </div>
                                <span class="badge bg-primary rounded-pill">
                                  SCORE
                                </span>
                              </li>
                              {subjects.map((subject) => (
                                <>
                                  <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                      <div class="fw-bold">
                                        {capFirstLetter(subject)}
                                      </div>
                                    </div>
                                    <span
                                      class={`badge rounded-pill ${
                                        getSubjectMark()[`${subject}`]
                                          .per100Score >= 50
                                          ? "bg-success"
                                          : "bg-danger"
                                      }`}
                                    >
                                      {
                                        getSubjectMark()[`${subject}`]
                                          .per100Score
                                      }
                                      %
                                    </span>
                                  </li>
                                </>
                              ))}
                            </ol>
                          </fieldset>
                          <fieldset class="border border-2 p-2">
                            <legend class="float-none w-auto p-2">
                              Average Score
                            </legend>
                            <p
                              class={`fw-bold display-6 ${
                                getAverageScore() >= 50
                                  ? "text-success"
                                  : "text-danger"
                              } `}
                            >
                              {" "}
                              {getAverageScore()}%
                            </p>
                          </fieldset>
                          <fieldset class="border border-2 p-2">
                            <legend class="float-none w-auto p-2">
                              Remarks
                            </legend>
                            {getAverageScore() >= 70 ? (
                              <span class="text-success fw-bold display-6">
                                <em> Excellent. </em>
                                <p class="text-success">
                                  <em> You are good to go.</em>{" "}
                                </p>
                              </span>
                            ) : getAverageScore() <= 40 ? (
                              <span class="text-danger fw-bold display-6">
                                <em>
                                  Poor performance but you can still make it.
                                  Study harder and resit the exam{" "}
                                </em>
                              </span>
                            ) : (
                              <span class="text-primar fw-bold display-6">
                                <em> Good. You can do better.</em>
                              </span>
                            )}
                          </fieldset>
                          {/* <div className="d-flex">
                  <button type="submit" class="btn btn-primary me-2">
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => props.setexamFormIsOpen(false)}
                    class="btn btn-primary"
                  >
                    close
                  </button>
                </div> */}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamForm;
