import { useAuth } from "../../context/AuthContext";

const VerifiedBadge = () => {
  const { isVerifiedAlumni } = useAuth();

  if (!isVerifiedAlumni) {
    return null;
  }

  return (
    <span className="text-green-600 font-semibold text-sm">Verified ✔️</span>
  );
};

export default VerifiedBadge;
