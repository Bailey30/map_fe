import { useEffect, useRef, useState } from "react";
import styles from "./priceRange.module.scss";
import { setupDirect } from "@testing-library/user-event/dist/types/setup/setup";
import { useAppDispatch } from "@/redux/hooks";
import { SET_PRICE_RANGE } from "@/redux/controlsSlice";
export default function PriceRange() {
  const dispatch = useAppDispatch();
  const fromSliderRef = useRef<HTMLInputElement>(null);
  const toSliderRef = useRef<HTMLInputElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(100);

  function controlFromSlider(e: any) {
    if (!toSliderRef.current) return;
    if (!fromSliderRef.current) return;
    if (!fromInputRef.current) return;
    fromInputRef.current.value = e.target.value;
    fillSlider();
    if (e.target.value > parseInt(toSliderRef.current.value)) {
      fromSliderRef.current.value = toSliderRef.current.value;
      fromInputRef.current.value = toSliderRef.current.value;
    }
  }
  function controlToSlider(e: any) {
    if (!toSliderRef.current) return;
    if (!fromSliderRef.current) return;
    if (!toInputRef.current) return;
    setToggleAccessble(e);
    toInputRef.current.value = e.target.value;
    fillSlider();
    if (e.target.value <= parseInt(fromSliderRef.current.value)) {
      e.target.value = parseInt(fromSliderRef.current.value);
      toInputRef.current.value = fromSliderRef.current.value;
    }
  }
  function setToggleAccessble(e: any) {
    if (!toSliderRef.current) return;
    if (parseInt(toSliderRef.current.value) <= 0) {
      toSliderRef.current.style.zIndex = "2";
    } else {
      e.target.style.zIndex = 0;
    }
  }

  function onFromInputChange(e: any) {
    if (!fromSliderRef.current) return;
    if (!toSliderRef.current) return;
    fromSliderRef.current.value = e.target.value;
    fillSlider();
    if (e.target.value > toSliderRef.current.value) {
      fromSliderRef.current.value = toSliderRef.current.value;
    } else if (e.target.value <= 0) {
      fromSliderRef.current.value = "0";
    }
  }
  function onToInputChange(e: any) {
    if (!fromSliderRef.current) return;
    if (!toSliderRef.current) return;
    toSliderRef.current.value = e.target.value;
    fillSlider();
    if (e.target.value <= "0") {
      toSliderRef.current.value = "100";
    } else if (e.target.value < fromSliderRef.current?.value) {
      toSliderRef.current.value = fromSliderRef.current?.value;
    }
  }

  function apply() {
    if (!fromSliderRef.current) return;
    if (!toSliderRef.current) return;

    const from = parseInt(fromSliderRef.current.value);
    const to = parseInt(toSliderRef.current.value);
    dispatch(
      SET_PRICE_RANGE({
        min: from >= to ? 0 : from,
        max: to,
      }),
    );
  }

  function fillSlider() {
    if (!fromSliderRef.current) return;
    if (!toSliderRef.current) return;

    const sliderColor = "#C6C6C6";
    const rangeColor = "#000000";
    const fromSlider = fromSliderRef.current;
    const toSlider = toSliderRef.current;
    const rangeDistance = parseInt(toSlider.max) - parseInt(toSlider.min);
    const fromPosition = parseInt(fromSlider.value) - parseInt(toSlider.min);
    const toPosition = parseInt(toSlider.value) - parseInt(toSlider.min);

    toSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
  }

  useEffect(() => {
    fillSlider();
  }, []);

  return (
    <div className={`${styles.rangeContainer}`}>
      <label htmlFor="toSlider">Price range</label>
      <div className={`${styles.slidersControl}`}>
        <input
          id="fromSlider"
          type="range"
          defaultValue="0"
          max="10"
          min="0"
          className={`${styles.sliderInput} ${styles.fromSlider}`}
          ref={fromSliderRef}
          onChangeCapture={(e) => controlFromSlider(e)}
        />
        <input
          id="toSlider"
          type="range"
          defaultValue="10"
          max="10"
          min="0"
          className={`${styles.sliderInput}`}
          ref={toSliderRef}
          onChangeCapture={controlToSlider}
        />
      </div>
      <div className={`${styles.formControl}`}>
        <div className={`${styles.formControlContainer}`}>
          <label
            htmlFor="fromInput"
            className={`${styles.formControlContainerTime}`}
          >
            Min
          </label>
          <span>£</span>
          <input
            className={`${styles.formControlContainerTimeInput}`}
            type="number"
            id="fromInput"
            defaultValue={0}
            min="0"
            max="10"
            ref={fromInputRef}
            onChange={onFromInputChange}
          />
        </div>
        <div className={`${styles.formControlContainer}`}>
          <label
            htmlFor="toInput"
            className={`${styles.formControlContainerTime}`}
          >
            Max
          </label>
          <span>£</span>
          <input
            className={`${styles.formControlContainerTimeInput}`}
            type="number"
            id="toInput"
            defaultValue={10}
            min="0"
            max="10"
            ref={toInputRef}
            onChange={onToInputChange}
          />
        </div>
        <button id="noHover" className={`${styles.apply}`} onClick={apply}>
          Apply
        </button>
      </div>
    </div>
  );
}
