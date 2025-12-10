'use server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Regex to capture the 11-char video ID in group 1
const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/|y2u\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?/;


/**
 * Extracts the 11-character video ID from a YouTube URL.
 * Supports various formats: watch?v=, youtu.be/, embed/, and shorts/.
 *
 * @param url The YouTube video URL string.
 * @returns The 11-character video ID, or null if the URL is invalid.
 */
function extractVideoId(url: string): string | null {
  const match = url.match(YOUTUBE_URL_REGEX);
  
  // The captured group [1] contains the 11-character ID
  return match ? match[1] : null;
}

/**
 * Fetches the title of a YouTube video using its ID and the YouTube Data API.
 * This runs securely on the server, keeping the API KEY hidden from the client.
 *
 * @param videoId The 11-character YouTube video ID.
 * @returns A Promise that resolves to the video title, or throws an error.
 */
export async function getYouTubeVideoTitle(videoId: string): Promise<string> {
    if (!YOUTUBE_API_KEY) {
        throw new Error("Missing server-side configuration: YOUTUBE_API_KEY");
    }

    if (!videoId) {
        throw new Error("Invalid or missing video ID.");
    }

    // Construct the API URL
    const apiUrl = `${YOUTUBE_API_BASE_URL}?` + new URLSearchParams({
        part: 'snippet',
        id: videoId,
        key: YOUTUBE_API_KEY,
        fields: 'items(snippet(title))'
    });

    // Make the API request
    const response = await fetch(apiUrl);

    if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 403 Forbidden due to bad API key or quota limit)
        throw new Error(`YouTube API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the title from the JSON response structure
    if (data.items && data.items.length > 0) {
        const title = data.items[0].snippet.title;
        return title;
    } else {
        // This typically means the video ID is invalid or the video is private/deleted
        throw new Error(`Video not found or access restricted for ID: ${videoId}`);
    }
}

/**
 * Convenience function to get title directly from a URL.
 * Securely called from client to server.
 */
export async function getTitleFromUrl(url: string): Promise<string | undefined> {
    const videoId = extractVideoId(url);

    if (!videoId) {
        throw new Error(`Could not extract a valid ID from the URL: ${url}`);
    }

    return await getYouTubeVideoTitle(videoId);
}
