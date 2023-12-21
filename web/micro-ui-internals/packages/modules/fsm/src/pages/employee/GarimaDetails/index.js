import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import { FormComposer, Loader, Header } from "@egovernments/digit-ui-react-components";
import { set } from "lodash";


const GarimaDetails = (props) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    let { id: applicationNumber } = useParams();
    const stateCode = Digit.ULBService.getStateId();
    const [ garimaApplicationData, setGarimaApplicatinData ] = useState("")


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

    const onSubmit = (data) => {
        console.log("DATA SUBMITTED")
    };

    useEffect(()=>{
        setGarimaApplicatinData(applicationData)
    },[isSuccess]) 
    

    const onFormValueChange = (setValue, formData) => {
        // console.log(formData,"VALUE CHANGED")
    };

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
                    "garimaApplicationData": garimaApplicationData
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
            head: "Assign Saniation Worker",
            body: [
                {
                    "type": "component",
                    "key": "garimaDriverDetails",
                    "component": "SelectGraimaDriver",
                    "withoutLabel": true
                },
                {
                    "isMandatory": true,
                    "type": "component",
                    "key": "garimaHelperDetails",
                    "component": "SelectGraimaHelper",
                    "withoutLabel": true
                },
                {
                    "label": "Can't find the saniation worker?",
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
            <Header style={{ marginBottom: "16px" }}>{"Assign Vehicle and Sanitation Worker"}</Header>
            <FormComposer
                isDisabled={true}
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
            
        </React.Fragment>
    );
};

export default GarimaDetails;
