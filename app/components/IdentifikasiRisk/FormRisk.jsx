import { useState, useEffect } from "react";
import FormFields from "../../components/IdentifikasiRisk/RiskFormField";
import ModalPenyebab from "../../components/IdentifikasiRisk/ModalPenyebab";
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";
import PenyebabSection from "../../components/IdentifikasiRisk/PenyebabSection";

const unitsByKlaster = {
  Management: [
    "Administration",
    "Resource Management",
    "Health Center Management",
    "Quality & Safety Management",
    "Networking Management",
    "Health Information Systems",
    "PWS Dashboard",
  ],
  "Maternal & Child": [
    "Pregnancy, Delivery, Postpartum",
    "Infants and Preschool Children",
    "School-age Children and Adolescents",
  ],
  "Adults & Elderly": ["Adults", "Elderly"],
  "Communicable Disease Control": ["Environmental Health", "Surveillance"],
  "Cross Cluster": ["Emergency", "Inpatient", "Laboratory", "Pharmacy"],
};

const kategoriOptions = [
  "Finance",
  "Policy",
  "Compliance",
  "Legal",
  "Fraud",
  "Reputation",
  "Operational",
];

const kategoriPenyebab = ["man", "machine", "material", "method", "environment"];

export default function FormRisk({ selectedRisk, isEditMode, onSave, onCancel }) {
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
  const [penyebabBaru, setPenyebabBaru] = useState({ kategori: "", deskripsiUtama: "", deskripsiSub: [""] });
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
    setShowModal(true);
  };

  const handlePenyebabChange = (key, val) => {
    setPenyebabBaru((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubChange = (index, val) => {
    const newSub = [...penyebabBaru.deskripsiSub];
    newSub[index] = val;
    setPenyebabBaru((prev) => ({ ...prev, deskripsiSub: newSub }));
  };

  const addSubDeskripsi = () => {
    setPenyebabBaru((prev) => ({ ...prev, deskripsiSub: [...prev.deskripsiSub, ""] }));
  };

  const hapusSubDeskripsi = (index) => {
    setPenyebabBaru((prev) => {
      const newSub = [...prev.deskripsiSub];
      newSub.splice(index, 1);
      return { ...prev, deskripsiSub: newSub };
    });
  };

  const savePenyebab = () => {
    if (!penyebabBaru.kategori || !penyebabBaru.deskripsiUtama) return;
    setFormData((prev) => ({ ...prev, penyebab: [...prev.penyebab, penyebabBaru] }));
    setPenyebabBaru({ kategori: "", deskripsiUtama: "", deskripsiSub: [""] });
    setShowModal(false);
  };

  const handleRemovePenyebab = (index) => {
    const copy = [...formData.penyebab];
    copy.splice(index, 1);
    setFormData((prev) => ({ ...prev, penyebab: copy }));
  };

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
            sub_causes: Array.isArray(p.deskripsiSub) && p.deskripsiSub.length > 0 ? p.deskripsiSub : null,
          }))
        : [],
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setToastMessage("Please complete all required fields.");
      setErrorOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const payload = preparePayload(formData);
      await onSave(payload, selectedRisk?.id || null);
      setToastMessage("Risk saved successfully.");
      setSuccessOpen(true);
    } catch (err) {
      setToastMessage(err.message || "Failed to save risk.");
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
