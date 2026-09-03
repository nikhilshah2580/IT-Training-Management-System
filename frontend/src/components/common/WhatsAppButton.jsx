import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "9702455544";
const WHATSAPP_MESSAGE = "Hello GyanTech, I would like to know more.";

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with GyanTech on WhatsApp"
      title="Chat with GyanTech on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/25 transition duration-200 hover:scale-105 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-green-500/30 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={30} aria-hidden="true" />
    </a>
  );
};

export default WhatsAppButton;
