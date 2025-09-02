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
        data {
          label
        }
        position {
          x
          y
        }
        type
      }
      relationships {
        id
        source
        target
        type
        data {
          label
        }
      }
      viewport {
        x
        y
        zoom
      }
    }
  }
`;
