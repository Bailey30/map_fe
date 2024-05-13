"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../app/location/review.module.scss";
import UseCreateReview from "@/utils/useCreateReview";
import clsx from "clsx";
import ReviewImageCreator from "../reviewImage/reviewImageCreator";
import Pending from "../pending/pending";
import StarRating from "../starRating/starRating";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasErrors, isPriceRegex } from "@/utils/formValidator";
import UseFormyBoi from "@/utils/useFormyBoi";
import { Review } from "@/utils/types";
import { useAppSelector } from "@/redux/hooks";
import { createReviewSQL, updateReviewAction } from "@/lib/server_actions";
import FormButton from "../formButton/formButton";
import DesktopReviewImage, {
  MemoizedDesktopReviewImage,
} from "../desktopReviewImage/desktopReviewImage";

interface ReviewFormProps {
  locationId: string;
  locationName: string;
  action: "edit" | "add";
  review?: Review;
}

// ReviewForm is used for the edit review component and add new review to location component
// Creating a location and review uses the form defined in location/page.tsx
// When adding a review it returns form errors from the server response as well

export default function ReviewForm({
  locationId,
  locationName,
  review,
  action,
}: ReviewFormProps) {
  const router = useRouter();
  const { setImageData, message, formAction } = UseCreateReview(
    action === "edit" ? updateReviewAction : createReviewSQL,
  );
  const [ratingInput, setRatingInput] = useState<number>(review?.rating ?? 1);
  const imgString = useAppSelector((state) => state.review.imgString);

  const { values, setValue, errors, validators } = UseFormyBoi([
    { name: "location", value: "", minLen: { is: 3 } },
    {
      name: "price",
      value: review?.price.toString() ?? "",
      required: true,
      isPriceRegex: true,
      maxValue: 100,
    },
    { name: "comments", minLen: 140, value: review?.comments ?? "" },
  ]);

  useEffect(() => {
    console.log({ errors });
    console.log({ message });
    if (message?.success === true) {
      if (message.action === "update") {
        router.push(`/location/success?action=update&location=${locationId}`);
      } else {
        router.push(`/location/success?action=create&location=${locationId}`);
      }
    }
  }, [message]);

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  return (
    <>
      {message?.success !== true && (
        <form action={formAction} className={styles.form}>
          <input
            name="id"
            className={clsx(styles.hidden)}
            value={locationId}
            readOnly
          ></input>
          <input
            name="reviewId"
            className={clsx(styles.hidden)}
            value={review?.id ?? undefined}
            readOnly
          ></input>
          <input
            name="imageId"
            className={clsx(styles.hidden)}
            value={review?.imageId ?? undefined}
            readOnly
          ></input>

          <div className={styles.imageAndInputsContainer}>
            <ReviewImageCreator
              setImageData={setImageData}
              imgString={action === "edit" ? imgString : ""}
            />
            <MemoizedDesktopReviewImage
              setImageData={setImageData}
              imgString={action === "edit" ? imgString : ""}
            />

            <div className={styles.inputsContainer}>
              <label htmlFor="locationData" className={clsx(styles.label)}>
                Location
              </label>
              <input
                name="locationData"
                className={clsx(
                  styles.input,
                  message?.errors?.location ? styles.error : styles.noError,
                )}
                value={locationName}
                readOnly
              />
              {message?.errors?.location && (
                <p className={clsx(styles.hiddenAccessibilityAlert)}>
                  {message?.errors?.location}
                </p>
              )}

              <label htmlFor="price" className={styles.label}>
                Price
              </label>
              <div className={clsx(styles.input, styles.priceContainer)}>
                <span className={clsx(styles.poundSign)}>£</span>
                <input
                  name="price"
                  type="text"
                  className={clsx(
                    styles.input,
                    styles.price,
                    styles.pricee,
                    errors?.price && styles.error,
                    message?.errors.price && styles.error,
                  )}
                  aria-required="true"
                  value={values.price}
                  onChange={setValue}
                  onBlur={validators}
                ></input>
              </div>
              {(message?.errors?.price || errors.price) && (
                <p className={clsx(styles.hiddenAccessibilityAlert)}>
                  {message?.errors?.price}
                </p>
              )}

              <div className={styles.rating}>
                <label
                  htmlFor="rating"
                  className={clsx(styles.label, styles.hidden)}
                  aria-required="true"
                >
                  Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  className={clsx(styles.input, styles.hidden)}
                  value={ratingInput}
                />
                <StarRating setRatingInput={setRatingInput} />
              </div>
            </div>
          </div>

          <label
            htmlFor="comments"
            className={clsx(styles.label, styles.comment)}
          >
            Comments - optional
          </label>
          <textarea
            name="comments"
            className={clsx(styles.input, styles.comment)}
            value={values.comments}
            onBlur={validators}
            onChange={setValue}
          />

          <div className={styles.buttonContainer}>
            <FormButton
              text={"Save"}
              disabled={
                hasErrors(errors) ||
                (message?.errors && hasErrors(message?.errors))
              }
            />
            <Link
              className={clsx(styles.button, styles.cancel)}
              href={`/location/${locationId}`}
            >
              Cancel
            </Link>
          </div>
          <Pending />
          {message?.success === false && (
            <p className={clsx(styles.error)} role="alert">
              An error occured
            </p>
          )}
        </form>
      )}
    </>
  );
}
