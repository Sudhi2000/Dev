import moment from "moment";

export interface ChartType {
  chart?: any;
  countVal?: any;
  plotOptions?: any;
  colors?: any;
  series?: any;
  fill?: any;
  dataLabels?: any;
  legend?: any;
  xaxis?: any;
  yaxis?: any;
  stroke?: any;
  labels?: any;
  markers?: any;
  tooltip?: any;
  responsive?: any;
  grid?: any

}
const patientflowChart: ChartType = {
  series: [
    {
      name: "Patients Registered",
      data: []
    },
    {
      name: "Patients Consulted",
      data: []
    }
  ],
  chart: {
    height: 350,
    type: "bar"
  },
  plotOptions: {
    bar: {
      horizontal: false
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      return val + " patients";
    }
  },
  xaxis: {
    categories: [
      '12:01 AM - 03:00 AM',
      '03:01 AM - 06:00 AM',
      '06:01 AM - 09:00 AM',
      '09:01 AM - 12:00 PM',
      '12:01 PM - 03:00 PM',
      '03:01 PM - 06:00 PM',
      '06:01 PM - 09:00 PM',
      '09:01 PM - 12:00 AM'
    ],
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Count'
    }
  },
  legend: {
    position: "top"
  },

};
const consultationChart: ChartType = {
  series: [0, 0],
  chart: {
    type: 'donut',
    height: 340,
  },
  colors: ['#2766F6', '#FF1493'],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      }
    }
  },

};

// const departmentChart: ChartType = {

//   chart: {
//     type: 'bar',
//     height: 340,
//   },
//   colors: [
//     "#F44F5E",
//     "#E55A89",
//     "#D863B1",
//     "#CA6CD8",
//     "#B57BED",
//     "#8D95EB",
//     "#62ACEA",
//     "#4BC3E6"
//   ],
//   legend: {
//     show: false,
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 0,
//       horizontal: true,
//       distributed: true,
//       barHeight: "80%",
//       isFunnel: true
//     }
//   },

// };

const departmentChart: ChartType = {
  series: [0, 0],

  chart: {
    type: 'pie',
    height: 340,
  },
  colors: ['#556ee6', '#34c38f'],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      }
    }
  }
};

const severityLevelChart: ChartType = {
  series: [0, 0, 0],
  labels: ['Severe', 'Moderate', 'Mild'],
  chart: {
    type: 'pie',
    height: 340,
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      }
    }
  }
};

const radialChart: ChartType = {
  series: [0],
  chart: {
    type: 'radialBar',
    width: 60,
    height: 60,
    sparkline: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ["#EA3C53"],
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: '60%'
      },
      track: {
        margin: 0
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -50,
          show: true,
          color: "#888",
          fontSize: "10px",

        },
        value: {
          formatter: function (val: any) {
            return parseInt(val.toString(), 10).toString() + '%';
          },
          color: "#111",
          fontSize: "12px",
          show: true,
          offsetY: -10,
        }
      }
    }
  },
  labels: [""]
}

const waitingChart: ChartType = {
  series: [
    {
      name: 'Number of Patients',
      data: [0],
    },
  ],
  chart: {
    type: 'bar',
    height: '350',
    animations: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  yaxis: {

    categories: [
      '0-15 Min',
      '16-30 Min',
      '31-45 Min',
      '46-60 Min',
      '61 and above',
    ],
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
}
const genderChart: ChartType = {
  series: [0, 0],

  chart: {
    type: 'donut',
    height: 240,
  },
  labels: ['Male', 'Female'],
  colors: ['#2766F6', '#FF1493'],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      }
    }
  }
};


const ageChart: ChartType = {
  series: [{
    name: 'Count',
    data: [0, 0, 0, 0, 0, 0, 0]
  }],
  chart: {
    height: 288,
    type: 'line',
    toolbar: 'false',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 8,
      opacity: 0.2
    },
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#556ee6'],
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    categories: [
      "16-19",
      "20-24",
      "25-34",
      "35-44",
      "45-54",
      "55-60",
      "60+",

    ]
  }
};

const divisionChart: ChartType = {
  series: [
    {
      name: "distibuted",
      data: [0]
    }
  ],
  chart: {
    height: 350,
    type: "bar",
    events: {
      click: function (chart: any, w: any, e: any) {
        // console.log(chart, w, e)
      }
    }
  },
  colors: [
    "#008FFB",
    // "#00E396",
    // "#FEB019",
    // "#FF4560",
    // "#775DD0",
    // "#546E7A",
    // "#26a69a",
    // "#D10CE8"
  ],
  plotOptions: {
    bar: {
      columnWidth: "45%",
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false
  },
  xaxis: {
    categories: [
      ["John", "Doe"],
      ["Joe", "Smith"],
      ["Jake", "Williams"],
      "Amber",
      ["Peter", "Brown"],
      ["Mary", "Evans"],
      ["David", "Wilson"],
      ["Lily", "Roberts"]
    ],
    labels: {
      style: {
        colors: [
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#546E7A",
          "#26a69a",
          "#D10CE8"
        ],
        fontSize: "12px"
      }
    }
  }
  // series: [0, 0],

  // chart: {
  //   type: 'bar',
  //   height: 340,
  // },
  // colors: ['#556ee6'],
  // legend: {
  //   show: false,
  // },
  // plotOptions: {
  //   bar: {
  //     horizontal: false,
  //     dataLabels: {
  //       position: 'top',
  //     },
  //     borderRadius: 20,
  //     columnWidth: '20%',
  //     barWidth: '20%',
  //   }
  // },
  // dataLabels: {
  //   enabled: false,
  // },
  // xaxis: {
  //   categories: []
  // }
};

const diseaseChart: ChartType = {
  series: [
    {
      name: "basic",
      data: [0]
    }
  ],
  chart: {
    type: "bar",
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: []
  }

  // chart: {
  //   type: 'bar',
  //   height: 340,
  // },
  // series: [],
  // colors: ['#00E396'],

  // plotOptions: {
  //   bar: {
  //     horizontal: true,
  //     dataLabels: {
  //       position: 'top',
  //     },
  //     borderRadius: 20,

  //   }
  // },

  // dataLabels: {
  //   enabled: false,
  // },
  // xaxis: {
  //   categories: []
  // },
  // yaxis: {
  //   categories: [0, 0],
  //   labels: {
  //     formatter: function (value: number) {
  //       return value.toString();
  //     },
  //   },
  // },
};

const maternityChart: ChartType = {
  series: [
    {
      name: 'Maternity Records',
      data: [0]
    }
  ],
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      endingShape: 'rounded',
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: 'Number of Applications',
      style: {
        fontSize: '14px',       // Set desired font size
        color: '#1f2937',       // Set desired color (e.g., Tailwind slate-800)
        fontWeight: '600',      // Optional: make it semi-bold
        fontFamily: 'Arial'     // Optional: set a custom font
      } // <-- This adds the label
    },
    labels: {
      formatter: function (value: number) {
        return value.toString();
      }
    }
  }
};
const crossDivisionChart: ChartType = {
  series: [
    {
      name: "Same Division",
      data: [0]
    },
    {
      name: "Another Division",
      data: [0]
    }
  ],
  chart: {
    height: 350,
    type: "area"
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },
  xaxis: {
    type: "text",
    categories: []
  },
  // tooltip: {
  //   x: {
  //     format: "dd/MM/yy HH:mm"
  //   }
  // }
}


export { patientflowChart, consultationChart, departmentChart, severityLevelChart, radialChart, waitingChart, genderChart, ageChart, diseaseChart, divisionChart, crossDivisionChart, maternityChart }