import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useGarimaDetail = (t, tenantId, applicationNos, config = {}, userType) => {
  return useQuery(["FSM_CITIZEN_SEARCH", applicationNos, userType], () => Search.garimaDetails(t, tenantId, applicationNos, userType), config);
};

export default useGarimaDetail;
