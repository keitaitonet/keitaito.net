import type { APIRoute } from "astro";
import { renderOgTemplate } from "../lib/og-template";
import { loadImageAsDataUrl, renderOgPng } from "../lib/og-render";
import { SITE_DESCRIPTION, SITE_SECTIONS } from "../consts";
import profileImage from "../assets/profile.jpg";

const profileImagePromise = loadImageAsDataUrl(profileImage);

export const GET: APIRoute = async () =>
  renderOgPng(
    renderOgTemplate({
      eyebrow: "Portfolio",
      title: "伊藤 啓太",
      description: SITE_DESCRIPTION,
      keywords: SITE_SECTIONS.map((s) => s.label),
      imageSrc: await profileImagePromise,
    }),
  );
