import React, { useEffect, useState } from "react";
import { FormComposer, Loader, Modal } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { SanitationWorkerConfig } from "../pages/employee/GarimaDetails/config/AddSanitationWorkerConfig";
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

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);
  const mutation = Digit.Hooks.fsm.useSanitationWorker(tenantId);

  useEffect(() => {
    setModalConfig(SanitationWorkerConfig());
  }, []);

  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const onSuccess = () => {
    queryClient.clear();
    setMutationHappened(true);
    // window.history.replaceState({}, "FSM_CREATE_RESPONSE");
  };

  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || error?.message || "ERROR");
    setMutationHappened(true);
  };
  function onSubmit() {
    const addSaniationWorker = formData?.addSaniationWorker;
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
    console.log(createPayload, "createPayload");
    mutation.mutate(createPayload, {
      onError,
      onSuccess,
    });
  }

  return (
    <div>
      <h4 className="link" onClick={() => handleClick()}>
        {t("REGISTER_NEW_SANITATION_WORKER")}
      </h4>
      {showModal ? (
        <Modal
          popupStyles={mobileView ? { height: "fit-content", minHeight: "100vh" } : { height: "fit-content", width: "800px" }}
          headerBarMain={<Heading label={t(modalConfig.label.heading)} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelLabel={t(modalConfig.label.cancel)}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t(modalConfig.label.submit)}
          actionSaveOnSubmit={onSubmit}
          formId="modal-action"
          // isDisabled={!formValve}
          popupModuleMianStyles={mobileView ? { paddingBottom: "60px" } : {}}
          popupModuleActionBarStyles={mobileView ? popupActionBarStyles : {}}
        >
          <GarimaPersonalDetails config={config} onSelect={onSelect} formData={formData}></GarimaPersonalDetails>
        </Modal>
      ) : null}
    </div>
  );
};

export default AddSaniationWorker;
