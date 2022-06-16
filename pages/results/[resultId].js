//import { useContext } from "react";
//import { getSession, session } from "next-auth/client";
import { useSession, getSession, session } from "next-auth/react";
//import UserProfile from "../../components/profile/user-profile";
import QuestionReviewSelect from "../../components/questions/question-review-select";
import {
  //getAllFeaturedDocuments,
  connectDatabase,
} from "../../helpers/db-utils";
//import { connectDatabase } from "../helpers/db-utils";
// import { getAllFeaturedDocuments, connectDatabase } from "../helpers/db-utils";

//import NotificationContext from "../../store/notification-context";

//import DisplayEditorContent from "../rich-text-editor/display-editor-content";

function QuestionReviewSelectPage(props) {
  const { data: session, status } = useSession();
  //const [session, loading] = useSession();
  // const description = props.session.user.image.split("??")[1];
  // const imageUrl = props.session.user.image.split("??")[0];
  // const notificationCtx = useContext(NotificationContext);
  return (
    <QuestionReviewSelect
      reviewQuestionObj={props.reviewQuestionObj}
      subjects={props.subjects}
      quesForm={props.quesForm}
      blogId={props.blogId}
      sittingsNo={props.sittingsNo}
      personalInfo={props.personalInfo}
      examNo={props.examNo}
      controlReviewLink={false}
      backToQuestionListHandler={null}
      jobType="printOldResult"
    />
  );
}
//export the page
export default QuestionReviewSelectPage;
export async function getServerSideProps(context) {
  console.log("called1466");
  const session = await getSession({ req: context.req });
  const paramValue = context.params.resultId;
  //const { name, description, imageLink } = context.query;
  //let name, description, imageLink ;
  console.log({ paramValue }, "from examNoID1");
  //const queryDescription = context.query.description;
  console.log({ session }, "from examNoID2");
  if (!session) {
    return {
      notFound: true,
    };
  }
  try {
    let client;

    client = await connectDatabase();

    console.log("from pro77777734");
    const usersCollection = client.db().collection("users");
    const user = await usersCollection.findOne({
      username: session.user.name.username,
    });

    const { results } = user;
    if (!results) {
      return {
        notFound: true,
      };
    }
    console.log("result found");
    const examItem = results.find((exam) => exam.examNo === paramValue);
    if (!examItem) {
      return {
        notFound: true,
      };
    }
    console.log("result last");
    const { examNo, personalInfo, subInfo, reviewQuestionObj, typeOfQuestion } =
      examItem;

    client.close();

    return {
      props: {
        reviewQuestionObj,
        subjects: subInfo.subjects,
        quesForm: subInfo.quesForm,
        blogId: subInfo.blogId,
        sittingsNo: subInfo.sittingsNo,
        personalInfo: personalInfo,
        examNo: examNo,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}

// return {
//           email: usernameCheck.email,
//           names: { name: usernameCheck.name, username: usernameCheck.username },
//           imageAndInterest: {
//             image: usernameCheck.imageLink,
//             interest: usernameCheck.interest,
//           },

// const controlReviewLink = props.controlReviewLink;
//   const backToQuestionListHandler = props.backToQuestionListHandler;
//   const notificationCtx = useContext(NotificationContext);
//   const subjects = props.subjects;
//   const quesForm = props.quesForm;
//   const blogId = props.blogId;
//   const reviewQuestionObj = notificationCtx.reviewQuestion;
//   const {
//     selectedValuesOfRadioButton,
//     currentArray,
//     correctQuestions,
//     inCorrectQuestions,
//     skippedQuestions,
//     allQuestions,
//     score,
//     selectValue,
//   } = reviewQuestionObj;

// catch (error) {
//     console.log(error);
//     return {
//       notFound: true,
//     };
//   }

// const resultData = {
//     examNo: examNo,
//     personalInfo: { examDate, sittingsNo, username, name },
//     subInfo: { blogId, subjects, quesForm, sittingsNo },
//     reviewQuestionObj: { ...reviewQuestionObj },
//     typeOfQuestion: "report-card",
//   };
