import { Review } from "@/utils/types";
import styles from "../reviewList/reviewList.module.scss";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { deleteReviewAction } from "@/lib/server_actions";
import Pending from "../pending/pending";
import { redirect } from "next/navigation";

interface Props {
  review: Review;
  setDeletePopup: Dispatch<SetStateAction<boolean>>;
}
export default function DeletePopup({ review, setDeletePopup }: Props) {
  const reviewData = {
    reviewId: review.id,
    locationId: review.locationId,
  };
  const deleteReview = deleteReviewAction.bind(null, reviewData);
  const [response, action] = useFormState(deleteReview, null);

  function deleteAction(e: any) {
    e.preventDefault();
    action(new FormData());
  }

  useEffect(() => {
    console.log({ response });
    // response?.success === true && setDeletePopup(false);
    response?.redirect === true && redirect("/");
  }, [response]);

  return (
    <div className={clsx(styles.deletePopup)}>
      <p>Delete review?</p>
      <div className={styles.buttonContainer}>
        <button type="submit" onClick={deleteAction}>
          Yes
        </button>
        <button onClick={() => setDeletePopup(false)}>No</button>
      </div>
      <Pending />
    </div>
  );
}
