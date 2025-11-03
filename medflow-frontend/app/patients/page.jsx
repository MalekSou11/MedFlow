import PatientsList from '../../components/PatientsList';

export default function PatientsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2"><PatientsList /></div>
      <div>
        {/* Left: filtre / create patient (tu peux mettre PatientForm) */}
      </div>
    </div>
  );
}
