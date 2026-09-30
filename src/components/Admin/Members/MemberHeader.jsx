import { UserPlus } from "lucide-react";
import Button from "../../UI/Button";

function MemberHeader({ onAddMember }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Member Management
        </h1>

        <p className="mt-2 text-gray-400">
          Manage all LOV members.
        </p>
      </div>

      <Button
        onClick={onAddMember}
        className="flex items-center gap-2"
      >
        <UserPlus size={18} />
        Add Member
      </Button>

    </div>
  );
}

export default MemberHeader;