export default function truncateText(
  text: string,
  textLength: number,
  suffix?: string
) {
  if (suffix || suffix === "") {
    return text?.length > textLength
      ? text.substring(0, textLength - suffix.length) + suffix
      : text;
  }
  return text?.length > textLength
    ? text.substring(0, textLength - 3) + "..."
    : text;
}
