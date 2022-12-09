import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRightInbox,
  ShippingTruck,
  EmployeeModuleCard,
} from "@egovernments/digit-ui-react-components";

const Digit = window.Digit;

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const FSMCard = () => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  const FSM_CREATOR = Digit.UserService.hasAccess("FSM_CREATOR_EMP") || false;
  const isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const isSwachSathiEmployee = Digit.UserService.hasAccess("FSM_SWACHH_SATHI") || false;

  const [total, setTotal] = useState("-");

  // Septage ready for Disposal ( 10 KL)
  // Septage disposed today ( 50 KL)
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const getUUIDFilter = () => {
    if (FSM_EDITOR || FSM_CREATOR || COLLECTOR || FSM_ADMIN)
      return {
        uuid: { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") },
      };
    else
      return {
        uuid: { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") },
      };
  };

  const filters = {
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true,
  };

  const { data: inbox, isFetching: pendingApprovalRefetching } =
    Digit.Hooks.fsm.useInbox(
      tenantId,
      { ...filters, limit: 10, offset: 0, ...getUUIDFilter() },
      {
        enabled: !isFSTPOperator ? true : false,
      }
    );

  useEffect(() => {
    if (inbox) {
      const total = inbox?.totalCount || 0;
      setTotal(total);
    }
  }, [inbox]);

  if (!Digit.Utils.fsmAccess()) {
    return null;
  }

  const config = {
    enabled: isFSTPOperator ? true : false,
    select: (data) => {
      const info = data.vehicleTrip.reduce(
        (info, trip) => {
          const totalVol = trip.tripDetails.reduce(
            (vol, details) => details.volume + vol,
            0
          );
          info[t("ES_READY_FOR_DISPOSAL")] += totalVol / 1000;
          return info;
        },
        { [t("ES_READY_FOR_DISPOSAL")]: 0 }
      );
      info[t("ES_READY_FOR_DISPOSAL")] = `(${
        info[t("ES_READY_FOR_DISPOSAL")]
      } KL)`;
      return info;
    },
  };

  const {
    isLoading,
    data: info,
    isSuccess,
  } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters: { applicationStatus: "WAITING_FOR_DISPOSAL" },
    config,
  });

  const propsForFSTPO = {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_VEHICLE_LOG"),
    links: [
      // {
      //   label: t("ES_COMMON_HOME"),
      //   link: "/digit-ui/employee/fsm/fstp-operations",
      // },
      {
        label: t("ES_FSM_ADD_NEW_BUTTON"),
        link: "/digit-ui/employee/fsm/fstp-add-vehicle",
      },
      {
        label: t("ES_COMMON_INBOX"),
        link: "/digit-ui/employee/fsm/fstp-inbox",
      }
    ],
  };

  if (isFSTPOperator && isSuccess) {
    return <EmployeeModuleCard {...propsForFSTPO} />;
  }

  // const linksForSomeFSMEmployees =
  //   !DSO && !COLLECTOR && !FSM_EDITOR
  //     ? [
  //         {
  //           label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
  //           link: `/digit-ui/employee/fsm/new-application`,
  //         },
  //       ]
  //     : [];

  const propsForModuleCard = isFSTPOperator
    ? {
        Icon: <ShippingTruck />,
        moduleName: t("ES_TITLE_VEHICLE_LOG"),
        
        links: [
          {
            label: t("ES_FSM_ADD_NEW_BUTTON"),
            link: "/digit-ui/employee/fsm/fstp-add-vehicle",
          },
          {
            label: t("ES_COMMON_INBOX"),
            link: "/digit-ui/employee/fsm/fstp-inbox",
          },
        ],
      }
    : isSwachSathiEmployee && FSM_CREATOR
    ? {
        Icon: <ShippingTruck />,
        moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
        links: [
          {
            count: total,
            label: t("ES_TITILE_SEARCH_APPLICATION"),
            link: `/digit-ui/employee/fsm/search`,
          },
          {
            label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
            link: `/digit-ui/employee/fsm/new-application`,
          },
        ],
      }
    : {
        Icon: <ShippingTruck />,
        moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
        kpis: [
          {
            count: total,
            label: t("TOTAL_FSM"),
            link: `/digit-ui/employee/fsm/inbox`,
          },
          {
            label: t("TOTAL_NEARING_SLA"),
            link: `/digit-ui/employee/fsm/inbox`,
          },
        ],
        links: [
          {
            count: total,
            label: t("ES_COMMON_INBOX"),
            link: `/digit-ui/employee/fsm/inbox`,
          },
          {
            label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
            link: `/digit-ui/employee/fsm/new-application`,
          }
        ],
      };

  return <EmployeeModuleCard {...propsForModuleCard} FsmHideCount={true} />;
};
export default FSMCard;
