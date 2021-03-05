import React from 'react';

import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { initFSMComponents } from "@egovernments/digit-ui-module-fsm";
import { PaymentModule, PaymentLinks } from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";

const enabledModules = ["PGR", "FSM", "Payment"];
window.Digit.ComponentRegistryService.setupRegistry({
  PGRLinks,
  PGRModule,
  PaymentModule,
  PaymentLinks,
});

initFSMComponents();

const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});

function App() {
  const stateCode = window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>
  }
  return (
    <DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />
  );
}

export default App;
