import axios from "axios"
import { getPreviewData } from "./preview"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

// For testing internal (non-exported) method
const extractMetaTags = (html: string, url: string) => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : null;

    const descMatch = html.match(/<meta.*?name=["']description["'].*?content=["'](.*?)["']/);
    const subtitle = descMatch ? descMatch[1] : null;

    const imageMatch = html.match(/<meta.*?property=["']og:image["'].*?content=["'](.*?)["']/);
    const image = imageMatch ? imageMatch[1] : null;

    const domain = new URL(url).hostname;

    return { title, subtitle, image, url, domain };
}

describe("extractMetaTags", () => {
    const html = `
<html>
<head>
<title>My Page Title</title>
<meta name="description" content="This is a page description">
<meta property="og:image" content="https://example.com/image.jpg">
</head>
</html>
`
    const url = "https://example.com/some/path"

    it("should extract title, description, image, and domain", () => {
        const meta = extractMetaTags(html, url)
        expect(meta).toEqual({
            title: "My Page Title",
            subtitle: "This is a page description",
            image: "https://example.com/image.jpg",
            url,
            domain: "example.com"
        })
    })

    it("should return nulls if tags are missing", () => {
        const meta = extractMetaTags("<html><head></head></html>", url)
        expect(meta).toEqual({
            title: null,
            subtitle: null,
            image: null,
            url,
            domain: "example.com"
        })
    })
})

describe("getPreviewData", () => {
    const html = `
<html>
<head>
<title>Test Title</title>
<meta name="description" content="Test Desc">
<meta property="og:image" content="https://img.com/test.jpg">
</head>
</html>
`

    it("should fetch and extract preview metadata", async () => {
        mockedAxios.get.mockResolvedValue({ data: html })

        const url = "https://mytest.com/article"
        const preview = await getPreviewData(url)

        expect(mockedAxios.get).toHaveBeenCalledWith(url, { timeout: 3000 })
        expect(preview).toEqual({
            title: "Test Title",
            subtitle: "Test Desc",
            image: "https://img.com/test.jpg",
            url,
            domain: "mytest.com"
        })
    })

    it("should throw if axios fails", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network error"))

        await expect(getPreviewData("https://fail.com")).rejects.toThrow("Network error")
    })
})

