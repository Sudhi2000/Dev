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

const SDGChart: ChartType = {
  series: [0, 0],

  chart: {
    type: 'pie',
    height: 350,
  },
  labels: ['Happening', 'Completed'],
  legend: {
    show: false,
  },
};

const SDGTopFiveChart: ChartType = {
  series: [
    {
      name: "Initiatives",
      data: [0]
    }
  ],
  chart: {
    type: "bar",
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: []
  },
  yaxis: [
    {
      labels: {
        formatter: function (val: any) {
          return val
        }
      }
    }
  ]
};

const SDGprogressChart: ChartType = {
  chart: {
    height: 350,
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
      columnWidth: '20%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val: number) {
        return `${val}`;
      },

    }
  },
  series: [
    {
      name: 'Completed',
      data: Array(17).fill(0)
    },
    {
      name: 'Happening',
      data: Array(17).fill(0)
    }
  ],
  xaxis: {
    categories: Array.from({ length: 17 }, (_, i) => `SDG ${i + 1}`)
  },
  colors: ['#28a745', '#007bff'],
  legend: {
    position: 'bottom'
  },
  fill: {
    opacity: 1
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return Math.round(val);
      }
    }
  }
};

const pillarChart: ChartType = {
  series: [], // Dynamically populated
  chart: {
    type: 'radialBar',
    height: 350
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '13px',
        },
        value: {
          fontSize: '16px',
          formatter: function (val: any) {
            return val.toString(); // Just show raw count
          }
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w: any) {
            const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
            return total.toString(); // Show raw total count
          }
        }
      }
    }
  },
  labels: [], // Set dynamically from component
  colors: ['#9C27B0', '#FF5722', '#FFC107', '#2196F3', '#4CAF50'],
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        }
      }
    }
  ]
};


const GHGEmissionChart: ChartType = {
  chart: {
    height: 400,
    width: '100%',
    type: 'bar',
    stacked: true,
    stackType: 'normal',
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '10%',
      // distributed: false,
      endingShape: 'rounded'
    }
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['#fff']
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#153487', '#DF7720', '#0B9481'], // Scope-3, Scope-2, Scope-1

  xaxis: {
    categories: [],        // ← will be overwritten
    type: 'category',      // ← ensures labels, not indices
    title: { text: 'Year' }
  },
  yaxis: {
    title: {
      text: 'Emissions (tCO2e)'
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} tCO2e`
    }
  },
  legend: {
    position: 'bottom'
  },
  fill: {
    opacity: 1
  },
  series: [] // to be populated dynamically
};


const TotalEnergyConsumptionChart: ChartType = {
  chart: {
    type: 'line',
    height: 400,
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#34c38f'],
  markers: {
    size: 3,
    colors: ['#34c38f'],
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -10,        // move labels 10px above the point
    style: {
      fontSize: '12px',
      colors: ['#34c38f']
    },
    formatter: (val: any) => `${val} MWh`
  },
  xaxis: {
    categories: [],        // ← will be overwritten
    type: 'category',      // ← ensures labels, not indices
    title: { text: 'Year' }
  },
  yaxis: {
    title: { text: 'Energy (MWh)' }
  },
  tooltip: {
    y: { formatter: (val: any) => `${val} MWh` }
  },
  series: []               // ← will be overwritten
};

const waterWithdrawalChart: ChartType = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '65%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return `${val.toFixed(2)}`;
    }
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: { text: 'cubic meters (m³)' }
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return `${val.toFixed(2)} m³`;
      }
    }
  },
  series: []
};

const wasteStackedChart: ChartType = {
  chart: {
    type: 'bar',
    stackType: 'normal',
    toolbar: {
      show: true
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '65%',
      horizontal: false,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return `${val.toFixed(2)} t`; // 't' for tons
    }
  },
  xaxis: {
    categories: [], // Dynamically filled from response
    type: 'category',
    title: {
      text: 'Year'
    }
  },

  tooltip: {
    y: {
      formatter: function (val: number) {
        return `${val.toFixed(2)} tons`;
      }
    }
  },
  legend: {
    position: 'bottom',
    labels: {
      colors: '#333'
    }
  },
  series: [] // Dynamically filled from transformed data
};

const EmployeeCountChart: ChartType = {
  chart: {
    type: 'line',
    height: 400,
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#556ee6'],
  markers: {
    size: 3,
    colors: ['#556ee6'],
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -6, // less negative
    style: {
      fontSize: '10px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      backgroundColor: '#556ee6'
    },
    formatter: (val: any) => val > 0 ? `${val} employees` : ''
  },
  xaxis: {
    categories: [], // Push your array here, e.g. ['2043', '2044', '']
    type: 'category',
    title: { text: 'Year' }
  },
  yaxis: {
    title: { text: 'Employee Count' }
  },
  tooltip: {
    y: { formatter: (val: any) => `${val} employees` }
  },
  series: []
};

const ageDistributionChart: ChartType = {
  chart: {
    type: 'bar',
    stacked: true,
    height: 400,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return `${val} employees`;
    },
    style: {
      fontSize: '10px'
    }
  },
  xaxis: {
    categories: [], // Dynamically filled from response
    title: { text: 'Year' }
  },
  yaxis: {
    title: { text: 'Total Employees' }
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return `${val} employees`;
      }
    }
  },
  legend: {
    position: 'top'
  },
  colors: ['#556ee6', '#34c38f', '#f46a6a'],
  series: [] // Dynamically filled from transformed data
};

const genderDistributionChart: ChartType = {
  chart: {
    type: 'bar',
    stacked: true,
    height: 500,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return `${val.toFixed(1)}%`;
    },
    style: {
      fontSize: '10px'
    }
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    max: 100,
    title: {
      text: 'Gender Distribution (%)'
    }
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return `${val.toFixed(2)}%`;
      }
    }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center'
  },
  colors: ['#4e79a7', '#f28e2b', '#e15759'],
  series: []
};

const empTypeChart: ChartType = {
  series: [],
  chart: {
    height: 440,
    type: 'bar',  // Change to 'bar' for stacked bar chart
    toolbar: { show: false }
  },
  dataLabels: { enabled: false },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      endingShape: 'rounded',
    }
  },
  xaxis: {
    categories: [],  // will be set dynamically
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Employee Count'
    }
  },
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c'],  // Male, Female, Other
  legend: {
    position: 'top',
    horizontalAlign: 'center'
  }
};


const newHiresChart = {
  chart: {
    type: 'line',
    height: 400,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },

  markers: {
    size: 3,
    colors: ['#556ee6'],
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -6, // less negative
    style: {
      fontSize: '10px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      backgroundColor: '#556ee6'
    },
    formatter: (val: number): string => 0 ? `${val} hires` : ''
  },
  xaxis: {
    categories: [] as string[], // fiscal years
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Total Hires'
    }
  },
  tooltip: {
    y: {
      formatter: (val: number): string => `${val} hires`
    }
  },
  colors: ['#4e79a7'],
  legend: {
    position: 'top'
  },
  series: []
};

const newHiresAgeChart = {
  chart: {
    type: 'line',
    height: 400,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 5
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [] as string[], // Fiscal years
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Total Hires'
    }
  },
  tooltip: {
    y: {
      formatter: (val: number): string => `${val} hires`
    }
  },
  colors: ['#4e79a7', '#f28e2b', '#e15759'], // Adding different colors for each age group
  legend: {
    position: 'top'
  },
  series: [
    {
      name: 'Under 30',
      data: [] as number[]
    },
    {
      name: '30-50',
      data: [] as number[]
    },
    {
      name: 'Over 50',
      data: [] as number[]
    }
  ] as {
    name: string;
    data: number[];
  }[]
};

const newHiresGenderChart = {
  chart: {
    type: 'bar',
    height: 400,
    stacked: true,
    // stackType: '100%',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(2)}%`
  },
  xaxis: {
    categories: [] as string[],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    max: 100,
    title: {
      text: 'Percentage (%)'
    },
    labels: {
      formatter: (val: number) => `${val.toFixed(2)}` // Round to 1 decimal
    }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%`
    }
  },
  colors: ['#4e79a7', '#f28e2b', '#e15759'], // Blue, Orange, Red
  legend: {
    position: 'top'
  },
  series: [] as {
    name: string;
    data: number[];
  }[]
};


const attritionRateChart = {
  chart: {
    type: 'line',
    height: 400,
    toolbar: { show: false }
  },
  // dataLabels: {
  //   enabled: true
  // },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 3,
    colors: ['#556ee6'],
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -6, // less negative
    style: {
      fontSize: '10px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      backgroundColor: '#556ee6'
    },
  },
  xaxis: {
    categories: [], // Will be set dynamically
    title: { text: 'Year' }
  },
  yaxis: {
    title: { text: 'Turnover Rate (%)' },
    min: 0,
    max: 100
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%`
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#FF6B6B'],
  series: [
    {
      name: 'Turnover Rate (%)',
      data: [] // Will be set dynamically
    }
  ]
};

const attritionRateRegionChart = {
  chart: {
    type: 'bar', // Bar chart to show region-wise data
    height: 400,
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: true
  },

  xaxis: {
    categories: [], // Fiscal years, populated dynamically
    title: {
      text: 'Year' // X-axis shows fiscal years
    }
  },
  yaxis: {
    title: {
      text: 'Turnover Rate (%)' // Y-axis shows attrition rate
    },
    min: 0,
    max: 100
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%` // Show attrition rate percentage in the tooltip
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#FF6B6B', '#00BFFF', '#32CD32'], // Customize color scheme for each region
  series: [
    // The series will be populated dynamically with region-wise data for each fiscal year
  ]
};
const attritionRateAgeGroupChart = {
  chart: {
    type: 'bar', // Bar chart to show age group-wise data
    height: 400,
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(2)}%`
  },
  xaxis: {
    categories: [], // Fiscal years, populated dynamically
    title: {
      text: 'Year' // X-axis shows fiscal years
    }
  },
  yaxis: {
    title: {
      text: 'Turnover Rate (%)' // Y-axis shows attrition rate
    },
    min: 0,
    max: 100
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%` // Show attrition rate percentage in the tooltip
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#FF6B6B', '#00BFFF', '#32CD32', '#FF8C00', '#FFD700'], // Customize color scheme for each age group
  series: []

};
const attritionRateGenderChart = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Turnover Rate (%)'
    },
    min: 0,
    max: 100
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%`
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#FF6B6B', '#00BFFF', '#32CD32'], // Male, Female, Other
  series: []
};


const attritionRateYOYChart = {
  chart: {
    type: 'line',
    height: 400,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },

  markers: {
    size: 3,
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -6,
    style: {
      fontSize: '10px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      backgroundColor: '#556ee6'
    },
    formatter: function (val: number) {
      return `${val}%`;
    }
  },
  xaxis: {
    categories: [] as string[], // Fiscal years
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Turnover Rate (%)'
    }
  },
  tooltip: {
    y: {
      formatter: function (val: number, opts: any): string {
        const point = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
        return `${val}% | Turnover: ${point.turnover}`;
      }
    }
  },
  colors: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'], // Expand if more regions
  legend: {
    position: 'top'
  },
  series: [] as {
    name: string;
    data: number[];
  }[]
};

const GenderRepChart = {
  chart: {
    type: 'line',
    height: 400,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 3,
    strokeColors: '#fff',
    strokeWidth: 1
  },
  dataLabels: {
    enabled: true,
    offsetY: -6,
    style: {
      fontSize: '10px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#fff',
      padding: 4,
      borderRadius: 2,
      backgroundColor: '#556ee6'
    }
  },
  xaxis: {
    categories: [] as string[],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Gender Representation (%)'
    }
  },
  tooltip: {
    y: {
      formatter: function (val: number, opts: any): string {
        const dataPoint = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];

        return ` ${val}% (Count: ${dataPoint?.count ?? 0})`;
      }
    }
  },
  colors: ['#4e79a7', '#f28e2b', '#e15759'],
  legend: {
    position: 'top'
  },
  // 🔧 Updated here: accept objects, not just numbers
  series: [] as {
    name: string;
    data: { x: string; y: number; count: number }[];
  }[]
};


const DisabilityRepChart = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Number of Employees with Disability'
    }
  },
  legend: {
    position: 'top'
  },
  colors: ['#1e90ff', '#ffa500'],
  tooltip: {
    y: {
      formatter: (val: any) => `${val} employees`
    }
  }
  ,
  series: [] as {
    name: any;
    data: any[];
  }[]
};

const genderParityChart = {
  chart: {
    type: 'bar',
    height: 400,
    stacked: false,
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: true
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      endingShape: 'rounded'
    }
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Gender Pay Parity Ratio'
    },
    min: 0
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}`
    }
  },
  legend: {
    show: true,
    position: 'top',
    fontSize: '14px'
  },
  colors: ['#6A5ACD', '#FF69B4', '#20B2AA', '#FFD700', '#8A2BE2', '#FF4500', '#228B22', '#DC143C'],
  series: []
};

const SkillUpgradeChart = {
  chart: {
    type: 'bar',
    stacked: true,
    height: 450,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Number of Employees Trained'
    },
    min: 0
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} employees`
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#1E90FF', '#FF69B4', '#8A2BE2'], // Blue, Pink, Purple for Male, Female, Other
  series: [] // Populated dynamically
};

const parentalLeaveChart: ChartType = {
  chart: {
    type: 'donut'
  },
  labels: [], // gets overridden dynamically
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '14px'
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number, opts: any) {
      const label = opts?.w?.config?.labels?.[opts.seriesIndex];
      const value = opts?.w?.config?.series?.[opts.seriesIndex];
      return `${label}: ${value}`;
    },
    style: {
      fontSize: '13px'
    }
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val} Employees`
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true
        }
      }
    }
  }
};

const HRTrainedEMPChart = {
  chart: {
    type: 'bar',
    stacked: true,
    height: 450,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Percentage of Employees (%)'
    },
    min: 0,
    max: 100
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(1)}%`
    }
  },
  legend: {
    show: true,
    position: 'top'
  },
  colors: ['#1E90FF', '#FF7F50'], // Permanent = Blue, Temporary = Coral
  series: [] // Dynamically populated
};

const unionMembershipChart = {
  chart: {
    type: 'pie',
    width: '100%'
  },
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: true
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val;
      }
    }
  },
  plotOptions: {
    pie: {
      expandOnClick: true
    }
  },
  series: [],
  labels: []
};

const retirementBenefitsChart = {
  chart: {
    type: 'bar',
    height: 450,
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val}%`, // Show percentage only
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: 'Percentage (%)',
    },
    min: 0,
    max: 100,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
  },
  series: []
}


const empInjuryChart = {
  chart: {
    type: 'polarArea',
    height: 350
  },
  series: [],  // Filled dynamically
  labels: [],  // Filled dynamically
  colors: ['#FF5733', '#FF8D1A', '#FFC107', '#28A745', '#007BFF'],
  stroke: {
    colors: ['#fff']  // White stroke between segments
  },
  fill: {
    opacity: 0.9
  },
  yaxis: {
    show: false,
    // You can adjust this based on your expected max injury value
  },
  dataLabels: {
    enabled: false // Hide internal labels, tooltip is enough
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: { height: 300 },
        legend: { position: 'bottom' }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: { height: 250 },
        legend: { position: 'bottom' }
      }
    }
  ],
  legend: {
    position: 'right',
    labels: {
      colors: '#000',  // Legend text color
    }
  }
};


const bodKmpDonutChart = {
  chart: {
    type: 'donut',
    height: 300,
  },
  labels: ['Board of Directors (BOD)', 'Key Managerial Personnel (KMP)'],
  colors: ['#546E7A', '#26A69A'],
  legend: {
    position: 'bottom',
    fontSize: '14px',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '16px',
            formatter: function (w: any) {
              return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
            }
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: true,
  },
  tooltip: {
    y: {
      formatter: (val: any) => `${val} Members`
    }
  }
};


const govGrievanceRadialChart: ChartType = {
  chart: {
    type: 'radialBar',
    toolbar: { show: false }
  },
  labels: [], // dynamically set
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          show: true,
          fontSize: '16px'
        },
        value: {
          show: true,
          fontSize: '14px',
          formatter: (val: number) => `${val}`
        },
        total: {
          show: true,
          label: 'Closure Rate',
          formatter: function (w: any) {
            const [resolved, pending] = w.config.series;
            const total = resolved + pending;
            const rate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0.0';
            return `${rate}%`;
          }
        }
      }
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '14px',
    labels: {
      useSeriesColors: true
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '13px'
    }
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number, opts?: any) => {
        const label = opts?.w?.config?.labels?.[opts.seriesIndex] || '';
        return `${label}: ${val}`;
      }
    }
  }
};

const supplierChart = {
  chart: {
    type: 'line',
    height: 500,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 5
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [] as string[], // Fiscal years (will be dynamically set)
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Number of Suppliers'
    }
  },
  tooltip: {
    y: {
      formatter: (val: number): string => `${val} suppliers`
    }
  },
  colors: ['#4e79a7'], // Blue color for the line
  legend: {
    position: 'top'
  },
  series: [
    {
      name: 'Number of Suppliers',
      data: [] as number[] // This will be dynamically populated
    }
  ] as {
    name: string;
    data: number[];
  }[]
};

const trainingLineChart = {
  chart: {
    type: 'line',
    height: 500,
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  markers: {
    size: 5
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [] as string[],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Total Training Hours'
    },
    min: 0
  },
  tooltip: {
    y: {
      formatter: (val: number): string => `${val} hours`
    }
  },
  colors: ['#00B746'],
  legend: {
    position: 'top'
  },
  series: [
    {
      name: 'Total Training Hours',
      data: [] as number[]
    }
  ] as {
    name: string;
    data: number[];
  }[]
};

const TrainingByLevelChart = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    height: 400
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Training Hours'
    }
  },
  legend: {
    position: 'top'
  },
  colors: ['#008FFB', '#00E396', '#FEB019'], // Add more colors if you have more levels
  tooltip: {
    y: {
      formatter: (val: number) => `${val} hours`
    }
  },
  series: [] as {
    name: string;
    data: number[];
  }[]
};

const TrainingByFunctionChart = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%'  // Adjust if needed
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: [], // To be filled dynamically in component
    title: {
      text: 'Year'
    }
  },
  yaxis: {
    title: {
      text: 'Total Training Hours by Function'
    }
  },
  legend: {
    position: 'top'
  },
  colors: ['#1e90ff', '#ffa500', '#32cd32'], // Customize colors as per function
  tooltip: {
    y: {
      formatter: (val: any) => `${val} hours`
    }
  },
  series: [] as { name: string; data: number[] }[] // To be populated in component
};

export {
  SDGChart, SDGTopFiveChart, SDGprogressChart, pillarChart,
  GHGEmissionChart, TotalEnergyConsumptionChart, waterWithdrawalChart,
  wasteStackedChart, EmployeeCountChart, ageDistributionChart, genderDistributionChart,
  empTypeChart, newHiresChart, newHiresAgeChart, newHiresGenderChart, attritionRateChart,
  attritionRateRegionChart, attritionRateAgeGroupChart, attritionRateGenderChart,
  attritionRateYOYChart, GenderRepChart, DisabilityRepChart, genderParityChart,
  SkillUpgradeChart, parentalLeaveChart, HRTrainedEMPChart, unionMembershipChart,
  retirementBenefitsChart, empInjuryChart, bodKmpDonutChart, govGrievanceRadialChart, supplierChart, trainingLineChart, TrainingByLevelChart, TrainingByFunctionChart
}