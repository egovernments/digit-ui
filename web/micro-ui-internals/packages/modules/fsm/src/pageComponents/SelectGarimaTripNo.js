import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectGarimaTripNo = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  return (
    <TextInput
      id="vehicleCapacity"
      key="vehicleCapacity"
      value={config?.garimaApplicationData?.noOfTrips ||  "" }
      onChange={""}
      disable={true}
    />
  )
  // : (
  //   <Loader />
  // );
};

export default SelectGarimaTripNo;
