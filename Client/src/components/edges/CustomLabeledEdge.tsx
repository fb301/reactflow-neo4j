import { EdgeText, getBezierPath, type EdgeProps } from "@xyflow/react";

export const CustomLabeledEdge = (props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#b1b1b7" />
        </marker>
      </defs>

      <path
        id={id}
        style={{ stroke: "#b1b1b7", strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#arrow-${id})`}
      />
      <EdgeText
        x={labelX}
        y={labelY}
        label={String(data?.label || "connects to")}
        labelStyle={{ fill: "#080808ff", fontWeight: 700 }}
        labelShowBg
        labelBgStyle={{ fill: "#ecececff", fillOpacity: 0.7 }}
        labelBgPadding={[8, 4]}
        labelBgBorderRadius={4}
      />
    </>
  );
};
