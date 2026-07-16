import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `À propos — ${APP_NAME}`,
  description:
    "Pourquoi CHUNGUZA, son utilité contre la désinformation au Nord-Kivu, et le concepteur du projet.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
