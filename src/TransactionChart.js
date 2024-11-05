import React from 'react';
import { Chart } from "react-google-charts";

export function TransactionChart({ dataArra }) {
    return (
      <Chart
        // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
        chartType="PieChart"
        data={[
            ["Age", "Weight"],
            ["4", 16],  
            ["8", 25],
            ["12", 40],
            ["16", 55],
            ["20", 70],
          ]}
        options={{
          title: "Average Weight by Age",
        }}
        legendToggle
      />
    );
}