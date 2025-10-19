import { X } from "lucide-react";

export default function RiskNoteModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 hover:cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Risk Categories</h2>
        <ul className="space-y-3 text-gray-700 text-sm">
          <li>
            <strong>Financial Risk:</strong> Risks caused by events that put
            pressure on the organization's revenues and expenditures.
          </li>
          <li>
            <strong>Policy Risk:</strong> Risks arising from internal or
            external policy changes that directly impact the organization.
          </li>
          <li>
            <strong>Compliance Risk:</strong> Risks caused by the organization or
            external parties not complying with applicable laws and regulations.
          </li>
          <li>
            <strong>Legal Risk:</strong> Risks resulting from legal claims against
            the organization.
          </li>
          <li>
            <strong>Fraud Risk:</strong> Risks caused by intentional misconduct
            from internal parties that result in financial loss.
          </li>
          <li>
            <strong>Reputation Risk:</strong> Risks caused by declining public
            trust due to negative perceptions of the organization.
          </li>
          <li>
            <strong>Operational Risk:</strong> Risks caused by:
            <ul className="list-disc ml-6 mt-1">
              <li>
                Inadequate or failing internal processes, human error, or
                system failures.
              </li>
              <li>External events that affect operations.</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
