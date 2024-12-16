import html2canvas from "html2canvas";

export async function takeScreenshot(teamWrapper: HTMLElement) {
  const canvas = await html2canvas(teamWrapper, {
    backgroundColor: null,
    useCORS: true,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  const item = new ClipboardItem({ "image/png": blob! });
  await navigator.clipboard.write([item]);
}
