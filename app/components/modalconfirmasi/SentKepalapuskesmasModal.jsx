// File: components/ConfirmSendModal.jsx
export default function ConfirmSendModal({ isOpen, onClose, onConfirm }) {
          if (!isOpen) return null;
        
          return (
          <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4 text-center">Kirim ke Kepala Puskesmas</h2>
                <p className="mb-4">Apakah Anda yakin ingin meneruskan data ini ke Kepala Puskesmas?</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
                  <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Kirim</button>
                </div>
              </div>
            </div>
          );
        }
        