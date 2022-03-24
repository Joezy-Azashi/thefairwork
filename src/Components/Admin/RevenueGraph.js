import { Card, CardContent, Grid } from "@material-ui/core";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Jan",
    thisMonth: 400,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Feb",
    thisMonth: 500,
    last12Months: 280,

    amt: 2400,
  },
  {
    name: "Mar",
    thisMonth: 6500,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Apr",
    thisMonth: 3550,
    last12Months: 200,

    amt: 2400,
  },
  {
    name: "May",
    thisMonth: 3000,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Jun",
    thisMonth: 3000,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Jul",
    thisMonth: 4000,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Aug",
    thisMonth: 3000,
    last12Months: 2400,

    amt: 2400,
  },
  {
    name: "Sep",
    thisMonth: 3000,
    last12Months: 200,

    amt: 2400,
  },
  {
    name: "Oct",
    thisMonth: 3100,
    last12Months: 900,

    amt: 2400,
  },
  {
    name: "Nov",
    thisMonth: 3000,
    last12Months: 1400,

    amt: 2400,
  },
  {
    name: "Dec",
    thisMonth: 900,
    last12Months: 2400,

    amt: 2400,
  },
];


export default function RevenueGraph() {
  return (
    <div className="row">
      <div className="col-md-12 mt-2">
        <Card className="fullTable">
          <div className="d-flex justify-content-between RevgraphHeader">
            <div>
              <h6 className="m-4 usersGraphTitile">Revenue</h6>
            </div>
            <div className="d-flex">
              <div>
                <div className="m-4 mb-0 d-flex align-items-center justify-content-center">
                  <p className="thisMonth"></p>
                  <div>
                    <p>This Month</p>
                  </div>
                </div>
                <span className="m-4 usersGraphTitile"><b>€ 155.885</b></span>
              </div>
              <div>
                <div className="m-4 mb-0 d-flex align-items-center justify-content-center">
                  <p className="last12Months"></p>
                  <div>
                    <p className="last12MonthsText">Last 12 months</p>
                  </div>
                </div>
                <strong className="m-4 usersGraphTitile">€ 9,825.781</strong>
              </div>
            </div>
          </div>
          <CardContent className="row">
            <div className="col-md-12">
              <LineChart
                width={window.screen.width >= 1920 ? 1050 : 870 }
                height={370}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 5,
                  bottom: 5,
                }}
              >
                
                <XAxis dataKey="name" />

                

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <YAxis
                yAxisId="left" 
                  label={{
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip />
                <Line
                  yAxisId="left"
                  type="natural"
                  dataKey="thisMonth"
                  stroke="#2E405B"
                  strokeWidth={1}
                  dot={false}
                />

                <Line
                  yAxisId="right"
                  type="basis"
                  dataKey="last12Months"
                  stroke="#A41201"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
