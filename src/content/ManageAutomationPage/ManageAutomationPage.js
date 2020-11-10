import React from 'react';
import { Breadcrumb, BreadcrumbItem, Tabs, Tab } from 'carbon-components-react';
import Alerts from '../../components/Alerts/Alerts';

const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};

const ManageAutomationPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width manage-automation-page">
      <div className="bx--row manage-automation-page__banner">
        <div className="bx--col-lg-16">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <a href="/">Manage Automation</a>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div className="bx--row bx--grid--full-width manage-automation-page__r2">
        <div className="bx--col bx--grid--full-width bx--no-gutter">
          <h2 className="manage-automation-page__subheading">
            Reactive Monitoring
          </h2>
        </div>
      </div>
      <div className="bx--row bx--grid--full-width manage-automation-page__r3">
        <div className="bx--col manage-automation-page-alerts">
          <Tabs
            {...props.tabs}
            bx--grid--full-width
            aria-label="Tab navigation">
            <Tab {...props.tab} bx--grid--full-width label="Exceptions">
              <Alerts bx--grid--full-width />
            </Tab>
            <Tab {...props.tab} label="Completed" />
            <Tab {...props.tab} label="Running" />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManageAutomationPage;
