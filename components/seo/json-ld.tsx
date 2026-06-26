interface Props {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be injected as raw text; data is built from trusted constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
