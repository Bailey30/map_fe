import { useEffect, useRef, useState } from "react";
import styles from "./priceRange.module.scss";
export default function PriceRange() {
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
    if (e.target.value <= "0") {
      toSliderRef.current.value = "100";
    } else if (e.target.value < fromSliderRef.current?.value) {
      toSliderRef.current.value = fromSliderRef.current?.value;
    }
  }

  useEffect(() => {
    console.log({ from });
  }, [from]);

  function check() {
    console.log("from", fromSliderRef.current?.value);
    console.log("to", toSliderRef.current?.value);
  }

  return (
    <div className={`${styles.rangeContainer}`}>
      <div className={`${styles.slidersControl}`}>
        <input
          id="fromSlider"
          type="range"
          defaultValue="0"
          max="100"
          min="0"
          className={`${styles.sliderInput} ${styles.fromSlider}`}
          ref={fromSliderRef}
          onChangeCapture={(e) => controlFromSlider(e)}
        />
        <input
          id="toSlider"
          type="range"
          defaultValue="100"
          max="100"
          min="0"
          className={`${styles.sliderInput}`}
          ref={toSliderRef}
          onChangeCapture={controlToSlider}
        />
      </div>
      <button onClick={check}>check</button>
      <div className={`${styles.formControl}`}>
        <div className={`${styles.formControlContainer}`}>
          <div className={`${styles.formControlContainer}`}>
            <div className={`${styles.formControlContainerTime}`}>Min</div>
            <input
              className={`${styles.formControlContainerTimeInput}`}
              type="number"
              id="fromInput"
              defaultValue={0}
              min="0"
              max="100"
              ref={fromInputRef}
              onChange={onFromInputChange}
            />
          </div>
          <div className={`${styles.formControlContainerTime}`}>Max</div>
          <input
            className={`${styles.formControlContainerTimeInput}`}
            type="number"
            id="toInput"
            defaultValue={100}
            min="0"
            max="100"
            ref={toInputRef}
            onChange={onToInputChange}
          />
        </div>
      </div>
    </div>
  );
}
