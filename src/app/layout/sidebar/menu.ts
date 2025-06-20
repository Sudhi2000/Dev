import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Insight',
    icon: 'home',
    link: '/apps/insight'
  },
  {
    label: 'Sustainability',
    isTitle: true
  },
  {
    label: 'Audit & Inspection',
    icon: 'layers',
    subItems: [

      {
        label: 'Dashboard',
        link: '/apps/audit-inspection/dashboard',
        // link: '/apps/under-construction',
      },
      {
        label: 'Calendar',
        link: '/apps/audit-inspection/calendar',
        // link: '/apps/under-construction',
      },
      {
        label: 'Internal Audit',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Schedule',
            link: '/apps/audit-inspection/internal-audit/schedule',
            // link: '/apps/under-construction',
          },
          {
            label: 'Register',
            link: '/apps/audit-inspection/internal-audit/register',
            // link: '/apps/under-construction',
          },
          {
            label: 'Tasks',
            link: '/apps/audit-inspection/internal-audit/tasks',
            // link: '/apps/under-construction',
          },
          {
            label: 'Queue',
            link: '/apps/audit-inspection/internal-audit/queue',
            // link: '/apps/under-construction',
          },
          {
            label: 'Corrective Actions',
            link: '/apps/audit-inspection/internal-audit/corrective-register',
            // link: '/apps/under-construction',
          },

        ]
      },
      {
        label: 'External Audit',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Schedule',
            link: '/apps/audit-inspection/external-audit/schedule',
            // link: '/apps/under-construction',
          },
          {
            label: 'Register',
            // link: '#',
            link: '/apps/audit-inspection/external-audit/register',
          },
          {
            label: 'Tasks',
            // link: '/apps/environment/assigned',
            link: '/apps/audit-inspection/external-audit/tasks',
          },
          {
            label: 'Queue',
            // link: '/apps/environment/assigned',
            link: '/apps/audit-inspection/external-audit/queue',
          },
          {
            label: 'Corrective Actions',
            link: '/apps/audit-inspection/external-audit/corrective-register'
          }

        ]
      },

    ]

  },

  {
    label: 'Sustainability',
    icon: 'feather',

    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/esg/dashboard',
      },
      {
        
        label: 'SDG Reporting',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Register',
            link: '/apps/sustainability/register',
            // link: '/apps/under-construction',
          },
          {
            label: 'Report an Activity',
            link: '/apps/sustainability/report',
            // link: '/apps/under-construction',
          },

        ]
      },

      {
        label: 'ESG',
        // link: '#',
        // link: '/apps/under-construction',
        subItems: [ 
          {
            label: 'Register',
            link: '/apps/esg/register',
          },
          {
            label: 'ESG Report',
            link: '/apps/esg/general_disclosure_register',
          },
          {
            label: 'External Portal',
            link: '/apps/under-construction',
          },


        ]
      },

      {
        label: 'Materiality',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Register',
            link: '/apps/materiality-assessment/register',
            // link: '/apps/under-construction',
          },
          {
            label: 'Schedule Survey',
            link: '/apps/materiality-assessment/survey',
            // link: '/apps/under-construction',
          },

        ]
      },



    ]
  },

  {
    label: 'Environment',
    icon: 'target',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/environment/dashboard',
        // link: '/apps/under-construction',
      },
      {
        label: 'History',
        subItems: [
          {
            label: 'Consumption',
            link: '/apps/environment/history',
            // link: '/apps/under-construction',
          },
          {
            label: 'Target Setting',
            link: '/apps/target-setting/history',
            // link: '/apps/under-construction',
          },

        ]
        // link: '/apps/environment/history',
        // link: '/apps/under-construction',
      },
      {
        label: 'Create',
        subItems: [
          {
            label: 'Consumption',
            link: '/apps/environment/consumption/create',
            // link: '/apps/under-construction',
          },
          {
            label: 'Target Setting',
            link: '/apps/target-setting/create',
            // link: '/apps/under-construction',
          },

        ]
        // link: '/apps/environment/history',
        // link: '/apps/under-construction',
      },
      {
        label: 'Assigned Tasks',
        subItems: [
          {
            label: 'Consumption',
            link: '/apps/environment/assigned',
            // link: '/apps/under-construction',
          },
          {
            label: 'Target Setting',
            link: '/apps/target-setting/assigned-tasks',
            // link: '/apps/under-construction',
          },

        ]
        // link: '/apps/environment/history',
        // link: '/apps/under-construction',
      },


    ]

  },
  {
    label: 'Chemical MNG',
    icon: 'archive',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/chemical-management/dashboard',
      },
      {
        label: 'Request History',
        link: '/apps/chemical-management/request-history',
      },
      {
        label: 'New Request',
        link: '/apps/chemical-management/create-request',
      },
      // {
      //   label: 'Chemical Request',
      //    subItems:[
      //     {
      //       label: 'Create a Request',
      //        link: '/apps/chemical-management/create-request',
      //     },
      //     {
      //       label: 'History',
      //        link: '/apps/chemical-management/request-history',
      //     },

      //    ]
      // },
      {
        label: 'Purchase & Inventory',
        link: '/apps/chemical-management/inventory',
        //link: '/apps/under-construction',
      },
      // {
      //   label: 'Create Inventory',
      //    link: '/apps/chemical-management/create-inventory',
      // },
      {
        label: 'Transaction',
        link: '/apps/chemical-management/transaction',
      },

      // {
      //   label: 'Create Transaction',
      //     link: '/apps/chemical-management/create-transaction',
      // },
      {
        label: 'Assigned Tasks',
        link: '/apps/chemical-management/assigned-task',
      },

    ]
  },
  // {
  //   label: 'Target Setting',
  //   icon: 'target',
  //   // link: '#',
  //   link: '/apps/under-construction',
  //   subItems:[
  //     {
  //       label: 'History',
  //       // link: '/apps/target-setting/history',
  //       link: '/apps/under-construction',
  //     },
  //     {
  //       label: 'Create',
  //       // link: '/apps/target-setting/create',
  //       link: '/apps/under-construction',
  //     },
  //     {
  //       label: 'Assigned Tasks',
  //       // link: '/apps/target-setting/assigned-tasks',
  //       link: '/apps/under-construction',
  //     },




  //   ]

  // },


  {
    label: 'Health & Safety',
    isTitle: true
  },
  {
    label: 'Hazard & Risk',
    icon: 'slack',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/hazard-risk/dashboard',
      },
      {
        label: 'Report a Hazard / Risk',
        link: '/apps/hazard-risk/create'
      },
      {
        label: 'History',
        link: '/apps/hazard-risk/history'
      },
      {
        label: 'Assigned Tasks',
        link: '/apps/hazard-risk/assigned-tasks'
      },
    ]
  },
  {
    label: 'Accident & Incident',
    icon: 'triangle',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/accident-incident/dashboard',
        // link: '/apps/under-construction',

      },
      {
        label: 'Report',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Report Accident',
            link: '/apps/accident-incident/create-accident',
            // link: '/apps/under-construction',
          },
          {
            label: 'Report Incident',
            link: '/apps/accident-incident/create-incident',
            // link: '/apps/under-construction',
          },
        ]
      },
      {
        label: 'Register',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Accident Register',
            link: '/apps/accident-incident/accident-register',
            // link: '/apps/under-construction',
          },
          {
            label: 'Incident Register',
            link: '/apps/accident-incident/incident-register',
            // link: '/apps/under-construction',
          },
          {
            label: 'Corrective Action',
            link: '/apps/accident-incident/corrective-action-register',
            // link: '/apps/under-construction',
          },
        ]
      },
      {
        label: 'Assigned Tasks',
        // link: '#',
        link: '/apps/under-construction',
        subItems: [
          {
            label: 'Accident Assigned',
            link: '/apps/accident-incident/accident-assigned',
            // link: '/apps/under-construction',
          },
          {
            label: 'Incident Assigned',
            link: '/apps/accident-incident/incident-assigned',
            // link: '/apps/under-construction',
          },
          {
            label: 'Corrective Action',
            link: '/apps/accident-incident/corrective-actions',
            // link: '/apps/under-construction',
          },
        ]
      },
      // {
      //   label: 'History',
      //   link: '/apps/email/compose'
      // },
      // {
      //   label: 'Assigned Tasks',
      //   link: '/apps/email/compose'
      // },
    ]
  },
  {
    label: 'Document',
    icon: 'folder',
    subItems: [
      {
        label: 'Register',
        link: '/apps/document-management/register',
        //link: '/apps/under-construction',
      },
      {
        label: 'Create',
        link: '/apps/document-management/create',
        //link: '/apps/under-construction',
      },
    ]
  },
  {
    label: 'Equipment MNG',
    icon: 'truck',
    subItems: [
      {
        label: 'Equipment',
        subItems: [

          {
            label: 'Register',
            link: '/apps/equipment-management/equipment/register',
            //link: '/apps/under-construction',
          },
          {
            label: 'Create',
            link: '/apps/equipment-management/equipment/create',
            //link: '/apps/under-construction',
          },

        ]

      },
      {
        label: 'Client',

        link: '/apps/equipment-management/client',
      },
      {
        label: 'GEO Tag',

        link: '/apps/equipment-management/geo-tag',
      },
      {
        label: 'Inspection Template',

        link: '/apps/equipment-management/inspection-template/register',


      },
    ]
  },
  {
    label: 'Occupational health',
    icon: 'activity',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/occupational-health/dashboard'
      },
      {
        label: 'Clinical Suite',
        subItems: [

          {
            label: 'Patient Register',
            link: '/apps/occupational-health/clinical-suite/register',
            //link: '/apps/under-construction',
          },
          {
            label: 'Consultation',
            link: '/apps/occupational-health/clinical-suite/consultation',
            //link: '/apps/under-construction',
          },
          {
            label: 'Medicine Stock',
            link: '/apps/occupational-health/clinical-suite/medicine-stock',
            //link: '/apps/under-construction',
          },
          {
            label: 'Pharmacy Queue',
            link: '/apps/occupational-health/clinical-suite/pharmacy-queue',
            //link: '/apps/under-construction',
          },

        ]

      },
      {
        label: 'Medicine Inventory',
        subItems: [
          {
            label: 'Medicine Request',
            link: '/apps/occupational-health/medicine-inventory/request-history',
          },


          {
            label: 'Purchase & Inventory',
            link: '/apps/occupational-health/medicine-inventory/purchase-inventory',
            //link: '/apps/under-construction',
          },
          // {
          //   label: 'Create Inventory',
          //    link: '/apps/chemical-management/create-inventory',
          // },
          {
            label: 'Transaction',
            link: '/apps/occupational-health/medicine-inventory/transaction',
          },

          // {
          //   label: 'Create Transaction',
          //     link: '/apps/chemical-management/create-transaction',
          // },
          {
            label: 'Assigned Tasks',
            link: '/apps/occupational-health/medicine-inventory/assigned-task',
          },

        ]
      },
      {
        label: 'Medical Records',
        subItems: [
          {
            label: 'Maternity Register',
            link: '/apps/occupational-health/medical-records/register',
          },


          // {
          //   label: 'Purchase & Inventory',
          //   link: '/apps/occupational-health/medicine-inventory/purchase-inventory',
          //   //link: '/apps/under-construction',
          // },

          // {
          //   label: 'Transaction',
          //   link: '/apps/occupational-health/medicine-inventory/transaction',
          // },

          // {
          //   label: 'Assigned Tasks',
          //   link: '/apps/occupational-health/medicine-inventory/assigned-task',
          // },

        ]
      },

    ]

  },
  {
    label: 'Social',
    isTitle: true
  },
  {
    label: 'Grievance',
    icon: 'alert-circle',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/grievance/dashboard',
        // link: '/apps/under-construction',
      },
      {
        label: 'Register',
        link: '/apps/grievance/register',
        // link: '/apps/under-construction',
      },
      {
        label: 'Assigned Tasks',
        link: '/apps/grievance/assigned-tasks',
        // link: '/apps/under-construction',
      },


    ]

  },
  {
    label: 'RAG',
    icon: 'smile',
    subItems: [
      {
        label: 'Dashboard',
        link: '/apps/rag/dashboard',
        // link: '/apps/under-construction',
      },
      {
        label: 'Register',
        link: '/apps/rag/register',
        // link: '/apps/under-construction',
      },

    ]

  },
  {
    label: 'Engagement',
    icon: 'umbrella',
    subItems: [

      {
        label: 'Create',
        // link: '/apps/engagement/engagements/create',
        link: '/apps/under-construction',
      },
      {
        label: 'History',
        // link: '/apps/engagement/engagements/history',
        link: '/apps/under-construction',
      },



    ]
  },
  {
    label: 'Attrition',
    icon: 'user-minus',
    // link: '/apps/calendar',
    link: '/apps/under-construction',
    subItems: [
      {
        label: 'Create',
        link: '/apps/attrition/create',
        // link: '/apps/under-construction',
      },
      {
        label: 'History',
        link: '/apps/attrition/history',
        // link: '/apps/under-construction',
      },

    ]
  },
  {
    label: 'Satisfaction Survey',
    icon: 'file-text',
    link: '/apps/satisfaction-survey',
    subItems: [

      {
        label: 'Question Bank',
        subItems: [
          {
            label: 'Create Question',
            link: '/apps/satisfaction-survey/create-question',
          },
          {
            label: 'Register',
            link: '/apps/satisfaction-survey/question-history',
          },

        ]
      },
      {
        label: 'Survey',
        subItems: [
          {
            label: 'Create Survey',
            link: '/apps/satisfaction-survey/create-survey',
          },
          {
            label: 'Register',
            link: '/apps/satisfaction-survey/survey-history',
          },
          {
            label: 'Assigned Surveys',
            link: '/apps/satisfaction-survey/assigned-surveys',
          },

        ]
      },
      // {
      //   label: 'Private Survey',
      //   link: '/apps/satisfaction-survey/private-survey',
      // },
    ]
  },

  // {
  //   label: 'ADMIN CONSOLE',
  //   isTitle: true
  // },
  // {
  //   label: 'User Management',
  //   icon: 'users',
  //    link: '/apps/user-management/history',
  //   // link: '/apps/under-construction',

  // {
  //   label: 'ADMIN CONSOLE',
  //   isTitle: true
  // },
  // {
  //   label: 'User Management',
  //   icon: 'users',
  //    link: '/apps/user-management/history',
  //   // link: '/apps/under-construction',

  // // },
  // // {
  // //   label: 'Configuration',
  // //   icon: 'settings',
  // //   // link: '/general/blank-page',
  // //   link: '/apps/under-construction',

  // },



];
