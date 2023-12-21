import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const AddSaniationWorker = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { pathname: url } = useLocation();

  return (
    <h2>{"Register New Saniation Woker"}</h2>
  ) 
  
};

export default AddSaniationWorker;
