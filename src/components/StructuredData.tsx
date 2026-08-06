const StructuredData = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Auto Serwis Gl@bcio",
    image: "https://autoserwisglabcio.pl/og-image.jpg",
    url: "https://autoserwisglabcio.pl/",
    telephone: "+48 530 978 968",
    email: "glabcio@interia.pl",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Raszkowska 53",
      addressLocality: "Ostrów Wielkopolski",
      postalCode: "63-400",
      addressRegion: "wielkopolskie",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.6547,
      longitude: 17.8156,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
    areaServed: "Ostrów Wielkopolski",
    sameAs: [
      "https://www.facebook.com/AutoSerwisGlabcio/",
      "https://share.google/u1rnV3Gw4YxhWLICP",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;
