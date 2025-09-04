import { gql } from "@apollo/client";

export const SAVE_FLOW = gql`
  mutation SaveFlow($flowData: FlowDataInput!) {
    saveFlow(flowData: $flowData)
  }
`;

export const RESTORE_FLOW = gql`
  query RestoreFlow {
    restoreFlow {
      nodes {
        id
        label
        position {
          x
          y
        }
      }
      relationships {
        id
        source
        target
        label
      }
    }
  }
`;
