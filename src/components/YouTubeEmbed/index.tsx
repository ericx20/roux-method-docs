import styles from "./YouTubeEmbed.module.css";

interface YouTubeEmbedProps {
  // Typical YouTube links are in the form "youtube.com/watch?v=<embed id here>"
  id: string;
}

export default function YouTubeEmbed({ id }: YouTubeEmbedProps) {
  return (
    <div className={styles.video}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube video"
      />
    </div>
  );
}