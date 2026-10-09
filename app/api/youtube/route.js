export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query");

    if (!query) {
      return Response.json(
        {
          success: false,
          error: "Search query is required.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "YOUTUBE_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const youtubeUrl = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );

    youtubeUrl.searchParams.set("part", "snippet");
    youtubeUrl.searchParams.set("q", query);
    youtubeUrl.searchParams.set("type", "video");
    youtubeUrl.searchParams.set("maxResults", "5");
    youtubeUrl.searchParams.set("order", "relevance");
    youtubeUrl.searchParams.set("key", apiKey);

    const response = await fetch(youtubeUrl.toString());

    const data = await response.json();

    if (!response.ok) {
      console.error("YouTube API Error:", data);

      return Response.json(
        {
          success: false,
          error: data?.error?.message || "YouTube API request failed.",
        },
        { status: response.status }
      );
    }

    const videos = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return Response.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("YouTube Route Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to search YouTube.",
      },
      { status: 500 }
    );
  }
}