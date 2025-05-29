import { X } from "lucide-react";

export default function RiskNoteModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose} // Klik di overlay akan tutup modal
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Mencegah close saat klik di modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 hover:cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Kategori Risiko</h2>
        <ul className="space-y-3 text-gray-700 text-sm">
          {/* isi list tetap sama */}
          <li>
            <strong>Risiko Keuangan:</strong> Risiko yang disebabkan oleh segala
            sesuatu yang menimbulkan tekanan terhadap pendapatan dan belanja
            organisasi.
          </li>
          <li>
            <strong>Risiko Kebijakan:</strong> Risiko yang disebabkan oleh
            adanya penetapan kebijakan organisasi baik internal maupun eksternal
            yang berdampak langsung terhadap organisasi.
          </li>
          <li>
            <strong>Risiko Kepatuhan:</strong> Risiko yang disebabkan oleh
            organisasi atau pihak eksternal tidak mematuhi dan/atau tidak
            melaksanakan peraturan perundang-undangan dan ketentuan lain yang
            berlaku.
          </li>
          <li>
            <strong>Risiko Legal:</strong> Risiko yang disebabkan oleh adanya
            tuntutan hukum kepada organisasi.
          </li>
          <li>
            <strong>Risiko Fraud:</strong> Risiko yang disebabkan oleh
            kecurangan yang disengaja oleh pihak internal yang merugikan
            keuangan negara.
          </li>
          <li>
            <strong>Risiko Reputasi:</strong> Risiko yang disebabkan oleh
            menurunnya kepercayaan publik/masyarakat yang bersumber dari
            persepsi negatif organisasi.
          </li>
          <li>
            <strong>Risiko Operasional:</strong> Risiko yang disebabkan oleh:
            <ul className="list-disc ml-6 mt-1">
              <li>
                Ketidakcukupan dan/atau tidak berfungsinya proses internal,
                kesalahan manusia dan kegagalan sistem.
              </li>
              <li>Adanya kejadian eksternal yang mempengaruhi operasional.</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
