import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectGraimaDriver = ({ t, config, onSelect, formData = {}, errors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  
  let inputs = [
    {
      label: "Assign Driver",
      type: "text",
      name: "garimaDriverName",
      validation: {
        isRequired: true,
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    },
    {
      label: "Add Driver's Mobile Number",
      type: "text",
      name: "garimaDriverMobileNumber",
      validation: {
        isRequired: true,
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
      },
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      isMandatory: true,
    },
  ]

  const setValue = (value, input) =>{
    let garimaDriverDetails = formData.garimaDriverDetails || {};
    garimaDriverDetails[input] = value;
    onSelect(config.key, { ...formData[config.key], garimaDriverDetails: garimaDriverDetails });
    if (input === "garimaDriverName" && value?.length === 9){
      config.searchGarimaWorkerDetails(value)
    }
      
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {input.type === "text" && (
            <React.Fragment>
              {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">
                  {t(input.label)}
                  {input.isMandatory ? " * " : null}
                </CardLabel>
                <div className="field" style={{ display: "flex" }}>
                  {input.componentInFront ? input.componentInFront : null}
                  <TextInput
                    key={input.name}
                    value={formData && formData[config.key] ? formData[config.key][input.name] : null}
                    onChange={(e)=>setValue(e.target.value, input.name)}
                    disable={false}
                    {...input.validation}
                  />
                </div>
              </LabelFieldPair>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </div>


  )
  // : (
  //   <Loader />
  // );
};

export default SelectGraimaDriver;
