import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown, Card, Header, Toast } from "@egovernments/digit-ui-react-components";
import { DustbinIcon } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectGraimaHelper = ({ t, config, onSelect, formData = {}, errors }) => {
	const tenantId = Digit.ULBService.getCurrentTenantId();
	const [showToast, setShowToast] = useState(null);

	const {
		isLoading: isDriverLoading,
		isError: isDriverError,
		data: driverData,
		error: driverError,
		mutate,
	} = Digit.Hooks.fsm.useGarimaSearchActions(tenantId);

	const addExtraHelperDetails = () => {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList.push({
			garima_id: "",
			mobile_number: ""
		})
		onSelect(config.key, { ...garimaHelperDetails });
	}

	const removeHelper = (index) => {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList.splice(index, 1);
		onSelect(config.key, { ...garimaHelperDetails });

	}

	const closeToast = () => {
		setShowToast(null);
	  };

	function setValue(value, input, index) {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList[index][input] = value;
		if (input === "garima_id" && value?.length === 9) {
			mutate(value, {
				onError: (error, variables) => {
					setShowToast({ key: "error", action: error });
					setTimeout(closeToast, 50000);
				},
				onSuccess: (data, variables) => {
					Object.keys(data[0]).map((ele)=>{
						garimaHelperDetails.helperList[index][ele] = data[0][ele]
					})
					// garimaHelperDetails.helperList[index].mobile_number = data[0].mobile_number;
					garimaHelperDetails.helperList[index].workerType = "HELPER";
					onSelect(config.key, { ...garimaHelperDetails });

				},
			});
		} else {
			onSelect(config.key, { ...garimaHelperDetails });
		}
	}

	if (!formData?.garimaHelperDetails?.helperList) { //By default adding the helper data
		formData.garimaHelperDetails = {
			helperList: [
				{
					garima_id: "",
					mobile_number: ""
				}

			]
		}
	};

	let inputs = [
		{
			label: "ASSIGN_HELPER",
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
		},
		{
			label: "ADD_HELPER_MOBILE_NUMBER",
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
		},
	]


	return (
		<div>
			<React.Fragment>
				{formData?.garimaHelperDetails?.helperList?.map((input, index) => (
					<React.Fragment key={index}>
						<Card className="garimaHelper_wrapper">
							<React.Fragment>
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<h4 style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>{`${t("FSM_HELPER_LABEL")} ${index + 1}`}</h4>
									<div className="pointer tooltip" /* style={{position:"relative"}} */ onClick={() => { removeHelper(index) }}>
										<div style={{ display: "flex", /* alignItems: "center", */ gap: "0 4px" }}>
											<DustbinIcon />
											<span className="tooltiptext" style={{ position: "absolute", width: "100px", marginLeft: "50%", fontSize: "medium" }}>
												{t("CS_INFO_DELETE")}
											</span>
										</div>
									</div>
								</div>
								{inputs?.map((input, i) => (
									<React.Fragment key={i}>
										{input.type === "text" && (
											<React.Fragment>
												<LabelFieldPair>
													<CardLabel className="card-label-smaller">
														{t(input.label)}
														{input.isMandatory ? " * " : null}
													</CardLabel>
													<div className="field" style={{ display: "flex" }}>
														{input.componentInFront ? input.componentInFront : null}
														<TextInput
															key={input.name}
															value={formData && formData[config.key].helperList[index][input.name]}
															onChange={(e) => setValue(e.target.value, input.name, index)}
															disable={false}
															{...input.validation}
														/>
													</div>
												</LabelFieldPair>
											</React.Fragment>
										)}
									</React.Fragment>
								))}
							</React.Fragment>
						</Card>
					</React.Fragment>
				))}
			</React.Fragment>
			<button className={`unstyled-button link : ""`} type="button" onClick={() => { addExtraHelperDetails() }} disabled={false}>
				{t("ADD_HELPER")}
			</button>
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

export default SelectGraimaHelper;
