"use client";
import styles from "./review.module.scss";
import { useRouter } from "next/navigation";
import Pending from "@/components/pending/pending";
import ReviewImageCreator from "@/components/reviewImage/reviewImageCreator";
import UseCreateReview from "@/utils/useCreateReview";
import clsx from "clsx";
import StarRating from "@/components/starRating/starRating";
import { useEffect, useState } from "react";
import { isPriceRegex } from "@/utils/formValidator";
import { createReviewSQL } from "@/lib/server_actions";
import FormButton from "@/components/formButton/formButton";

export default function CreateReviewPanel() {
  const router = useRouter();
  const { setImageData, message, formAction } =
    UseCreateReview(createReviewSQL);
  const [ratingInput, setRatingInput] = useState<number>(1);
  const [price, setPrice] = useState<string>("");

  function back() {
    router.push("/");
  }

  function validateNumber(e: any) {
    isPriceRegex(e.target.value) && setPrice(e.target.value);
  }

  useEffect(() => {
    console.log({ message });
    if (message?.success === true) {
      router.push("/location/success");
    }
  }, [message]);

  return (
    <>
      <form action={formAction} className={styles.form}>
        <div className={styles.imageAndInputsContainer}>
          <ReviewImageCreator setImageData={setImageData} imgString="" />
          <div className={styles.inputsContainer}>
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <input
              name="location"
              className={clsx(
                styles.input,
                message?.errors?.location ? styles.error : styles.noError,
              )}
              aria-required="true"
            ></input>
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
                  message?.errors?.price && styles.error,
                )}
                aria-required="true"
                onInput={validateNumber}
                value={price}
              ></input>
              {message?.errors?.price && (
                <p className={clsx(styles.hiddenAccessibilityAlert)}>
                  {message?.errors?.price}
                </p>
              )}
            </div>

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
        />

        <div className={styles.buttonContainer}>
          <FormButton text="Save" />
          <button className={styles.cancel} onClick={back}>
            Cancel
          </button>
        </div>

        <Pending />
        {message?.success === false && !message?.errors && (
          <p className={styles.error}>An error occured</p>
        )}
      </form>
    </>
  );
}
