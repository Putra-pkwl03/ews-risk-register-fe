import { useState, useEffect } from "react";
import FormFields from "../../components/IdentifikasiRisk/RiskFormField";
import ModalPenyebab from "../../components/IdentifikasiRisk/ModalPenyebab";
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";
import PenyebabSection from "../../components/IdentifikasiRisk/PenyebabSection";

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

export default function FormRisiko({
  selectedRisk,
  isEditMode,
  onSave,
  onCancel,
}) {
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

  const [showModal, setShowModal] = useState(false);
  const [penyebabBaru, setPenyebabBaru] = useState({
    kategori: "",
    deskripsiUtama: "",
    deskripsiSub: [""],
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && selectedRisk) {
      setFormData({
        klaster: selectedRisk.cluster || "",
        unit: selectedRisk.unit || "",
        namaRisiko: selectedRisk.name || "",
        kategori: selectedRisk.category || "",
        deskripsi: selectedRisk.description || "",
        dampak: selectedRisk.impact || "",
        ucc: selectedRisk.uc_c || "",
        penyebab: Array.isArray(selectedRisk.causes)
          ? selectedRisk.causes.map((c) => ({
              kategori: c.category || "",
              deskripsiUtama: c.main_cause || "",
              deskripsiSub: Array.isArray(c.sub_causes)
                ? c.sub_causes.map((sub) =>
                    typeof sub === "string" ? sub : sub.sub_cause
                  )
                : [],
            }))
          : [],
      });
    } else {
      setFormData({
        klaster: "",
        unit: "",
        namaRisiko: "",
        kategori: "",
        deskripsi: "",
        penyebab: [],
        dampak: "",
        ucc: "",
      });
    }
  }, [isEditMode, selectedRisk]);

  const isFormValid =
    formData.klaster &&
    formData.unit &&
    formData.namaRisiko &&
    formData.kategori &&
    formData.deskripsi &&
    formData.dampak &&
    formData.ucc &&
    formData.penyebab.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPenyebab = () => {
    setPenyebabBaru({ kategori: "", deskripsiUtama: "", deskripsiSub: [""] });
    setShowModal(true);
  };

  const handlePenyebabChange = (key, val) => {
    setPenyebabBaru((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubChange = (index, val) => {
    const updated = [...penyebabBaru.deskripsiSub];
    updated[index] = val;
    setPenyebabBaru((prev) => ({ ...prev, deskripsiSub: updated }));
  };

  const addSubDeskripsi = () => {
    setPenyebabBaru((prev) => ({
      ...prev,
      deskripsiSub: [...prev.deskripsiSub, ""],
    }));
  };

  const hapusSubDeskripsi = (index) => {
    setPenyebabBaru((prev) => ({
      ...prev,
      deskripsiSub: prev.deskripsiSub.filter((_, i) => i !== index),
    }));
  };

  const savePenyebab = () => {
    if (!penyebabBaru.kategori || !penyebabBaru.deskripsiUtama.trim()) {
      setToastMessage("Kategori dan deskripsi penyebab utama wajib diisi.");
      setErrorOpen(true);
      return;
    }

    // langsung tambah penyebabBaru ke formData.penyebab
    setFormData((prev) => ({
      ...prev,
      penyebab: [...prev.penyebab, penyebabBaru],
    }));

    setShowModal(false);
    setPenyebabBaru({ kategori: "", deskripsiUtama: "", deskripsiSub: [] });
  };

  const handleRemovePenyebab = (index) => {
    setFormData((prev) => ({
      ...prev,
      penyebab: prev.penyebab.filter((_, i) => i !== index),
    }));
  };

  // const preparePayload = (data) => ({
  //   cluster: data.klaster,
  //   unit: data.unit,
  //   name: data.namaRisiko,
  //   category: data.kategori,
  //   description: data.deskripsi,
  //   impact: data.dampak,
  //   uc_c: data.ucc === "",
  //   causes: data.penyebab.map((p) => ({
  //     category: p.kategori,
  //     main_cause: p.deskripsiUtama,
  //     sub_causes:
  //       p.deskripsiSub && p.deskripsiSub.length > 0 ? p.deskripsiSub : null,
  //   })),
  // });

  // const preparePayload = (data) => ({
  //   cluster: data.klaster,
  //   unit: data.unit,
  //   name: data.namaRisiko,
  //   category: data.kategori,
  //   description: data.deskripsi,
  //   impact: data.dampak,
  //   uc_c: data.ucc === "",
  //   causes: data.penyebab.map((p) => ({
  //     category: p.kategori,
  //     main_cause: p.deskripsiUtama,
  //     sub_causes:
  //       p.deskripsiSub && p.deskripsiSub.length > 0 ? p.deskripsiSub : null,
  //   })),
  // });

  

  // Fungsi untuk transform data formData ke payload backend
  function preparePayload(data) {
    return {
      cluster: data.klaster,
      unit: data.unit,
      name: data.namaRisiko,
      category: data.kategori,
      description: data.deskripsi,
      impact: data.dampak,
      uc_c: data.ucc === "C" ? 1 : 0,
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
  
  // function preparePayload(data) {
  //   return {
  //     cluster: data.klaster,
  //     unit: data.unit,
  //     name: data.namaRisiko,
  //     category: data.kategori,
  //     description: data.deskripsi,
  //     impact: data.dampak,
  //     uc_c: data.ucc === "",
  //     causes: Array.isArray(data.penyebab)
  //       ? data.penyebab.map((p) => ({
  //           category: p.kategori,
  //           main_cause: p.deskripsiUtama,
  //           sub_causes:
  //             Array.isArray(p.deskripsiSub) && p.deskripsiSub.length > 0
  //               ? p.deskripsiSub
  //               : null, 
  //         }))
  //       : [],
  //   };
  // }

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
      const saved = await onSave(payload, isEditMode ? selectedRisk?.id : null);
      if (saved) {
        setToastMessage("Data risiko berhasil disimpan.");
        setSuccessOpen(true);
        onCancel();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Terjadi kesalahan saat menyimpan.");
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

      {/* <PenyebabSection
        penyebabList={formData.penyebab}
        onAdd={handleAddPenyebab}
        onRemove={handleRemovePenyebab}
        // hapus onEdit karena fitur edit dihilangkan
        isEditMode={false}
        onEdit={handleEditPenyebab}
        isEditMode={isEditMode}
      /> */}

      <FormFields
        formData={formData}
        handleChange={handleChange}
        unitsByKlaster={unitsByKlaster}
        kategoriOptions={kategoriOptions}
        onCancel={onCancel}
        handleAddPenyebab={handleAddPenyebab}
        handleRemovePenyebab={handleRemovePenyebab}
        isFormValid={isFormValid}
        isSaving={isSaving}
        isEdit={!!selectedRisk}
      />

      {showModal && (
        <ModalPenyebab
          penyebabBaru={penyebabBaru}
          onClose={() => {
            setShowModal(false);
          }}
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
