import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import { FormComposer, Loader, Header, Toast } from "@egovernments/digit-ui-react-components";
import { set } from "lodash";
import { Link, useHistory, useParams } from "react-router-dom";


const GarimaDetails = (props) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    let { id: applicationNumber } = useParams();
    const stateCode = Digit.ULBService.getStateId();
    const [ garimaApplicationData, setGarimaApplicatinData ] = useState("");
    const [ garimaDriverData, setGarimaDriverData ] = useState([])
    const [showToast, setShowToast] = useState(null);
    const history = useHistory();


    const { data: vehicleList, isLoading: isVehicleData, isSuccess: isVehicleDataLoaded } = Digit.Hooks.fsm.useMDMS(
        stateCode,
        "Vehicle",
        "VehicleType",
        { staleTime: Infinity }
    );

    const { isLoading: isDataLoading, isSuccess, data: applicationData } = Digit.Hooks.fsm.useSearch(
        tenantId,
        { applicationNos: applicationNumber },
        { staleTime: Infinity }
    );

    const {
        isLoading: isDriverLoading,
        isError: driverUpdateError,
        data: updateDriverResponse,
        error: updateDriverError,
        mutate: mutateDriver,
    } = Digit.Hooks.fsm.useApplicationUpdate(tenantId);

    

    // const {
    //     isLoading: isDriverLoading,
    //     isError: isDriverError,
    //     data: driverData,
    //     error: driverError,
    //     mutate,
    // } = Digit.Hooks.fsm.useGarimaSearchActions(tenantId);

    const onSubmit = (data) => {
        let sanitationDetails = [data.garimaDriverDetails,...data.garimaHelperDetails.helperList];
        
        const createPayload = {
            "fsm":{
                ...applicationData,
                sanitationWorker:sanitationDetails,
                vehicleId: data.vehicleNumber.id,
            },
            "workflow": {
                "action": "DSO_ACCEPT"
            },
            
        };
        mutateDriver(createPayload, {
            onError: (error, variables) => {
              setShowToast({ key: "error", action: error?.response?.data?.Errors[0].message});
              setTimeout(closeToast, 5000);
            },
            onSuccess: (data, variables) => {
                setShowToast({ key: "success", action: "CS_COMMON_TRACK_APPLICATION_TEXT"});
                history.push("/digit-ui/employee/fsm/application-details/" + applicationNumber)
            },
        });
    };

    const closeToast = () => {
		setShowToast(null);
	};

    useEffect(()=>{
        setGarimaApplicatinData(applicationData)
    },[isSuccess]) 
    

    const onFormValueChange = (setValue, formData) => {
    };
    
    // const searchGarimaWorkerDetails = (data, configKey, formData, onSelect) => {
    //     mutate(data, {
    //       onError: (error, variables) => {
    //         setShowToast({ key: "error", action: error });
    //         setTimeout(closeToast, 5000);
    //       },
    //       onSuccess: (data, variables) => {
    //         setGarimaDriverData (data)
    //         let garimaDriverDetails = formData.garimaDriverDetails || {};
    //         garimaDriverDetails.garimaDriverMobileNumber = data[0].mobile_number;
    //         garimaDriverDetails.garimaDriverName =  `P${data[0].garima_id}`;
    //         onSelect(configKey, { ...formData[configKey], garimaDriverDetails: garimaDriverDetails });
    //       },
    //     });
    // };

    const configs = [
        {
            head: "ES_FSM_DSO_ACCEPT",
            body: [
                {
                    "label": "ES_FSM_REGISTRY_INBOX_VEHICLE_NAME",
                    "isMandatory": true,
                    "type": "component",
                    "key": "vehicleNumber",
                    "component": "SelectVehicleNumber",
                },
                {
                    "label": "ES_APPLICATION_DETAILS_VEHICLE_CAPACITY",
                    "isMandatory": true,
                    "type": "component",
                    "key": "vehicleCapacity",
                    "component": "SelectvehicleCapacity",
                    "garimaApplicationData": garimaApplicationData,
                    
                },
                {
                    "label": "ES_APPLICATION_DETAILS_PAYMENT_NO_OF_TRIPS",
                    "isMandatory": true,
                    "type": "component",
                    "key": "tripNumber",
                    "component": "SelectGarimaTripNo",
                    "garimaApplicationData": garimaApplicationData
                }

            ]
        },
        {
            head: "ASSIGN_SANIATION_WORKER",
            body: [
                {
                    "type": "component",
                    "key": "garimaDriverDetails",
                    "component": "SelectGraimaDriver",
                    "withoutLabel": true,
                    // "searchGarimaWorkerDetails": searchGarimaWorkerDetails,
                    // "garimaDriverData": garimaDriverData
                },
                {
                    "isMandatory": true,
                    "type": "component",
                    "key": "garimaHelperDetails",
                    "component": "SelectGraimaHelper",
                    "withoutLabel": true,
                    // "searchGarimaWorkerDetails": searchGarimaWorkerDetails,
                },
                {
                    "label": "FSM_ADD_NEW_SANIATION_WORKER_LABEL",
                    "isMandatory": true,
                    "type": "component",
                    "key": "addSaniationWorker",
                    "component": "AddSaniationWorker",
                }

            ]
        }
    ];

    

    return (
        <React.Fragment>
            <Header style={{ marginBottom: "16px" }}>{t("FSM_ASSIGN_VEHICLE_AND_SANITATION_WORKER")}</Header>
            <FormComposer
                isDisabled={false}
                label={t("ES_COMMON_APPLICATION_SUBMIT")}
                config={configs
                    .filter((i) => !i.hideInEmployee)
                    .map((config) => {
                        return {
                            ...config,
                            body: config.body.filter((a) => !a.hideInEmployee),
                        };
                    })}
                fieldStyle={{ marginRight: 0 }}
                formCardStyle={true}
                onSubmit={onSubmit}
                // defaultValues={defaultValues}
                onFormValueChange={onFormValueChange}
                noBreakLine={true}
                fms_inline
            />
            {showToast && (
				<Toast
					error={showToast.key === "error" ? true : false}
					label={t(showToast.key === "success" ? showToast.action : `ES_FSM_RESPONSE_SUBMIT_DISPLAY_ERROR`)}
					onClose={closeToast}
				/>
			)}
        </React.Fragment>
    );
};

export default GarimaDetails;
