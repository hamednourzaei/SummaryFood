import fs from 'fs';
import path from 'path';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  // شبیه‌سازی تأخیر ۵ ثانیه‌ای
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  // استخراج نام و پسوند فایل تصویر
  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  // مسیر ذخیره‌سازی فایل در public/images
  const dirPath = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, fileName);
  // تبدیل تصویر به Buffer و ذخیره‌سازی فایل
  const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
  fs.writeFileSync(filePath, bufferedImage);

  // مسیر ذخیره‌شده در دیتابیس
  meal.image = `/images/${fileName}`;

  // ذخیره‌سازی داده در دیتابیس
  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
