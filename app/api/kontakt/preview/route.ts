import { customerConfirmation, teamNotification, type Enquiry } from "@/lib/mail/templates";

/* Development only: /api/kontakt/preview?mail=team|kunde[&locale=en] renders an e-mail with sample data. */

const SAMPLE: Enquiry = {
  name: "Max Mustermann",
  company: "Musterbetrieb GmbH",
  email: "max@example.com",
  phone: "0211 1234567",
  branche: "Handwerk",
  topics: ["Marketing & Performance", "SEO & KI-Sichtbarkeit"],
  message: "Hallo TyloTech,\nwir sind ein SHK-Betrieb mit 12 Mitarbeitern und wollen mehr Anfragen über Google bekommen.\nWann hättet ihr Zeit für ein Gespräch?",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  const origin = url.origin;
  const locale = url.searchParams.get("locale") === "en" ? "en" : "de";
  const mail =
    url.searchParams.get("mail") === "kunde"
      ? customerConfirmation(SAMPLE, origin, locale)
      : teamNotification(SAMPLE, origin, `${url.host}/kontakt (Branche: Handwerk)`, locale);
  return new Response(mail.html, { headers: { "Content-Type": "text/html; charset=utf-8", "X-Subject": encodeURIComponent(mail.subject) } });
}
