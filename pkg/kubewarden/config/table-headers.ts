import { AGE, STATE, NAME as NAME_HEADER } from '@shell/config/table-headers';

import { createKubewardenRoute } from '../utils/custom-routing';
import { KUBEWARDEN } from '../types';

export const ADMISSION_POLICY_STATE = {
  name:      'policyStatus',
  sort:      ['stateSort', 'nameSort'],
  value:     'status.policyStatus',
  label:     'Status',
  width:     100,
  formatter: 'PolicyStatus',
};

export const ADMISSION_POLICY_MODE = {
  name:      'mode',
  label:     'Mode',
  value:     'spec.mode',
  formatter: 'PolicyMode'
};

export const ADMISSION_POLICY_RESOURCES = {
  name:      'resources',
  label:     'Resources',
  value:     'spec.rules',
  formatter: 'PolicyResources'
};

export const ADMISSION_POLICY_OPERATIONS = {
  name:      'operations',
  label:     'Operations',
  value:     'spec.rules',
  formatter: 'PolicyResources'
};

export const RELATED_POLICY_SUMMARY = {
  name:      'summary',
  label:     'Policies',
  value:     'allRelatedPolicies.length',
  sort:      false,
  search:    false,
  formatter: 'PolicySummaryGraph'
};

export const RELATED_HEADERS = [
  ADMISSION_POLICY_STATE,
  {
    name:          'name',
    labelKey:      'tableHeaders.name',
    value:         'metadata.name',
    getValue:      (row: any) => row.metadata.name,
    sort:          ['nameSort'],
    formatter:     'LinkDetail',
    canBeVariable: true,
  },
  ADMISSION_POLICY_MODE,
  ADMISSION_POLICY_RESOURCES,
  ADMISSION_POLICY_OPERATIONS,
  {
    name:      'psCreated',
    label:     'Created',
    value:     'metadata.creationTimestamp',
    formatter: 'LiveDate'
  }
];

export const POLICY_SERVER_HEADERS = [
  STATE,
  {
    name:          'name',
    labelKey:      'tableHeaders.name',
    value:         'nameDisplay',
    sort:          ['nameSort'],
    formatter:     'PolicyServerDeployment',
    canBeVariable: true,
  },
  {
    name:          'kubewardenPolicyServers',
    label:         'Image',
    value:         'spec.image',
    formatterOpts: {
      options: { internal: true },
      to:      {
        name:   'c-cluster-product-resource-id',
        params: { resource: KUBEWARDEN.POLICY_SERVER }
      }
    },
  },
  RELATED_POLICY_SUMMARY,
  AGE
];

export const POLICY_HEADERS = [
  ADMISSION_POLICY_STATE,
  NAME_HEADER,
  ADMISSION_POLICY_MODE,
  {
    name:  'capPolicyServer',
    label: 'Policy Server',
    value: 'spec.policyServer'
  },
  ADMISSION_POLICY_RESOURCES,
  ADMISSION_POLICY_OPERATIONS,
  AGE
];

export const DASHBOARD_HEADERS = [
  {
    isEnabled:   true,
    isLoaded:    true,
    icon:        'icon-question-mark',
    cta:         createKubewardenRoute('c-cluster-product-resource-create', { resource: KUBEWARDEN.POLICY_SERVER }),
    link:        createKubewardenRoute('c-cluster-product-resource', { resource: KUBEWARDEN.POLICY_SERVER }),
    linkText:    'kubewarden.dashboard.headers.policyServer.linkText',
    description: 'kubewarden.dashboard.headers.policyServer.description',
    slotTitle:   'kubewarden.dashboard.headers.policyServer.slotTitle',
    title:       'kubewarden.dashboard.headers.policyServer.title'
  },
  {
    isEnabled:   true,
    isLoaded:    true,
    icon:        'icon-question-mark',
    cta:         createKubewardenRoute('c-cluster-product-resource-create', { resource: KUBEWARDEN.ADMISSION_POLICY }),
    link:        createKubewardenRoute('c-cluster-product-resource', { resource: KUBEWARDEN.ADMISSION_POLICY }),
    linkText:    'kubewarden.dashboard.headers.admissionPolicy.linkText',
    description: 'kubewarden.dashboard.headers.admissionPolicy.description',
    slotTitle:   'kubewarden.dashboard.headers.admissionPolicy.slotTitle',
    title:       'kubewarden.dashboard.headers.admissionPolicy.title'
  },
  {
    isEnabled:   true,
    isLoaded:    true,
    icon:        'icon-question-mark',
    cta:         createKubewardenRoute('c-cluster-product-resource-create', { resource: KUBEWARDEN.CLUSTER_ADMISSION_POLICY }),
    link:        createKubewardenRoute('c-cluster-product-resource', { resource: KUBEWARDEN.CLUSTER_ADMISSION_POLICY }),
    linkText:    'kubewarden.dashboard.headers.clusterAdmissionPolicy.linkText',
    description: 'kubewarden.dashboard.headers.clusterAdmissionPolicy.description',
    slotTitle:   'kubewarden.dashboard.headers.clusterAdmissionPolicy.slotTitle',
    title:       'kubewarden.dashboard.headers.clusterAdmissionPolicy.title'
  }
];

export const TRACE_HEADERS = [
  {
    name:  'operation',
    value: 'operation',
    label: 'Operation',
    sort:  'operation'
  },
  {
    name:  'mode',
    value: 'mode',
    label: 'Mode',
    sort:  'mode'
  },
  {
    name:  'kind',
    value: 'kind',
    label: 'Kind',
    sort:  'kind'
  },
  {
    name:  'name',
    value: 'name',
    label: 'Name',
    sort:  'name'
  },
  {
    name:  'namespace',
    value: 'namespace',
    label: 'Namespace',
    sort:  'namespace'
  },
  {
    name:  'startTime',
    value: 'startTime',
    label: 'Start Time',
    sort:  'startTime:desc'
  },
  {
    name:  'duration',
    value: 'duration',
    label: 'Duration (ms)',
    sort:  'duration'
  }
];

export const RULE_HEADERS = [
  {
    name:  'apiGroups',
    value: 'apiGroups',
    label: 'API Groups',
    sort:  'apiGroups'
  },
  {
    name:  'apiVersions',
    value: 'apiVersions',
    label: 'API Versions',
    sort:  'apiVersions'
  },
  {
    name:  'operations',
    value: 'operations',
    label: 'Operations',
    sort:  'operations'
  },
  {
    name:  'resources',
    value: 'resources',
    label: 'Resources',
    sort:  'resources'
  },
];