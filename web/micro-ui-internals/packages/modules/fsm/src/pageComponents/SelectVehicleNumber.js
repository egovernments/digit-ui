import React, { useState, useEffect } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectVehicleNumber = ({ t, config, onSelect, formData = {}, userType, id }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [vehicleNoList, setVehicleNoList] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState(formData?.channel);
  const stateCode = Digit.ULBService.getStateId();

  const { isLoading, isSuccess, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: id },
    {
      staleTime: Infinity,
      select: (details) => {
        let { additionalDetails } = details;

        const parseTillObject = (str) => {
          if (typeof str === "object") return str;
          else return parseTillObject(JSON.parse(str));
        };

        additionalDetails = parseTillObject(additionalDetails);
        return { ...details, additionalDetails };
      },
    }
  );

  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(tenantId, { limit: '-1', status: 'ACTIVE' });

  useEffect(() => {
    if (isSuccess && isDsoSuccess && applicationData && applicationData.dsoId) {
      const [dso] = dsoData.filter((dso) => dso.id === applicationData.dsoId);
      const vehicleNoList = dso?.vehicles?.filter((vehicle) => vehicle.capacity == applicationData?.vehicleCapacity);
      setVehicleNoList(vehicleNoList);
    }
  }, [isSuccess, isDsoSuccess]);

  function onChange(value) {
    setVehicleNumber(value);
    onSelect(config.key, value);
  }

  return (
    <Dropdown
      option={vehicleNoList}
      optionKey="registrationNumber"
      id="vehicleNumber"
      selected={config.key}
      select={onChange}
      t={t}
      disable={false}
    />
  ) 
  // : (
  //   <Loader />
  // );
};

export default SelectVehicleNumber;
