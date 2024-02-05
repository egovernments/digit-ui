import { useMutation } from "react-query";
import GarimaSearchActions from "../../services/molecules/FSM/GarimaSearchActions";

const useGarimaSearchActions = (tenantId) => {
  console.log("useGarimaSearchActions")
  return useMutation((garimaData) => GarimaSearchActions(garimaData, tenantId));
};

export default useGarimaSearchActions;
