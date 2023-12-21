import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown, Card, Header } from "@egovernments/digit-ui-react-components";
import { DustbinIcon } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectGraimaHelper = ({ t, config, onSelect, formData = {}, errors }) => {
	const tenantId = Digit.ULBService.getCurrentTenantId();

	const addExtraHelperDetails = () => {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList.push({
			helperName: "",
			helperId: ""
		})
		onSelect(config.key, { ...formData[config.key], garimaHelperDetails: garimaHelperDetails });
	}

	const removeHelper = (index) => {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList.splice(index, 1);
		onSelect(config.key, { ...formData[config.key], garimaHelperDetails: garimaHelperDetails });

	}

	function setValue(value, input, index) {
		let garimaHelperDetails = formData.garimaHelperDetails;
		garimaHelperDetails.helperList[index][input] = value
		onSelect(config.key, { ...formData[config.key], garimaHelperDetails: garimaHelperDetails });
	}

	if (!formData?.garimaHelperDetails) {
		formData.garimaHelperDetails = {
			helperList: [
				{
					helperName: "",
					helperId: ""
				}

			]
		}
	};

	let inputs = [
		{
			label: "Assign Helper",
			type: "text",
			name: "helperName",
			validation: {
				isRequired: true,
				pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
				title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
			},
			isMandatory: true,
		},
		{
			label: "Add Helper's Mobile Number",
			type: "text",
			name: "helperId",
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
									<h4 style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>{`Helper ${index + 1}`}</h4>
									<div className="pointer tooltip" /* style={{position:"relative"}} */ onClick={()=>{removeHelper(index)}}>
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
				{t("Add Helper")}
			</button>
			
		</div>


	)
	// : (
	//   <Loader />
	// );
};

export default SelectGraimaHelper;
