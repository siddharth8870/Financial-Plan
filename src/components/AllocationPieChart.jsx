import React from "react";
import Chart from "chart.js/auto";

export function AllocationPieChart({ data }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const labels = Object.keys(data);
    const values = Object.values(data).map((v) => Math.round(v));

    const colors = [
      "#C9A96E",
      "#B8860B",
      "#5B8A72",
      "#7B9BB5",
      "#A67C9B",
      "#D4845A",
      "#6B8E8E",
      "#8B7355",
      "#9B8EA0",
      "#7A7A7A",
      "#5A5A5A",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: "#0D0D0D",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#F5F0E8",
              font: { size: 12 },
            },
          },
          title: {
            display: true,
            text: "Allocation by Category",
            color: "#C9A96E",
            font: { size: 14, weight: "bold" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />;
}
