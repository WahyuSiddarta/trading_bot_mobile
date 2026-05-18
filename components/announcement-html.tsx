import { decode } from "html-entities";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";

const allowedTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "span",
  "ol",
  "ul",
  "li",
]);

const blockedTags = [
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "style",
  "img",
  "video",
  "audio",
  "form",
  "input",
  "button",
];

const safeStyleProperties = new Set(["text-align", "text-decoration"]);

function sanitizeStyle(styleValue: string) {
  return styleValue
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(":");

      if (separatorIndex === -1) {
        return "";
      }

      const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
      const value = declaration.slice(separatorIndex + 1).trim().toLowerCase();

      if (!safeStyleProperties.has(property)) {
        return "";
      }

      if (
        value.includes("url(") ||
        value.includes("expression(") ||
        value.includes("javascript:")
      ) {
        return "";
      }

      if (
        property === "text-align" &&
        !["left", "right", "center", "justify"].includes(value)
      ) {
        return "";
      }

      if (
        property === "text-decoration" &&
        !["underline", "line-through", "none"].includes(value)
      ) {
        return "";
      }

      return `${property}: ${value}`;
    })
    .filter(Boolean)
    .join("; ");
}

function sanitizeAttributes(attributes = "") {
  const styleMatch = attributes.match(/\sstyle\s*=\s*(["'])(.*?)\1/i);

  if (!styleMatch) {
    return "";
  }

  const safeStyle = sanitizeStyle(styleMatch[2]);

  return safeStyle ? ` style="${safeStyle}"` : "";
}

function sanitizeTinyMceHtml(value: string) {
  const decodedHtml = decode(value || "");

  return blockedTags.reduce((html, tag) => {
    const pairedTagPattern = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    const singleTagPattern = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");

    return html.replace(pairedTagPattern, "").replace(singleTagPattern, "");
  }, decodedHtml)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*\/\s*([a-z0-9-]+)\s*>/gi, (match, tagName) => {
      const normalizedTag = String(tagName).toLowerCase();

      return allowedTags.has(normalizedTag) ? `</${normalizedTag}>` : "";
    })
    .replace(/<\s*([a-z0-9-]+)([^>]*)>/gi, (match, tagName, attributes) => {
      const normalizedTag = String(tagName).toLowerCase();

      if (!allowedTags.has(normalizedTag)) {
        return "";
      }

      if (normalizedTag === "br") {
        return "<br>";
      }

      return `<${normalizedTag}${sanitizeAttributes(attributes)}>`;
    });
}

export function AnnouncementHtml({ content }: { content: string }) {
  const { width } = useWindowDimensions();
  const html = useMemo(() => sanitizeTinyMceHtml(content), [content]);

  return (
    <RenderHTML
      baseStyle={{
        color: "#D8E4EF",
        fontSize: 14,
        lineHeight: 21,
      }}
      contentWidth={Math.max(width - 72, 240)}
      ignoredDomTags={blockedTags}
      source={{ html }}
      systemFonts={[...defaultSystemFonts, "System"]}
      tagsStyles={{
        b: { fontWeight: "800" },
        em: { fontStyle: "italic" },
        i: { fontStyle: "italic" },
        li: { marginBottom: 4 },
        ol: { marginBottom: 6, marginTop: 4 },
        p: { marginBottom: 8, marginTop: 0 },
        s: { textDecorationLine: "line-through" },
        span: { color: "#D8E4EF" },
        strong: { fontWeight: "800" },
        u: { textDecorationLine: "underline" },
        ul: { marginBottom: 6, marginTop: 4 },
      }}
    />
  );
}
