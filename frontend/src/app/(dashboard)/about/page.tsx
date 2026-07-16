import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `À propos — ${APP_NAME}`,
  description:
    "Pourquoi Vérif Nord-Kivu, son utilité contre la désinformation, et le concepteur du projet.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
