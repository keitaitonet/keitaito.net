import type { ReactElement } from "react";
import type { ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import { srcDir } from "astro:config/server";
import satori from "satori";
import sharp from "sharp";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "../consts";

const fontPromise = readFile(
  new URL("./assets/fonts/NotoSansJP-Regular.otf", srcDir),
);

export const loadImageAsDataUrl = async (
  source: URL | string | ImageMetadata,
): Promise<string> => {
  // ImageMetadata.fsPath is an Astro runtime field, not in its public type.
  const path =
    source instanceof URL || typeof source === "string"
      ? source
      : (source as ImageMetadata & { fsPath?: string }).fsPath;
  if (!path) throw new Error("Image source has no resolvable path");
  const buf = await readFile(path);
  const resized = await sharp(buf)
    .resize({
      width: 768,
      height: 768,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
};

export const renderOgPng = async (element: ReactElement): Promise<Response> => {
  const fontBuffer = await fontPromise;
  const svg = await satori(element, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
