import { FSMService } from "../../elements/FSM";

const GarimaSearchActions = async (garimaData, tenantId) => {
  try {
    const response = await FSMService.searchGarimaDetails(garimaData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default GarimaSearchActions;
