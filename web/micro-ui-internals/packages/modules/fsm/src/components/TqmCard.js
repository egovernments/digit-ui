import { ArrowRightInbox, ShippingTruck, EmployeeModuleCard, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { checkForEmployee } from "../utils";

const ROLES = {
  plant: ["PQM_TP_OPERATOR"],
  ulb: ["PQM_ADMIN"],
};

const TqmCard = ({ reRoute = true }) => {
  const history = useHistory();
  const isMobile = Digit.Utils.browser.isMobile();
  const isPlantOperatorLoggedIn = Digit.Utils.isPlantOperatorLoggedIn();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  if (!Digit.Utils.tqmAccess()) {
    return null;
  }

  //searching for plants linked to this user

  const userInfo = Digit.UserService.getUser();

  const requestCriteriaPlantUsers = {
    params: {},
    url: "/pqm-service/plant/user/v1/_search",
    body: {
      plantUserSearchCriteria: {
        tenantId,
        // "plantCodes": [],
        plantUserUuids: userInfo?.info?.uuid ? [userInfo?.info?.uuid] : [],
        additionalDetails: {},
      },
      pagination: {},
    },
    config: {
      select: (data) => {
        let userPlants = data?.plantUsers
          ?.map((row) => {
            row.i18nKey = `PQM_PLANT_${row?.plantCode}`;
            return row;
          })
          ?.filter((row) => row.isActive);
        // userPlants.push({i18nKey:"PQM_PLANT_DEFAULT_ALL"})
        Digit.SessionStorage.set("user_plants", userPlants);
        return userPlants;
      },
    },
  };
  // const requestCriteriaPlantUsers = {
  //   params: {},
  //   url: "/pqm-service/plant/user/v1/_search",
  //   body: {
  //     plantUserSearchCriteria: {
  //       tenantId,
  //       // "plantCodes": [],
  //       plantUserUuids: userInfo?.info?.uuid ? [userInfo?.info?.uuid] : [],
  //       additionalDetails: {},
  //     },
  //     pagination: {},
  //   },
  //   config: {
  //     select: (data) => {
  //       let userPlants = data?.plantUsers
  //         ?.map((row) => {
  //           row.i18nKey = `PQM_PLANT_${row?.plantCode}`;
  //           return row;
  //         })
  //         ?.filter((row) => row.isActive);
  //       // userPlants.push({i18nKey:"PQM_PLANT_DEFAULT_ALL"})
  //       Digit.SessionStorage.set("user_plants", userPlants);
  //       return userPlants;
  //     },
  //   },
  // };
  const { isLoading: isLoadingPlantUsers, data: dataPlantUsers } = Digit.Hooks.useCustomAPIHook(requestCriteriaPlantUsers);
  console.log(dataPlantUsers);
  const requestCriteria = {
    url: "/inbox/v2/_search",
    body: {
      inbox: {
        tenantId,
        processSearchCriteria: {
          businessService: ["PQM"],
          moduleName: "pqm",
          tenantId,
        },
        moduleSearchCriteria: {
          tenantId,
        },
        limit: 100,
        offset: 0,
      },
    },
    config: {
      enabled:
        dataPlantUsers?.length > 0
          ? Digit.Utils.didEmployeeHasAtleastOneRole(ROLES.plant) || Digit.Utils.didEmployeeHasAtleastOneRole(ROLES.ulb)
          : false,
    },
  };

  const activePlantCode = Digit.SessionStorage.get("active_plant")?.plantCode
    ? [Digit.SessionStorage.get("active_plant")?.plantCode]
    : Digit.SessionStorage.get("user_plants")
        ?.filter((row) => row.plantCode)
        ?.map((row) => row.plantCode);
  if (activePlantCode?.length > 0) {
    requestCriteria.body.inbox.moduleSearchCriteria.plantCodes = [...activePlantCode];
  }

  const { isLoading, data: tqmInboxData } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  let links = [
    {
      label: t("TQM_INBOX"),
      link: `/tqm-ui/employee/tqm/inbox`,
      roles: [...ROLES.plant, ROLES.ulb],
      count: isLoading ? "-" : tqmInboxData?.totalCount ? String(tqmInboxData?.totalCount) : "0",
    },
    {
      label: t("TQM_VIEW_PAST_RESULTS"),
      link: `/tqm-ui/employee/tqm/search-test-results`,
      roles: [...ROLES.plant, ROLES.ulb],
    },

    {
      label: t("TQM_ADD_TEST_RESULT"),
      link: `/tqm-ui/employee/tqm/add-test-result`,
      roles: [...ROLES.ulb],
    },
  ];
  links = links.filter((link) => (link.roles ? checkForEmployee(link.roles) : true));

  const propsForModuleCard = {
    Icon: <ShippingTruck />,
    moduleName: t("ACTION_TEST_TQM"),
    kpis: [
      {
        count: isLoading ? "-" : tqmInboxData?.totalCount,
        label: t("TQM_KPI_PENDING_TESTS"),
        link: `/tqm-ui/employee/tqm/inbox`,
      },
    ],
    links: links,
  };

  if (isPlantOperatorLoggedIn) {
    delete propsForModuleCard.kpis;
    delete propsForModuleCard.links[2];
  }
  if (reRoute) {
    if (isPlantOperatorLoggedIn()) {
      window.location.href = "/tqm-ui/employee/tqm/landing";
    } else if (isUlbAdminLoggedIn()) {
      window.location.href = "/tqm-ui/employee";
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  return <EmployeeModuleCard {...propsForModuleCard} TqmEnableUrl={true} />;
};

export default TqmCard;
