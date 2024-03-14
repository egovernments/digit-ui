import { FSMService } from "../../elements/FSM";

const GarimaSearchActions = async (garimaData, tenantId) => {
  garimaData = {"garimaId":garimaData};
  try {
    const response = await FSMService.searchGarimaDetails({...garimaData}, tenantId);
    return response?.data;
  } catch (error) {
    // throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default GarimaSearchActions;
