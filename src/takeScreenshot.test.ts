import { describe, it, expect, vi, Mock } from "vitest";
import { takeScreenshot } from "./takeScreenshot";
import html2canvas from "html2canvas";
import { fireEvent } from "@testing-library/dom";

// Мокаем зависимости
vi.mock("html2canvas", () => ({
  default: vi.fn(),
}));

describe("takeScreenshot", () => {
  it("should capture a screenshot and copy it to the clipboard", async () => {
    const mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob) => void) => {
        const blob = new Blob(["mock image"], { type: "image/png" });
        callback(blob);
      }),
    };

    (html2canvas as Mock).mockResolvedValue(mockCanvas);

    const writeMock = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        write: writeMock,
      },
      configurable: true,
    });

    const mockElement = document.createElement("div");
    mockElement.id = "teamWrapper";

    await takeScreenshot(mockElement);

    expect(html2canvas).toHaveBeenCalledWith(mockElement, {
      backgroundColor: null,
      useCORS: true,
    });
    expect(writeMock).toHaveBeenCalled();
    expect(writeMock.mock.calls).toMatchInlineSnapshot(`
      [
        [
          [
            ClipboardItem {
              "presentationStyle": "unspecified",
            },
          ],
        ],
      ]
    `);
  });
});
