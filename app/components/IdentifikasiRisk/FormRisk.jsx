import { useState } from "react";
import FormFields from "../../components/IdentifikasiRisk/RiskFormField";
import ModalPenyebab from "../../components/IdentifikasiRisk/ModalPenyebab";
import RiskService from "../../lib/RiskService"; 
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";

const unitsByKlaster = {
  Management: [
    "Ketatausahaan",
    "Manajemen Sumber Daya",
    "Manajemen Puskesmas",
    "Manajemen Mutu dan Keselamatan",
    "Manajemen Jejaring Puskesmas",
    "Sistem Informasi Puskesmas",
    "Dashboard PWS",
  ],
  "Ibu & Anak": [
    "Ibu Hamil Bersalin Nifas",
    "Balita dan Anak Pra-sekolah",
    "Anak Usia Sekolah dan remaja",
  ],
  "Usia Dewasa & Lansia": ["Usia Dewasa", "Lanjut Usia"],
  "Penanggulangan Penyakit Menular": ["Kesehatan Lingkungan", "Surveilans"],
  "Lintas Kluster": [
    "Kegawatdaruratan",
    "Rawat Inap",
    "Laboratorium",
    "Kefarmasian",
  ],
};



const kategoriOptions = [
  "Keuangan",
  "Kebijakan",
  "Kepatuhan",
  "Legal",
  "Fraud",
  "Reputasi",
  "Operasional",
];

const kategoriPenyebab = [
  "man",
  "machine",
  "material",
  "method",
  "environment",
];

export default function FormRisiko({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    klaster: "",
    unit: "",
    namaRisiko: "",
    kategori: "",
    deskripsi: "",
    penyebab: [],
    dampak: "",
    ucc: "",
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  

  const isFormValid =
    formData.klaster &&
    formData.unit &&
    formData.namaRisiko &&
    formData.kategori &&
    formData.deskripsi &&
    formData.dampak &&
    formData.ucc &&
    formData.penyebab.length > 0;

  const [showModal, setShowModal] = useState(false);
  const [penyebabBaru, setPenyebabBaru] = useState({
    kategori: "",
    deskripsiUtama: "",
    deskripsiSub: [],
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const savePenyebab = () => {
    if (!penyebabBaru.kategori || !penyebabBaru.deskripsiUtama.trim()) {
      console.warn("Penyebab baru tidak valid, batal simpan");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      penyebab: [...prev.penyebab, penyebabBaru],
    }));
    setShowModal(false);
    setPenyebabBaru({ kategori: "", deskripsiUtama: "", deskripsiSub: [""] });
  };

  const handleAddPenyebab = () => setShowModal(true);

  const handlePenyebabChange = (key, val) => {
    setPenyebabBaru((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubChange = (index, val) => {
    const updated = [...penyebabBaru.deskripsiSub];
    updated[index] = val;
    setPenyebabBaru((prev) => ({ ...prev, deskripsiSub: updated }));
  };

  const addSubDeskripsi = () =>
    setPenyebabBaru((prev) => ({
      ...prev,
      deskripsiSub: [...prev.deskripsiSub, ""],
    }));

  const hapusSubDeskripsi = (index) =>
    setPenyebabBaru((prev) => ({
      ...prev,
      deskripsiSub: prev.deskripsiSub.filter((_, i) => i !== index),
    }));

  const handleRemovePenyebab = (i) => {
    setFormData((prev) => ({
      ...prev,
      penyebab: prev.penyebab.filter((_, idx) => idx !== i),
    }));
  };

  

  // Fungsi untuk transform data formData ke payload backend
  function preparePayload(data) {
    return {
      cluster: data.klaster,
      unit: data.unit,
      name: data.namaRisiko,
      category: data.kategori,
      description: data.deskripsi,
      impact: data.dampak,
      uc_c: data.ucc === "",
      causes: Array.isArray(data.penyebab)
        ? data.penyebab.map((p) => ({
            category: p.kategori,
            main_cause: p.deskripsiUtama,
            sub_causes:
              Array.isArray(p.deskripsiSub) && p.deskripsiSub.length > 0
                ? p.deskripsiSub
                : null, 
          }))
        : [],
    };
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setToastMessage("Harap lengkapi semua data risiko terlebih dahulu.");
      setErrorOpen(true);
      return; 
    }

    setIsSaving(true); 

    try {
      const payload = preparePayload(formData);
      const savedItem = await onSave(payload);

      if (savedItem) {
        setToastMessage("Data risiko berhasil disimpan.");
        setSuccessOpen(true);
        onCancel(); 
      } else {
        throw new Error("Gagal menyimpan data.");
      }
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      setToastMessage("Gagal menyimpan data risiko. Silakan coba lagi.");
      setErrorOpen(true);
    } finally {
      setIsSaving(false); 
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successOpen && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setSuccessOpen(false)}
        />
      )}

      {errorOpen && (
        <ErrorToast
          message={toastMessage}
          onClose={() => setErrorOpen(false)}
        />
      )}

      <FormFields
        formData={formData}
        handleChange={handleChange}
        unitsByKlaster={unitsByKlaster}
        kategoriOptions={kategoriOptions}
        onSave={onSave}
        onCancel={onCancel}
        handleAddPenyebab={handleAddPenyebab}
        handleRemovePenyebab={handleRemovePenyebab}
        isFormValid={isFormValid}
        isSaving={isSaving}
      />

      {showModal && (
        <ModalPenyebab
          penyebabBaru={penyebabBaru}
          onClose={() => setShowModal(false)}
          onSave={savePenyebab}
          onChange={handlePenyebabChange}
          kategoriPenyebab={kategoriPenyebab}
          onSubChange={handleSubChange}
          onAddSub={addSubDeskripsi}
          onRemoveSub={hapusSubDeskripsi}
        />
      )}
    </form>
  );
}
