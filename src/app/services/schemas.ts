export class authentication {
  jwt: string
  blocked: boolean
  user: {
    username: string
    SetPassword: boolean
  }

}
export class ehsCategory {
  attributes: {
    active: boolean
    category_name: string
    sub_categories: {
      data: {
        attributes: {
          active: boolean
          sub_category_name: string
        }
      }
    }
  }
}

export class ListColumn {
  name?: any;
  property?: any;
  visible?: boolean;
  isModelProperty?: boolean;
  displayFn: any;
}


export class surveyquestion {
  id: number
  created_date: any
  reference_number: string
  category: string
  question_category: string
  tags: any
  question_type: any
  question: any
  response_options: any
  question_weighting: any
  created_user: any
  multiplechoice_options: any
  business_unit: any
  status: string
  org_id: string
}

export class satisfactionsurvey {
  id: number
  created_date: any
  reference_number: string
  survey_type: string
  survey_category: string
  survey_title: any
  survey_description: any
  survey_start_date: any
  survey_end_date: any
  frequency: any
  participant_count: any
  language: any
  business_unit: any
  anonimity_option: any
  created_user: any
  before_5_miniutes: any
  before_10_miniutes: any
  before_15_miniutes: any
  before_30_miniutes: any
  before_1_hour: any
  before_2_hour: any
  before_1_day: any
  before_2_days: any
  disclaimer: any
  status: string
  org_id: string
}

export class ehs {
  id: number
  reported_date: any
  reference_number: string
  category: string
  sub_category: string
  level: string
  observation: string
  division: string
  location_department: string
  sub_location: string
  due_date: any
  description: string
  org_id: string
  Status: string
  Resolution: string
  reporter: any
  assignee: any
  evidence: any
  responsible: any
  created: any
  updated: any
}

export class client {

}
export class topic {

}
export class stackHolder {

}
export class survey {

}
export class inspection {

}
export class question {

}
export class geo_tag {

}
export class attrition {
  id: number
  reported_date: any
  reference_number: string
  employee_id: string
  employee_name: string
  gender: string
  date_of_join: any
  division: string
  resigned_date: any
  relieved_date: any
  department: string
  tenure_split: string

}
export class clinical {
  id: number
  visit_date: any
  patient_id: string
  employee_name: string
  age: number
  check_in: any
  consulting_doctor: string

}
export class engagement {
  id: number
  reported_date: any
  reference_number: string
  event_title: string
  event_start_date: any
  event_end_date: any
  completed_date: any
  status: string

}
export class equipment {
  id: number
  reported_date: any
  reference_number: string
  event_title: string
  event_start_date: any
  event_end_date: any
  completed_date: any
  status: string

}
export class accident_witness {
  id: number
  employee_id: string
  name: any
  company: any
  division: string
  department: string

}

export class accident_register {
  id: number
  reference_number: string
  accident_date: any
  accident_time: any
  severity: string
  division: string
  department: string
  location: string
  supervisor_name: string
  reported_date: any
  org_id: string
  evidence_type: string
  evidence_name: string
  evidence_id: number
}


export class witness {
  id: number
  employee_id: string
  name: string
  division: string
  department: string
  constructor(data: any) {

    this.id = data.id
    this.employee_id = data.employee_id
    this.name = data.name
    this.division = data.division
    this.department = data.department

  }
}

export class impact {
  id: number
  certificate_name: string
  certificate_issued_date: string
  certificate_expiry_date: string
  test_date: string
  test_lab: string
  positive_list: string
  remarks: string
  certificate: string

  constructor(data: any) {

    this.id = data.id
    this.certificate_name = data.certificate_name
    this.certificate_issued_date = data.certificate_issued_date
    this.certificate_expiry_date = data.certificate_expiry_date
    this.test_date = data.test_date
    this.test_lab = data.test_lab
    this.positive_list = data.positive_list
    this.remarks = data.remarks
    this.certificate = data.certificate

  }
}

export class assignment {

}
export class user {
  id: number
  first_name: string
  last_name: string
  designation: string
  escalate_email: string
  email: string
  gender: string
  password: string
  employee_id: string
  ehs_dashboard: string
  constructor(data: any) {

    this.id = data.id
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.designation = data.designation
    this.escalate_email = data.escalate_email
    this.email = data.email
    this.gender = data.gender
    this.password = data.password
    this.employee_id = data.employee_id
    this.ehs_dashboard = data.ehs_dashboard
  }
}
export class certificate {
  id: number
  impact_type: string
  impact_unit: string
  impact_value: string
  constructor(data: any) {

    this.id = data.id
    this.impact_type = data.impact_type
    this.impact_unit = data.impact_unit
    this.impact_value = data.impact_value

  }
}

export class dispose {
  id: number
  authorized_contractor: string
  disposal_details: string
  disposed_quantity: number
  constructor(data: any) {

    this.id = data.id
    this.authorized_contractor = data.authorized_contractor
    this.disposal_details = data.disposal_details
    this.disposed_quantity = data.disposed_quantity

  }
}
export class action {
  id: number
  finding: string
  action_plan: string
  root_cause: string
  priority: string
  actual_completion_date: any
  due_date: any
  audid: string
  constructor(data: any) {

    this.id = data.id
    this.audid = data.audid
    this.finding = data.finding
    this.action_plan = data.action_plan
    this.root_cause = data.root_cause
    this.priority = data.priority
    this.actual_completion_date = data.actual_completion_date
    this.due_date = data.due_date
  }
}


export class addquestion {
  org_id: string
  language: string
  question: string
}

export class Multiselectquestion {
  org_id: string
  Question: any[]
}

export class SurveyParticipants {
  id: number
  org_id: string
  Employee: string
  addparticipants: boolean
}

export class accident_people {
  id: number
  age: number
  date_of_join: any
  designation: string
  employee_id: string
  gender: string
  industry_experience: string
  org_id: string
  person_name: string
  person_type: string
  employment_duration: string

  constructor(data: any) {
    this.id = data.id;
    this.age = data.age;
    this.date_of_join = data.date_of_join;
    this.designation = data.designation;
    this.employee_id = data.employee_id;
    this.gender = data.gender;
    this.industry_experience = data.industry_experience;
    this.org_id = data.org_id;
    this.person_name = data.person_name;
    this.person_type = data.person_type;
    this.employment_duration = data.employment_duration
  }
}

export class accident_expense {
  id: number
  attributes: {
    category: string
    particular: string
    amount: number
  }

}

export class accident_corrective_actions {
  id: number
  action: string
  due_date: any
  completed_date: any
  status: string
  assignee: {
    id: number
  }
  accident: {
    id: number
  }
}
export class accident_corrective_actions_register {
  id: number
  action: string
  due_date: any
  completed_date: any
  status: string
  assignee: {
    id: number
  }
  accident: {
    id: number
  }
}

export class internal_audit_regsiter {
  id: number
}
export class external_audit_register {
  id: number
}
export class external_audit_corrective_register{
  id:number  
  status: string
}

export class incident {
  id: number
  reference_number: string
  reported_date: any
  reported_time: any
  incident_date: any
  incident_time: any
  division: string
  location: string
  description: string
  circumstances: string
  severity: string
  severity_impact: string
  updated_date: any
  updated_time: any
  status: string
  resolution: string
  assignee_notification: boolean
}

export class temp {
  id: number
  attributes: {

  }
}

export class environment_register {
  id: number
  year: string
  month: string
  division: string
  category: string
  reviewer: any
  work_force: any
  worked_days: any
  product_produced: any
  area: any
  reference_number: string
}

export class consumption {
  id: number
  source: string
  quantity: number
  unit: string
  amount: number
  scope: string
  description: string
  treatment_where: string
  category: string
  collected_from: string
  collected_to: string
  disposal_method: string
  consignment_number: string
  disposal_date: any
  disposer: string
  carrier: string
  place_of_disposal: string
  pollutants_emitted: string
  cocentration: string
  determined_by: string

  constructor(customer: any) {
    this.id = customer.id;
    this.source = customer.source
    this.quantity = customer.quantity
    this.unit = customer.unit
    this.amount = customer.amount
    this.scope = customer.scope
    this.description = customer.description
    this.treatment_where = customer.treatment_where
    this.category = customer.category
    this.collected_from = customer.collected_from
    this.collected_to = customer.collected_to
    this.disposal_method = customer.disposal_method
    this.consignment_number = customer.consignment_number
    this.disposal_date = customer.disposal_date
    this.disposer = customer.disposer
    this.carrier = customer.carrier
    this.place_of_disposal = customer.place_of_disposal
    this.pollutants_emitted = customer.pollutants_emitted
    this.cocentration = customer.cocentration
    this.determined_by = customer.determined_by
    // this.firstName = customer.firstName;
    // this.lastName = customer.lastName;
    // this.street = customer.street;
    // this.zipcode = customer.zipcode;
    // this.city = customer.city;
    // this.phoneNumber = customer.phoneNumber;
    // this.mail = customer.mail;
  }
}

export class checkList {
  id: number
}

export class chemical_request {
  id: number
  request_date: Date
  reference_number: string
  commercial_name: string
  substance_name: string
  formula: string
  reach_registration_number: string
  requested_quantity: number
  ZDHC_use_category: string
  usage: string
  division: any
  requested_customer: string
  requested_merchandiser: string
  approver: string
  status: string
  reporter: any
}

export class chemical_inventory {
  id: any

  attributes: {
    request_date: Date
    reference_number: string
    commercial_name: string
    substance_name: string
    formula: string
    reach_registration_number: string
    requested_quantity: number
    ZDHC_use_category: string
    usage: string
    division: any
    requested_customer: string
    requested_merchandiser: string
    approver: string
    status: string
    reporter: any,
    delivery_date: any,
    delivered_quantity: any,
    balance: any,
    threshold_limit: any,
    msds_warning_date: any,
    msds_sds: any,
    msds_sds_expiry_date: any,
    certificates: {}

  }


}

export class medicine_inventory {
  id: any

  attributes: {
    request_date: Date
    reference_number: string
    commercial_name: string
    substance_name: string
    formula: string
    reach_registration_number: string
    requested_quantity: number
    ZDHC_use_category: string
    usage: string
    division: any
    requested_customer: string
    requested_merchandiser: string
    approver: string
    status: string
    reporter: any,
    delivery_date: any,
    delivered_quantity: any,
    balance: any,
    threshold_limit: any,
    msds_warning_date: any,
    msds_sds: any,
    msds_sds_expiry_date: any,
    certificates: {}

  }
}
export class chemical_transaction {
  id: number
  reference_number: string
  division: string
  authorized_person: string
  chemical: string
  total_quantity: any
  issued_quantity: any
  disposed_quantity: any
  balance: any
  created_user: any
  department: any
  unit: any
  disposals: any
}
export class medicine_transaction {
  id: number
  reference_number: string
  division: string
  authorized_person: string
  medicine: string
  total_quantity: any
  issued_quantity: any
  disposed_quantity: any
  balance: any
  created_user: any
  department: any
  unit: any
  disposals: any
}
export class Products {
  id: number
}


export class medicine_request {
  id: number
  request_date: Date
  reference_number: string
  medicine_name: string
  generic_name: string
  division: any
  approver: string
  status: string
}

export class maternity {
  id: number
  employee_id: any
  employee_name: any
  designation: any
  department: any
  join_date: any
  application_id: any
  application_name: any

}


