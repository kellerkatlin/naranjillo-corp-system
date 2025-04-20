import { YouTubeCard } from "@/components/shared/YoutubeCard";
import React from "react";

export default function Capacitacion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <YouTubeCard
        url="https://www.youtube.com/watch?v=lh3OIszEWPI&pp=ygUGI2N1eWVs"
        title="¿Cómo iniciar en la crianza de cuyes?"
        subtitle="Tips para iniciar en la crianza de cuyes"
      />

      <YouTubeCard
        url="https://www.youtube.com/watch?v=lh3OIszEWPI&pp=ygUGI2N1eWVs"
        title="Recomendación para una buena crianza de cuyes"
        subtitle="Aprende con los especialistas"
      />
    </div>
  );
}
