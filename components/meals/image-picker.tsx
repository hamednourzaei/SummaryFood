'use client';

import { useRef, useState, ChangeEvent, MouseEvent } from 'react';
import Image from 'next/image';

import classes from './image-picker.module.css';

// تعریف اینترفیس برای تایپ‌های ورودی کامپوننت
interface ImagePickerProps {
  label: string;
  name: string;
}

export default function ImagePicker({ label, name }: ImagePickerProps) {
  // تعیین نوع state به صورت string یا null
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  // تعیین نوع ref به صورت HTMLInputElement یا null
  const imageInput = useRef<HTMLInputElement | null>(null);

  // تابع برای مدیریت کلیک بر روی دکمه انتخاب تصویر
  function handlePickClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    imageInput.current?.click();
  }

  // تابع برای مدیریت تغییر فایل ورودی
  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
