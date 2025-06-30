"use client";

import { Card, CardContent } from "@/components/ui/card";

interface YouTubeCardProps {
  url: string;
  title: string;
  subtitle?: string;
}

export const YouTubeCard = ({ url, title, subtitle }: YouTubeCardProps) => {
  const videoId = getYouTubeVideoId(url);

  return (
    <Card className="w-full max-w-md">
      {videoId && (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-t-md"
          ></iframe>
        </div>
      )}
      <CardContent className="p-4 bg-muted">
        <h3 className="font-semibold text-sm">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Helper para extraer el ID del video de YouTube
function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    } else if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
  } catch {
    return null;
  }
  return null;
}
