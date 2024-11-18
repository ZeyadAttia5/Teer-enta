import React, { useEffect } from "react";
import { getActivityReport, getItineraryReport, getOrderReport, getTransportationReport } from "../../api/statistics.ts";

const SalesReport = () => {
  useEffect(() => {
    getItineraryReport().then((res) => {
      console.log(res.data);
    });
    // getTransportationReport().then((res) => {
    //     console.log(res.data);
    //     }
    // );
    // getActivityReport().then((res) => {
    //     console.log(res.data);
    //     }
    // );
    // getOrderReport().then((res) => {
    //     console.log(res.data);
    //     }
    // );

  }, []);

  return <div>SalesReport</div>;
};

export default SalesReport;
