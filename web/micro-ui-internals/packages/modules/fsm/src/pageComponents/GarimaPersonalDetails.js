import { CardLabel, CardSectionHeader, DatePicker, Dropdown, LabelFieldPair, RadioButtons, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const GarimaPersonalDetails = ({ config, onSelect, formData = {}, userType, id }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const { t } = useTranslation();

  const formConfig = [
    {
      inputs: [
        {
          label: "COMMON_ASSIGN_AS",
          type: "radio",
          name: "assignAs",
          options: [
            {
              active: true,
              code: "GARIMA_DRIVER",
              i18nKey: "GARIMA_DRIVER",
              name: "Driver",
            },
            {
              active: true,
              code: "GARIMA_HELPER",
              i18nKey: "GARIMA_HELPER",
              name: "Helper",
            },
          ],
        },
      ],
    },
    {
      head: "ES_FSM_GARIMA_WORKER_PERSONAL_DETAILS",
      inputs: [
        {
          label: "ES_GARIMA_AADHAR_NUMBER",
          type: "text",
          //   populators: {
          name: "aadharNumber",
          //   },
          //   validation: {
          // isRequired: true,
          // pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
          // title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
          //   },
        },
        {
          label: "ES_GARIMA_WORKER_NAME",
          type: "text",
          //   populators: {
          name: "name",
          //   },
          isMandatory: true,
        },
        {
          label: "ES_GARIMA_WORKER_CONTACT_NO",
          type: "text",
          name: "mobileNumber",
          validation: {
            isRequired: true,
            pattern: "[6-9]{1}[0-9]{9}",
            type: "tel",
            title: "CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID",
            maxLength: 10,
          },
          componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
          isMandatory: true,
        },
        {
          label: "ES_GARIMA_WORKER_DATE_OF_BIRTH",
          type: "date",
          name: "dob",
          isMandatory: true,
        },
        {
          label: "COMMON_GENDER",
          type: "radio",
          name: "applicantGender",
          options: [
            {
              active: true,
              code: "Male",
              i18nKey: "Male",
              name: "Male",
            },
            {
              active: true,
              code: "Female",
              i18nKey: "Female",
              name: "Female",
            },
            {
              active: true,
              code: "Transgender",
              i18nKey: "Transgender",
              name: "Transgender",
            },
          ],
          isMandatory: true,
        },
      ],
    },
  ];

  const setValue = (e) => {
    onSelect(config.key, { ...formData[config.key], [e.target.name]: e.target.value });
  };

  const handleRadio = (value, input) => {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  };

  const handleDate = (value, input) => {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  };

  return (
    <div style={{ margin: "16px" }}>
      {formConfig?.map((section) => (
        <React.Fragment>
          {section?.head ? <CardSectionHeader>{t(section.head)}</CardSectionHeader> : null}
          {section?.inputs?.map((input, index) => (
            <React.Fragment key={index}>
              {input.type === "text" && (
                <React.Fragment>
                  <LabelFieldPair style={!mobileView ? { width: "700px", display: "flex", justifyContent: "space-between" } : {}}>
                    <CardLabel className="card-label-smaller">
                      {t(input.label)}
                      {input.isMandatory ? " * " : null}
                    </CardLabel>
                    <div className="field" style={{ display: "flex", width: "60%" }}>
                      {input.componentInFront ? input.componentInFront : null}
                      <TextInput
                        key={input.name}
                        value={formData && formData[config.key] ? formData[config.key][input.name] : null}
                        onChange={setValue}
                        {...input}
                      />
                    </div>
                  </LabelFieldPair>
                </React.Fragment>
              )}
              {input.type === "date" && (
                <LabelFieldPair style={!mobileView ? { width: "700px", display: "flex", justifyContent: "space-between" } : {}}>
                  <CardLabel className="card-label-smaller">
                    {t(input.label)}
                    {input.isMandatory ? " * " : null}{" "}
                  </CardLabel>
                  <div className="field" style={{ display: "flex", width: "60%" }}>
                    <DatePicker
                      type="date"
                      onChange={(e) => handleDate(e, input.name)}
                      date={formData && formData[config.key] ? formData[config.key][input.name] : null}
                    />
                  </div>
                </LabelFieldPair>
              )}
              {input.type === "radio" && (
                <LabelFieldPair style={!mobileView ? { width: "700px", display: "flex", justifyContent: "space-between" } : {}}>
                  <CardLabel className="card-label-smaller">
                    {t(input.label)}
                    {input.isMandatory ? " * " : null}{" "}
                  </CardLabel>
                  <div className="field" style={{ display: "flex", width: "60%" }}>
                    <RadioButtons
                      selectedOption={formData && formData[config.key] ? formData[config.key][input.name] : null}
                      onSelect={(e) => handleRadio(e, input.name)}
                      style={{ display: "flex", marginBottom: 0 }}
                      innerStyles={{ marginLeft: "10px" }}
                      options={input.options}
                      optionsKey="i18nKey"
                    />
                  </div>
                </LabelFieldPair>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GarimaPersonalDetails;
