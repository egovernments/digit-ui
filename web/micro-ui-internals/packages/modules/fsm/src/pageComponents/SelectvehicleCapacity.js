import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectVehicleNumber = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  // const { data: channelMenu } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "EmployeeApplicationChannel");
  // const [channel, setChannel] = useState(formData?.channel);

  // function selectChannel(value) {
  //   setChannel(value);
  //   onSelect(config.key, value);
  // }

  return (
    <TextInput
      id="vehicleCapacity"
      key="vehicleCapacity"
      value={config?.garimaApplicationData?.vehicleCapacity || ""}
      onChange={""}
      disable={true}
    />
  )
  // : (
  //   <Loader />
  // );
};

export default SelectVehicleNumber;
