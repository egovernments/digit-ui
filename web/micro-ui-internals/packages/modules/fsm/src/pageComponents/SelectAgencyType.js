import { CardLabel, Dropdown, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";

const SelectAgencyType = ({ t, config, onSelect, userType, formData, setValue }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: agencyTypeData } = Digit.Hooks.fsm.useMDMS(stateId, "Vendor", "AgencyType");
  const [agencyType, setAgencyType] = useState({});

  useEffect(() => {
    if (agencyTypeData) {
      const agencyType = agencyTypeData?.filter((agency) => agency?.code === formData?.vendor?.agencyType);
      setAgencyType(...agencyType);
    }
  }, [agencyTypeData]);
  const SelectAgencyType = (type) => {
    setAgencyType(type);
    onSelect(config.key, { ...formData[config.key], agencyType: type });
  };
  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VENDOR_AGENCY_TYPE")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <Dropdown
          className="form-field"
          isMandatory
          selected={agencyType}
          option={agencyTypeData?.sort((a, b) => a.name.localeCompare(b.name))}
          select={SelectAgencyType}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>
    </div>
  );
};

export default SelectAgencyType;
