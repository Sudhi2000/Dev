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

const ragComparisonChart: ChartType = {
  series: [],
  chart: {
    type: "bar",
    height: 350
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}

const overallTenureChart: ChartType = {
  series: [],
  chart: {
    type: "bar",
    height: 350
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}

const categoryChart: ChartType = {
  
  series: [],
  chart: {
    type: 'bar',
    height: 430,
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],

  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: 'top',
      },
    borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['#fff']
  },
  tooltip: {
    shared: true,
    intersect: false
  },
   xaxis: {
    categories: []
  },
  yaxis: {
    categories: [],

  }
}

const genderChart: ChartType = {
  series: [],
  chart: {
    type: "bar"
    
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}

const employeeStatusChart: ChartType = {
  series: [],
  chart: {
    type: "bar"
    
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}

const stateChart: ChartType = {
  series: [],
  chart: {
    type: "bar"
    
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}

const ageGroupChart: ChartType = {
  series: [],
  chart: {
    type: "bar"
    
  },
  colors: ['#FF5733', '#FFC300', '#00E396'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 20,

    }
  },
  dataLabels: {
    enabled: true,
    position: 'bottom',

    style: {
      fontSize: '15px',
      fontWeight: 'bold',
    },

  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"]
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "$ (thousands)"
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return "Count: " + val;
      }
    }
  }
}



export { ragComparisonChart, overallTenureChart, categoryChart,genderChart,employeeStatusChart,stateChart,ageGroupChart }