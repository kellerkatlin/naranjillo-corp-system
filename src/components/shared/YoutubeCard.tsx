"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface YouTubeCardProps {
  url: string;
  title: string;
  subtitle?: string;
}

export const YouTubeCard = ({ url, title, subtitle }: YouTubeCardProps) => {
  const videoId = getYouTubeVideoId(url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Card className="w-[300px] cursor-pointer hover:shadow-lg transition">
        <Image
          src={thumbnail}
          alt={title}
          width={300}
          height={180}
          className="rounded-t-md object-cover"
        />
        <CardContent className="p-4 space-y-1 bg-muted">
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </Link>
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
