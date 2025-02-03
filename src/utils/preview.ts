import axios from "axios"

interface RequestMetadata {
    title: string | null,
    subtitle: string | null, 
    image: string | null,
    url: string,
    domain: string
}

const extractMetaTags = (html: string, url: string): RequestMetadata => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : null;

    const descMatch = html.match(/<meta.*?name=["']description["'].*?content=["'](.*?)["']/);
    const subtitle = descMatch ? descMatch[1] : null;

    const imageMatch = html.match(/<meta.*?property=["']og:image["'].*?content=["'](.*?)["']/);
    const image = imageMatch ? imageMatch[1] : null;

    const domain = new URL(url).hostname;

    return { title, subtitle, image, url, domain };
}

export const getPreviewData = async (url: string) : Promise<RequestMetadata> => {
    const { data } = await axios.get(url, { timeout: 3000 })
    return extractMetaTags(data, url);
}
