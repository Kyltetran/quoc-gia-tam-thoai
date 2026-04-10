export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export const defaultSEO: SEOMetadata = {
  title: "Quốc Gia Tam Thoại | Đọc Quốc Gia Huyết Lệ Qua Ba Tiếng Nói",
  description: "Khám phá Quốc Gia Huyết Lệ thông qua ba tiếng nói cải cách tiêu biểu: Phan Bội Châu, Đạm Phương nữ sử, Phan Văn Trường. Nghe bình luận lịch sử qua AI text-to-speech.",
  keywords: [
    "Quốc Gia Tam Thoại",
    "Quốc Gia Huyết Lệ",
    "Phan Bội Châu",
    "Đạm Phương",
    "Phan Văn Trường",
    "lịch sử Việt Nam",
    "cải cách xã hội",
    "trí thức Việt",
    "đối thoại lịch sử",
    "AI text-to-speech",
    "giáo dục lịch sử"
  ],
  author: "Quốc Gia Tam Thoại",
  ogImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Backround%20Qu%E1%BB%91c%20Gia%20Tam%20tho%E1%BA%A1i.png-08y7VU4Hf2lvzo13UfUm3fO6NO4blg.jpeg",
  ogType: "website",
  twitterCard: "summary_large_image"
};

export function setSEOMetaTags(metadata: Partial<SEOMetadata> = {}) {
  const seo = { ...defaultSEO, ...metadata };

  // Title
  document.title = seo.title;
  
  // Meta tags
  setMetaTag("name", "description", seo.description);
  if (seo.keywords?.length) {
    setMetaTag("name", "keywords", seo.keywords.join(", "));
  }
  setMetaTag("name", "author", seo.author || "");
  setMetaTag("name", "viewport", "width=device-width, initial-scale=1.0");
  setMetaTag("name", "theme-color", "#770A0F");
  setMetaTag("name", "language", "Vietnamese");

  // Open Graph
  setMetaTag("property", "og:title", seo.title);
  setMetaTag("property", "og:description", seo.description);
  setMetaTag("property", "og:type", seo.ogType || "website");
  if (seo.ogImage) {
    setMetaTag("property", "og:image", seo.ogImage);
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");
  }
  setMetaTag("property", "og:url", window.location.href);
  setMetaTag("property", "og:locale", "vi_VN");

  // Twitter Card
  setMetaTag("name", "twitter:card", seo.twitterCard || "summary_large_image");
  setMetaTag("name", "twitter:title", seo.title);
  setMetaTag("name", "twitter:description", seo.description);
  if (seo.ogImage) {
    setMetaTag("name", "twitter:image", seo.ogImage);
  }

  // Additional SEO
  setMetaTag("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  setMetaTag("name", "googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  setMetaTag("name", "revisit-after", "7 days");
}

function setMetaTag(type: "name" | "property", name: string, content: string) {
  let tag = document.querySelector(`meta[${type}="${name}"]`) as HTMLMetaElement;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(type, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function setStructuredData(data: Record<string, any>) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Generate FAQ structured data
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

// Schema.org structured data for Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quốc Gia Tam Thoại",
  description: "Nền tảng đối thoại lịch sử Việt Nam với AI text-to-speech",
  url: typeof window !== "undefined" ? window.location.origin : "https://quoc-gia-tam-thoai.vercel.app/",
  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Backround%20Qu%E1%BB%91c%20Gia%20Tam%20tho%E1%BA%A1i.png-08y7VU4Hf2lvzo13UfUm3fO6NO4blg.jpeg",
  contact: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    availableLanguage: ["vi", "en"]
  },
  sameAs: []
};

// Schema.org structured data for WebApplication
export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Quốc Gia Tam Thoại",
  description: "Khám phá Quốc Gia Huyết Lệ qua ba tiếng nói cải cách tiêu biểu",
  url: typeof window !== "undefined" ? window.location.origin : "https://quoc-gia-tam-thoai.vercel.app/",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1"
  }
};

// Schema.org structured data for CreativeWork (Literary)
export const creativeWorkSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://quoc-gia-tam-thoai.vercel.app/",
  name: "Quốc Gia Tam Thoại",
  description: "Đối thoại lịch sử qua ba tiếng nói tiêu biểu của cải cách Việt Nam",
  inLanguage: "vi",
  "dateCreated": "2024",
  author: [
    {
      "@type": "Person",
      name: "Phan Bội Châu",
      description: "Cách mạng gia, trí thức cải cách Việt Nam"
    },
    {
      "@type": "Person",
      name: "Đạm Phương nữ sử",
      description: "Giáo dục gia, nữ trí thức Việt Nam"
    },
    {
      "@type": "Person",
      name: "Phan Văn Trường",
      description: "Pháp luật gia, trí thức cải cách Việt Nam"
    }
  ],
  about: [
    {
      "@type": "Thing",
      name: "Quốc Gia Huyết Lệ",
      description: "Tác phẩm lịch sử tiêu biểu của Việt Nam"
    },
    {
      "@type": "Thing",
      name: "Lịch sử cải cách xã hội Việt Nam",
      description: "Giai đoạn cải cách và hiện đại hóa Việt Nam"
    }
  ]
};

