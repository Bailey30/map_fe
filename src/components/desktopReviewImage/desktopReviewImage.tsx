import {
  ChangeEvent,
  SetStateAction,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Compressor from "compressorjs";
import Resizer from "react-image-file-resizer";
import placeholder from "../../../public/images/guinness_placeholder.png";
import styles from "./desktopReviewImage.module.scss";
import "./cropperStyles.scss";
import clsx from "clsx";
import Image from "next/image";
import CameraPortal from "../reviewImage/CameraPortal";
import {
  dataUrlToFile,
  formatBase64String,
  readImgFile,
} from "@/utils/reviewUtils";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import React from "react";

interface Props {
  setImageData: React.Dispatch<SetStateAction<any>>;
  imgString: string;
}

export default function DesktopReviewImage({ setImageData, imgString }: Props) {
  const [imgSrc, setImgSrc] = useState<any>("");
  const [crop, setCrop] = useState<any>(() =>
    imgString ? formatBase64String(imgString) : placeholder.src,
  );
  const [zoom, setZoom] = useState<number>(1);
  const cropperRef = createRef<ReactCropperElement>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function fileInputChange(e: any) {
    const imgData = await readImgFile(e.target.files[0]);
    setImgSrc(imgData);
  }

  const getCropData = async () => {
    if (!inputRef.current) return;
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCrop(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setImgSrc("");
      inputRef.current.value = "";

      // get cropped image
      const cropped = cropperRef.current.cropper.getCroppedCanvas().toDataURL();

      // convert dataUrl to file so we can compress it
      const file = dataUrlToFile(cropped, "image.jpeg");
      console.log({ file });

      // compress the file
      new Compressor(file, {
        quality: 0.6,
        async success(file) {
          // resize the compressed image and return a base64 string to be uploaded
          const resized = await resizeImg(file);
          // set the data that is passed to the server action
          setImageData(resized);
        },
      });
    }
  };

  return (
    <div className={clsx(styles.container)}>
      {imgSrc !== "" && (
        <CameraPortal>
          <div className={clsx(styles.cropContainer)}>
            <div className={clsx(styles.cropContainerInner)}>
              <Cropper
                ref={cropperRef}
                style={{ height: 500, width: 500 }}
                zoomTo={0}
                initialAspectRatio={1}
                preview=".img-preview"
                src={imgSrc}
                viewMode={3}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
              />
              <div className={clsx(styles.controlsContainer)}>
                <button
                  onClick={getCropData}
                  className={clsx(styles.cropButton)}
                >
                  Crop and Save Image
                </button>
                <button onClick={() => setImgSrc("")}>Cancel</button>
              </div>
            </div>
          </div>
        </CameraPortal>
      )}
      <div className={clsx(styles.output)}>
        <Image
          src={crop}
          height={100}
          width={100}
          alt="Image of Guinness uploaded by user"
        />
      </div>
      <div className={clsx(styles.buttonContainer)}>
        <label htmlFor="fileInput">Change photo</label>
        <input
          ref={inputRef}
          type="file"
          id="fileInput"
          name="fileInput"
          onChange={fileInputChange}
        />
      </div>
    </div>
  );
}

export const MemoizedDesktopReviewImage = React.memo(DesktopReviewImage);

const resizeImg = (file: any) => {
  let img: any;
  try {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, // new image max width
        300, // new image max height
        "JPEG", // default type
        100, // new image quality
        0, // rotation degree
        (uri) => {
          console.log(uri); // resized new image uri
          img = uri;
          resolve(uri);
        },
        "base64", // output type
      );
    });
  } catch (err: any) {
    console.log(err);
  }
};
