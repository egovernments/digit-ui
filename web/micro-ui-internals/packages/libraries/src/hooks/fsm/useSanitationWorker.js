import { FileDesludging } from "../../services/molecules/FSM/FileDesludging";
import { useQuery, useMutation } from "react-query";

const useSanitationWorker = (tenantId, config = {}) => {
  return useMutation((data) => FileDesludging.createSanitationWorker(tenantId, data));
};

export default useSanitationWorker;
