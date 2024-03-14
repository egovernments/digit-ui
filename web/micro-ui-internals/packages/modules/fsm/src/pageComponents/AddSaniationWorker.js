import React, { useEffect, useState } from "react";
import { FormComposer, Loader, Modal, Toast } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
// import { SanitationWorkerConfig } from "../pages/employee/configs/AddSanitationWorkerConfig";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import GarimaPersonalDetails from "./GarimaPersonalDetails";
import { useQueryClient } from "react-query";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const popupActionBarStyles = {
  boxShadow: "0 -2px 8px rgb(0 0 0 / 16%)",
  maxWidth: "480px",
  zIndex: "100",
  left: "0",
  bottom: "0",
  width: "100%",
  backgroundColor: "rgba(255, 255, 255)",
  padding: "8px",
  position: "fixed",
  textAlign: "right",
  display: "flex",
  justifyContent: "space-around",
};

const AddSaniationWorker = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);
  const mutation = Digit.Hooks.fsm.useSanitationWorker(tenantId);

  useEffect(() => {
    // setModalConfig(SanitationWorkerConfig());
  }, []);

  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {  //Emptying the modals values on close of modal
    let addSaniationWorker = formData?.addSaniationWorker;
    addSaniationWorker = {};
    onSelect(config.key, { ...addSaniationWorker  });
    setShowModal(false);
  };

  const onSuccess = () => {
    queryClient.clear();
    setMutationHappened(true);
  };

  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || error?.message || "ERROR");
    setMutationHappened(true);
  };

  function onSubmit() {
    const addSaniationWorker = formData?.addSaniationWorker;
    console.log(addSaniationWorker,"addSaniationWorker")
    if (addSaniationWorker?.assignAs?.code && addSaniationWorker?.name && addSaniationWorker?.dob && addSaniationWorker?.mobileNumber && addSaniationWorker?.applicantGender?.code) {
      const createPayload = {
        sanitationWorker: {
          name: addSaniationWorker?.name,
          dob: addSaniationWorker?.dob,
          gender: addSaniationWorker?.applicantGender?.code,
          mobile_number: addSaniationWorker?.mobileNumber,
          city_id: 2,
          district_id: 2,
        },
      };
      mutation.mutate(createPayload, {
        onError: (error, variables) => {
          // console.log(error?.response?.data?.errors[Object.keys(error?.response?.data?.errors)[0]][0],"errrrrr ee1")
          // console.log(error?.response?.data?.Errors[0].messag,"errrrrr ee2")
          let errorMSg = error?.response?.data?.errors[Object.keys(error?.response?.data?.errors)[0]][0];
          setShowToast({ key: "error", action: errorMSg || "Something Went Wrong" });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data) => {
          if (formData?.addSaniationWorker?.assignAs?.code === "GARIMA_DRIVER") { //Condition for checking and adding garima values for respective person
            Object.keys(data?.sanitationWorker).map((item)=>{
              formData.garimaDriverDetails[item] = data.sanitationWorker[item];
            })
            formData.garimaDriverDetails.workerType = "DRIVER";
            onSelect("garimaDriverDetails", { ...formData.garimaDriverDetails  });
          } else {
            let garimaHelperDetails = formData.garimaHelperDetails;
            let garimaHelperFlag = false;
            garimaHelperDetails.helperList.map((ele, index) => {
              if (!ele.garima_id) {
                Object.keys(data?.sanitationWorker).map((item)=>{
                  ele[item] = data.sanitationWorker[item];
                })
                ele.workerType = "HELPER";
                garimaHelperFlag = true;
              }
            })
            if (!garimaHelperFlag) {
              let tempData = {
                workerType : "HELPER"
              };
              Object.keys(data?.sanitationWorker).map((item)=>{
                tempData[item] = data.sanitationWorker[item];
              })
              garimaHelperDetails.helperList.push(tempData)
            }
            onSelect("garimaHelperDetails", { ...formData.garimaHelperDetails });
          }
          closeModal();
        },
      });
    }else {
      setShowToast({ key: "error", action: "CR_REQUIRED_FIELDS_ERROR_MSG" });
      setTimeout(closeToast, 5000);
    }
  }

  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <div>
      <h4 className="link" onClick={() => handleClick()}>
        {t("REGISTER_NEW_SANITATION_WORKER")}
      </h4>
      {showModal ? (
        <Modal
          popupStyles={mobileView ? { height: "fit-content", minHeight: "100vh" } : { height: "fit-content", width: "800px" }}
          headerBarMain={<Heading label={t("FSM_REGISTER_AND_ASSIGN_NEW_SANITION_WORKER")} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelLabel={t("Cancel")}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t("Register And Assign")}
          actionSaveOnSubmit={onSubmit}
          formId="modal-action"
          // isDisabled={!formValve}
          popupModuleMianStyles={mobileView ? { paddingBottom: "60px" } : {}}
          popupModuleActionBarStyles={mobileView ? popupActionBarStyles : {}}
        >
          <GarimaPersonalDetails config={config} onSelect={onSelect} formData={formData}></GarimaPersonalDetails>
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={showToast.action}
              onClose={closeToast}
            />
          )}
        </Modal>
      ) : null}
    </div>
  );
};

export default AddSaniationWorker;
