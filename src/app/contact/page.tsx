import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us - TribeToy",
  description: "Get in touch with TribeToy for custom 3D printing orders, workshops, and general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-40 md:pt-48 pb-32">
      <ContactClient />
    </main>
  );
}
