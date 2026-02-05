'use client'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919825207616"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg width="30" height="30" viewBox="0 0 24 24">
        {/* Speech bubble with tail — white */}
        <path
          fill="white"
          d="M12 1C5.925 1 1 5.925 1 12c0 2.156.67 4.144 1.806 5.795L2 22l4.515-1.178C8.1 21.73 10.02 22 12 22c6.075 0 11-4.925 11-11S18.075 1 12 1z"
        />
        {/* Phone handset — green cutout matching button bg */}
        <path
          fill="#22c55e"
          d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.76.97-.94 1.16c-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.89-.81-1.49-1.8-1.66-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.19-.24-.57-.49-.49-.67-.5-.17 0-.35-.01-.52-.01-.17 0-.47.06-.72.35-.25.28-.95 1.05-.95 2.57 0 1.52 1.08 2.98 1.23 3.18.15.2 2.11 3.21 5.11 4.5.71.31 1.27.5 1.71.64.72.22 1.38.19 1.89.11.59-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.2-.57-.35z"
        />
      </svg>
    </a>
  )
}
