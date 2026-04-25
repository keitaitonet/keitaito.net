import type { ReactElement } from "react";
import { readFile } from "node:fs/promises";
import { srcDir } from "astro:config/server";
import satori from "satori";
import sharp from "sharp";
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
} from "../consts";

const fontPromise = readFile(
  new URL("./assets/fonts/NotoSansJP-Regular.otf", srcDir),
);

export const renderOgPng = async (element: ReactElement): Promise<Response> => {
  const fontBuffer = await fontPromise;
  const svg = await satori(element, {
    width: DEFAULT_OG_IMAGE_WIDTH,
    height: DEFAULT_OG_IMAGE_HEIGHT,
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
