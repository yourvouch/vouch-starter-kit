import { Landing } from "@/components/v2/Landing";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vouch Starter Kit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  softwareVersion: "2.0.0-preview",
  url: "https://vouchstarterkit.netlify.app/",
  downloadUrl: "https://github.com/yourvouch/vouch-starter-kit",
  codeRepository: "https://github.com/yourvouch/vouch-starter-kit",
  license: "https://opensource.org/license/mit",
  isAccessibleForFree: true,
  description:
    "Open-source, local-first business decision intelligence for explainable CSV and XLSX analysis.",
  creator: {
    "@type": "Organization",
    name: "Vouch",
    url: "https://yourvouch.com",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Landing />
    </>
  );
}
