import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
const isConventionalSpecticTank = (tankDimension) => tankDimension === "lbd";

const EditForm = ({ tenantId, applicationData, channelMenu, vehicleMenu, sanitationMenu }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
  const stateId = Digit.ULBService.getStateId();
  const { data: commonFields, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig");
  const { data: preFields, isLoading: isApplicantConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PreFieldsConfig");
  const { data: postFields, isLoading: isTripConfigLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PostFieldsConfig");
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);
  var defaultValues = {
    channel: channelMenu.filter((channel) => channel.code === applicationData.source)[0],
    applicationData: {
      applicantName: applicationData.citizen.name,
      mobileNumber: applicationData.citizen.mobileNumber,
      applicantGender: applicationData.citizen.gender,
    },
    tripData: {
      noOfTrips: applicationData.noOfTrips,
      amountPerTrip: applicationData.additionalDetails.tripAmount !== "null" ? applicationData.additionalDetails.tripAmount : "",
      amount:
        applicationData.additionalDetails.tripAmount !== "null"
          ? applicationData.noOfTrips * applicationData.additionalDetails.tripAmount
          : undefined,
      vehicleType: { capacity: applicationData?.vehicleCapacity },
      vehicleCapacity: applicationData?.vehicleCapacity,
    },
    propertyType: applicationData.propertyUsage.split(".")[0],
    subtype: applicationData.propertyUsage,
    address: {
      pincode: applicationData.address.pincode,
      locality: {
        ...applicationData.address.locality,
        i18nkey: `${applicationData.tenantId.toUpperCase().split(".").join("_")}_REVENUE_${applicationData.address.locality.code}`,
      },
      slum: applicationData.address.slumName,
      street: applicationData.address.street,
      doorNo: applicationData.address.doorNo,
      landmark: applicationData.address.landmark,
    },
    pitType: sanitationMenu.filter((type) => type.code === applicationData.sanitationtype)[0],
    pitDetail: applicationData.pitDetail,
    paymentPreference: applicationData.paymentPreference,
    advanceAmount: applicationData.advanceAmount,
  };

  if (
    (applicationData && applicationData?.address?.additionalDetails?.boundaryType === "Village") ||
    applicationData?.address?.additionalDetails?.boundaryType === "GP"
  ) {
    defaultValues.address = {
      propertyLocation: {
        active: true,
        code: "FROM_GRAM_PANCHAYAT",
        i18nKey: "FROM_GRAM_PANCHAYAT",
        name: "From Gram Panchayat",
      },
      additionalDetails: {
        boundaryType: applicationData?.address?.additionalDetails?.boundaryType,
        gramPanchayat: applicationData?.address?.additionalDetails?.gramPanchayat,
        village: applicationData?.address?.additionalDetails?.village,
      },
    };
  }
  const onFormValueChange = (setValue, formData) => {
    if (
      formData?.propertyType &&
      formData?.subtype &&
      (formData?.address?.locality?.code ||
        (formData?.address?.propertyLocation?.code === "FROM_GRAM_PANCHAYAT" && formData?.address?.gramPanchayat?.code)) &&
      formData?.tripData?.vehicleType &&
      (formData?.tripData?.amountPerTrip || formData?.tripData?.amountPerTrip === 0)
    ) {
      setSubmitValve(true);
      const pitDetailValues = formData?.pitDetail ? Object.values(formData?.pitDetail).filter((value) => value > 0) : null;
      if (formData?.pitType) {
        if (pitDetailValues === null || pitDetailValues?.length === 0) {
          setSubmitValve(true);
        } else if (isConventionalSpecticTank(formData?.pitType?.dimension) && pitDetailValues?.length >= 3) {
          setSubmitValve(true);
        } else if (!isConventionalSpecticTank(formData?.pitType?.dimension) && pitDetailValues?.length >= 2) {
          setSubmitValve(true);
        } else setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  // useEffect(() => {
  //   (async () => {

  //   })();
  // }, [propertyType, subType, vehicle]);

  const onSubmit = (data) => {
    const applicationChannel = data.channel;
    const sanitationtype = data?.pitType?.code;
    const pitDimension = data?.pitDetail;
    const applicantName = data.applicationData.applicantName;
    const mobileNumber = data.applicationData.mobileNumber;
    const pincode = data?.address?.pincode;
    const street = data?.address?.street?.trim();
    const doorNo = data?.address?.doorNo?.trim();
    const slum = data?.address?.slum;
    const landmark = data?.address?.landmark?.trim();
    const noOfTrips = data.tripData.noOfTrips;
    const amount = data.tripData.amountPerTrip;
    const cityCode = data?.address?.city?.code;
    const city = data?.address?.city?.name;
    // const state = data?.address?.city?.state;
    const localityCode = data?.address?.locality?.code;
    const localityName = data?.address?.locality?.name;
    const propertyUsage = data?.subtype;
    const { height, length, width, diameter } = pitDimension;
    const advanceAmount =
      amount === 0
        ? null
        : data?.advancepaymentPreference?.advanceAmount
        ? data?.advancepaymentPreference?.advanceAmount
        : applicationData.advanceAmount;
    const totalAmount = amount * noOfTrips;
    const gramPanchayat = data?.address?.gramPanchayat;
    const village = data?.address?.village;
    const propertyLocation = data?.address?.propertyLocation?.code;

    const formData = {
      ...applicationData,
      sanitationtype: sanitationtype,
      source: applicationChannel.code,
      additionalDetails: {
        ...applicationData.additionalDetails,
        tripAmount: typeof amount === "number" ? JSON.stringify(amount) : amount,
        totalAmount: typeof totalAmount === "number" ? JSON.stringify(totalAmount) : totalAmount,
      },
      propertyUsage,
      vehicleType: data.tripData.vehicleType.type,
      vehicleCapacity: data?.tripData?.vehicleType?.capacity,
      noOfTrips,
      pitDetail: {
        ...applicationData.pitDetail,
        distanceFromRoad: data.distanceFromRoad,
        height,
        length,
        width,
        diameter,
      },
      address: {
        ...applicationData.address,
        tenantId: cityCode,
        landmark,
        doorNo,
        street,
        pincode,
        slumName: slum,
        locality: {
          ...applicationData.address.locality,
          code: localityCode ? localityCode : village?.code ? village?.code : gramPanchayat?.code,
          name: localityName ? localityName : village?.name ? village?.name : gramPanchayat?.name,
        },
        geoLocation: {
          ...applicationData.address.geoLocation,
          latitude: data?.address?.latitude ? data?.address?.latitude : applicationData.address.geoLocation.latitude,
          longitude: data?.address?.longitude ? data?.address?.longitude : applicationData.address.geoLocation.longitude,
        },
        additionalDetails: {
          boundaryType: propertyLocation === "FROM_GRAM_PANCHAYAT" ? (village?.code ? "Village" : "GP") : "Locality",
          gramPanchayat: {
            code: gramPanchayat?.code,
            name: gramPanchayat?.name,
          },
          village: {
            code: village?.code ? village?.code : "",
            name: village?.name ? village?.name : "",
          },
        },
      },
      advanceAmount: typeof advanceAmount === "number" ? JSON.stringify(advanceAmount) : advanceAmount,
    };

    delete formData["responseInfo"];

    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);
    history.replace("/digit-ui/employee/fsm/response", {
      applicationData: formData,
      key: "update",
      action: applicationData?.applicationStatus === "CREATED" ? "SUBMIT" : "SCHEDULE",
    });
  };

  if (isLoading || isTripConfigLoading || isApplicantConfigLoading) {
    return <Loader />;
  }

  const configs = [...preFields, ...commonFields];

  return (
    <FormComposer
      heading={t("ES_TITLE_MODIFY_DESULDGING_APPLICATION")}
      isDisabled={!canSubmit}
      label={applicationData?.applicationStatus != "CREATED" ? t("ES_FSM_APPLICATION_SCHEDULE") : t("ES_FSM_APPLICATION_UPDATE")}
      config={configs
        .filter((i) => !i.hideInEmployee)
        .map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => !a.hideInEmployee),
          };
        })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default EditForm;
