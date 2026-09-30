import { UserCheck } from "lucide-react";
import Button from "../../UI/Button";

function PendingHeader({
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Pending Users
        </h1>

        <p className="mt-2 text-gray-400">
          Review and approve new LOV registrations.
        </p>
      </div>

      <Button
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <UserCheck size={18} />
        Refresh
      </Button>

    </div>
  );
}

export default PendingHeader;