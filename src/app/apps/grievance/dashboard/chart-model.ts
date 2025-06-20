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

}
const grvTypeChart: ChartType = {
  chart: {
    height: 340,
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '10%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  series: [{
    name: 'Grievance',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Complaint',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Appreciation',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Suggestion',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, {
    name: 'Question',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],
  legend: {
    position: 'bottom',
  },
  fill: {
    opacity: 1
  },
};

const grvBreakdownChart: ChartType = {
  series: [0, 0, 0, 0, 0],

  chart: {
    type: 'pie',
    height: 340,
  },
  colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],
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
  labels: ["Grievance", "Complaint", "Appreciation", "Suggestion", "Question"]
};

const grvCategoryChart: ChartType = {
  series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
  chart: {
    type: "polarArea"
  },
  stroke: {
    colors: ["#fff"]
  },
  fill: {
    opacity: 0.8
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
};

const topicChart: ChartType = {
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
      horizontal: true,
      distributed: true,
      barHeight: 35,
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: []
  }
};

const channelChart: ChartType = {
  series: [0, 0],

  chart: {
    type: 'pie',
    height: 340,
  },
  colors: ['#FFC154', '#47B39C'],
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
const responseTimeChart: ChartType = {
  series: [],
  chart: {
    height: 350,
    type: 'bubble',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 0.8,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    max: 70,
  },
};

const departmentChart: ChartType = {
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
      horizontal: true,
      distributed: true,
      barHeight: 30,
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: []
  }
};

const grvSeverityScoreChart: ChartType = {
  series: [
    {
      name: "Count",
      data: [0]
    }
  ],
  chart: {
    height: 350,
    type: "radar",
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    }
  },
  stroke: {
    width: 0
  },
  fill: {
    opacity: 0.4
  },
  markers: {
    size: 0
  },
  xaxis: {
    categories: []
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: ['#e8e8e8'],
        connectorColors: ['#e8e8e8'],
      },
    },
  },
  legend: {
    show: true,
    position: 'top',
  },

};

const RatingChart: ChartType = {
  series: [],
  chart: {
    height: 390,
    type: "radialBar",
    toolbar: {
      show: false
    },
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: "30%",
        background: "transparent"
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '16px',
          fontWeight: 600,
          offsetY: -10
        },
        value: {
          show: true,
          fontSize: '14px',
          offsetY: 4,
          formatter: (val: any) => val + '%'
        }
      },
      track: {
        show: true,
        startAngle: undefined,
        endAngle: undefined,
        background: '#f2f2f2',
        strokeWidth: '97%',
        opacity: 1,
        margin: 12,
        dropShadow: {
          enabled: false,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.5
        }
      },
      total: {
        show: false,
        label: 'Total',
        color: '#999',
        fontSize: '16px',
        fontFamily: undefined,
        fontWeight: 600,
        formatter: function (w: any) {
          return w.globals.seriesTotals.reduce(function (a: any, b: any) {
            return a + b;
          }, 0) + '%';
        }
      }
    }
  },
  colors: ["#1ab7ea", "#0084ff", "#39539E", '#F1BE65'], 
  legend: {
    show: true,
    floating: true,
    fontSize: "15px",
    position: "left",
    offsetX: 30,
    offsetY: 20,
    labels: {
      useSeriesColors: true
    },
    formatter: function (seriesName: any, opts: any) {
      return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + '%';
    },
    itemMargin: {
      horizontal: 3
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    },
    
  ]
};

const anonymousChart: ChartType = {
  series: [0, 0],
  chart: {
    type: 'donut',
    height: 340,
    toolbar: {
      show: false
    },
  },
  labels: ['Anonymous', 'Non-Anonymous'],
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

const closureRateChart: ChartType = {
  series: [70],
  chart: {
    height: 350,
    type: "radialBar",
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: "70%",
        background: "#fff",
        image: undefined,
        position: "front",
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24
        }
      },
      track: {
        background: "#fff",
        strokeWidth: "67%",
        margin: 0, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35
        }
      },
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: ["#ABE5A1"],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: "round"
  },
  labels: ["Closed"]
}

const grvStatusChart: ChartType = {

  chart: {
    type: "bar",
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded"
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  series: [{
    name: 'Total',
    data: [0]
  }, {
    name: 'Open',
    data: [0]
  }, {
    name: 'In-Progress',
    data: [0]
  }, {
    name: 'Completed',
    data: [0]
  },],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  colors: ['#F1BE65', '#FF1744', '#CCCC00', '#34c38f', '#516AE4'],
  legend: {
    position: 'bottom',
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "$ " + val + " thousands";
      }
    }
  }
};

export { grvTypeChart, grvBreakdownChart, grvCategoryChart, topicChart, channelChart, responseTimeChart, departmentChart, grvSeverityScoreChart, RatingChart, anonymousChart, closureRateChart, grvStatusChart }