import React, { useState, useEffect } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown, Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectGraimaDriver = ({ t, config, onSelect, formData = {}, errors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);

  const [inputs, setInputs] = useState([{
    label: "ASSIGN_DRIVER",
    type: "text",
    name: "garima_id",
    validation: {
      isRequired: true,
      pattern: "^[A-Za-z][0-9]{8}$",
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      maxlength: "9",
      minlength: "9",
    },
    isMandatory: true,
    value:""
  },
    {
      label: "ADD_DRIVER_MOBILE_NUMBER",
      type: "text",
      name: "mobile_number",
      validation: {
        isRequired: true,
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
      },
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      isMandatory: true,
      value:""
    }
  ]);

  const {
    isLoading: isDriverLoading,
    isError: isDriverError,
    data: driverData,
    error: driverError,
    mutate,
  } = Digit.Hooks.fsm.useGarimaSearchActions(tenantId);

  const setValue = async (value, input) => {
    let garimaDriverDetails = formData.garimaDriverDetails || {};
    garimaDriverDetails[input] = value;
    if (input === "garima_id" && value?.length === 9) {
      mutate(value, {
        onError: (error, variables) => { //Removing the values if error is found
          formData.garimaDriverDetails = {};
          let driverInputs = inputs;
          driverInputs[0].value = "";
          driverInputs[1].value = "";
          setInputs(driverInputs);
          onSelect("garimaDriverDetails", { ...formData.garimaDriverDetails  });
          setShowToast({ key: "error", action: error });
          setTimeout(closeToast, 50000);
        },
        onSuccess: (data, variables) => {
          Object.keys(data[0]).map((ele)=>{
            garimaDriverDetails[ele] = data[0][ele]
          })
          garimaDriverDetails.workerType = "DRIVER"; 
          
          onSelect(config.key, { ...garimaDriverDetails });
          let driverInputs = inputs;
          driverInputs[0].value = value;
          driverInputs[1].value = data[0].mobile_number;
          setInputs(driverInputs)
        },
      });

    }else{
      let driverInputs = inputs;
      input === "garima_id" ? driverInputs[0].value = value : driverInputs[1].value = value;
      setInputs(driverInputs)
      onSelect(config.key, { ...garimaDriverDetails });
    }
  }

  const closeToast = () => {
    setShowToast(null);
  };

  const showDriverNumber = (input) =>{ //Check the conditon to show the driver mobile number
    if (input.name === "garima_id"){
      return true
    }else{
      if (input.value || formData?.garimaDriverDetails?.mobile_number){
        return true
      }else {
        return false
      }
    }
  }

  console.log(formData,"formData");

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {input.type === "text" && showDriverNumber(input) && (
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
                    value={input.value || formData && formData[config.key] ? formData[config.key][input.name] : null}
                    onChange={(e) => setValue(e.target.value, input.name)}
                    disable={false}
                    {...input.validation}
                  />
                </div>
              </LabelFieldPair>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? showToast.action : `COMMON_NO_RESULTS_FOUND`)}
          onClose={closeToast}
        />
      )}
      
    </div>


  )
  
};

export default SelectGraimaDriver;
