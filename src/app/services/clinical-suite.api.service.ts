import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-datatable';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';
import { category } from '../apps/audit-inspection/audit-calendar/audit-calendar/data';

@Injectable({
  providedIn: 'root',
})
export class ClinicalSuiteService extends AppService {
  token: string;

  constructor(private http: HttpClient) {
    super();
  }
  public generate_occupational_data(start: any, end: any) {




    return this.http.get(AppService.base_url + AppService.clinical_suite + '?filters[check_in][$gte]=' + start + '&filters[check_in][$lte]=' + end + '&filters[patient_status][$ne]=Draft&populate[0]=consulting_doctor&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
  }
  public generate_occupational_division_data(start: any, end: any, userDivision: any) {
    return this.http.get(AppService.base_url + AppService.clinical_suite + '?filters[check_in][$gte]=' + start + '&filters[check_in][$lte]=' + end + '&' + userDivision + '&filters[patient_status][$ne]=Draft&populate[0]=consulting_doctor&populate=business_unit&pagination[limit]=-1&sort[0]=id:desc')
  }
  public get_medicine_name() {
    return this.http.get(
      AppService.base_url +
      AppService.medicine_name +
      '?pagination[limit]=-1&sort[0]=id:desc'
    );
  }
  public get_pharmacy_queue(startIndex: number, pageSize: number) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?filters[patient_status]=Completed&filters[medicine_status]=Pending&populate[0]=consulting_doctor&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_hospital_names() {
    return this.http.get(AppService.base_url + AppService.hospital + '?pagination[limit]=-1&sort[0]=id:desc')
  }

  public create_hospital_name(name: any, id: any) {
    return this.http.post(AppService.base_url + AppService.hospital, {
      data: {
        name: name,
        created_user: id
      },
    });
  }
  public get_hospital_name_details(id: any) {
    return this.http.get(AppService.base_url + AppService.hospital + "/" + id)
  }

  public update_hospital_name(data: any) {
    return this.http.put(
      AppService.base_url + AppService.hospital + '/' + data.id,
      {
        data: {
          name: data.name
        }
      }
    );
  }
  public delete_hospital_name(id: any) {
    return this.http.delete(AppService.base_url + AppService.hospital + '/' + id)
  }




  public get_unit_specific_pharmacy_queue(startIndex: number, pageSize: number, division: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite + '?' + division +
      '&filters[patient_status]=Completed&filters[medicine_status]=Pending&populate[0]=consulting_doctor&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_clinical_register() {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?populate[0]=consulting_doctor&populate[1]=consulting_doctor.image&pagination[limit]=-1&sort[0]=id:desc'
    );
  }
  public get_clinic_count() {
    return this.http.get(AppService.base_url + AppService.clinical_suite + '?pagination[limit]=-1&sort[0]=id:desc')
  }
  public get_clinical_history(startIndex: number, pageSize: number) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?populate[0]=consulting_doctor&populate[1]=consulting_doctor.image&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_unit_specific_clinical_history(startIndex: number, pageSize: number, division: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite + '?' + division +
      '&populate[0]=consulting_doctor&populate[1]=consulting_doctor.image&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }

  public get_division_date_filter(data: string, startIndex: number, pageSize: number) {
    return this.http.get(`${AppService.base_url}${AppService.clinical_suite}?populate[0]=consulting_doctor&${data}&pagination[start]=${startIndex}&pagination[limit]=${pageSize}&sort[0]=id:desc`)

  }
  public get_consultation_register(
    doctor: any,
    startIndex: number,
    pageSize: number
  ) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?filters[consulting_doctor]=' +
      doctor +
      '&filters[patient_status]=Pending&populate[0]=consulting_doctor&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_unit_specific_consultation_register(
    doctor: any,
    startIndex: number,
    pageSize: number, division: any
  ) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite + '?' + division +
      '&filters[consulting_doctor]=' +
      doctor +
      '&filters[patient_status]=Pending&populate[0]=consulting_doctor&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_clinical_reference(reference: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?filters[patient_id][$eq]=' +
      reference
    );
  }
  public get_employee_details(employeeID: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?filters[employee_id][$eq]=' +
      employeeID
    );
  }
  public get_clinical_details(id: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?populate=consulting_doctor&populate=created_By&populate=business_unit&populate=medical_prescriptions&populate=patient_histories&populate=medicine_details&populate=patient_histories.consulting_doctor&filters[id][$eq]=' +
      id
    );
  }


  //get clinical suit reference
  public get_clinical_suit_reference(reference: any) {
    return this.http.get(AppService.base_url + AppService.clinical_suite + '?filters[patient_id]=' + reference + '&populate=consulting_doctor&populate=created_By&populate=business_unit&populate=medical_prescriptions&populate=patient_histories&populate=medicine_details&populate=patient_histories.consulting_doctor')
  }
  public get_patient_details(id: any) {
    return this.http.get(
      AppService.base_url +
      AppService.patient_reconsultation + '?populate=consulting_doctor&populate=created_By&populate=business_unit&populate=medical_prescriptions&populate=medicine_details&filters[id][$eq]=' + id
    );
  }
  public get_resignation_type() {
    return this.http.get(
      AppService.base_url +
      AppService.resignation_type +
      '?pagination[limit]=-1&sort[0]=id:desc'
    );
  }
  public get_symptoms() {
    return this.http.get(
      AppService.base_url +
      AppService.symptoms +
      '?pagination[limit]=-1&sort[0]=id:desc'
    );
  }
  public get_clinical_suite_refe(reference: any) {
    return this.http.get(
      AppService.base_url +
      AppService.clinical_suite +
      '?filters[patient_id]=' +
      reference +
      '&populate=consulting_doctor&populate=created_By&populate=business_unit&populate=medical_prescriptions&populate=medicine_details&populate=clinical_suite'
    );
  }
  public get_medicine_stock(startIndex: number, pageSize: number) {
    return this.http.get(
      AppService.base_url +
      AppService.medicine_stock +
      '?pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }
  public get_unit_specific_medicine_stock(startIndex: number, pageSize: number, division: any) {
    return this.http.get(
      AppService.base_url +
      AppService.medicine_stock + '?' + division +
      '&pagination[start]=' +
      startIndex +
      '&pagination[limit]=' +
      pageSize +
      '&sort[0]=id:desc'
    );
  }

  public get_medical_stock_id(medID: any, division: any) {
    return this.http.get(
      AppService.base_url +
      AppService.medicine_stock +
      '?filters[medicine_uuid][$eq]=' +
      medID +
      '&filters[division][$eq]=' +
      division
    );
  }
  public create_medicine(data: any, user: any) {
    return this.http.post(AppService.base_url + AppService.medicine_name, {
      data: {
        name: data.name,
        created_user: user,
        uuid: data.uuid,
      },
    });
  }

  public create_symptom(name: any, user: any) {
    return this.http.post(AppService.base_url + AppService.symptoms, {
      data: {
        name: name,
        created_user: user,
      },
    });
  }
  //create clinical
  public create_patient_record(data: any) {
    return this.http.post(AppService.base_url + AppService.clinical_suite, {
      data: {
        check_in: data.check_in,
        department: data.department,
        designation: data.designation,
        employee_id: data.employee_id,
        employee_name: data.employee_name,
        gender: data.gender,
        age: data.age,
        sub_department: data.sub_department,
        work_status: data.work_status,
        service_period: data.service_period,
        disease: data.disease,
        severity_level: data.severity_level,
        symptom: data.symptoms,
        treatment: data.treatment,
        consulting_doctor: data.consulting_doctor,
        body_temperature: data.body_temperature,
        weight: data.weight,
        blood_pressure: data.blood_pressure,
        random_blood_sugar: data.random_blood_sugar,
        patient_status: data.status,
        patient_id: data.patient_id,
        clinic_division: data.clinic_division,
        created_By: data.reporter,
        division: data.division,
        height: data.height,
        business_unit: data.business_unit,
        follow_up_date: data.follow_up_date,
        check_in_date: data.check_in_date,
        year: data.year,
        check_out: data.check_out,
        check_out_date: data.check_out_date

      },
    });
  }

  public create_patient_reconsultation(data: any, medicalDetailsId: any, medicalPrescriptionId: any) {

    return this.http.post(AppService.base_url + AppService.patient_reconsultation, {
      data: {
        check_in: data.attributes.check_in,
        check_out: data.attributes.check_out,
        department: data.attributes.department,
        designation: data.attributes.designation,
        employee_id: data.attributes.employee_id,
        employee_name: data.attributes.employee_name,
        gender: data.attributes.gender,
        age: data.attributes.age,
        sub_department: data.attributes.sub_department,
        work_status: data.attributes.work_status,
        service_period: data.attributes.service_period,
        disease: data.attributes.disease,
        severity_level: data.attributes.severity_level,
        symptom: data.attributes.symptom,
        treatment: data.attributes.treatment,
        consulting_doctor: data.attributes.consulting_doctor?.data?.id,
        body_temperature: data.attributes.body_temperature,
        weight: data.attributes.weight,
        blood_pressure: data.attributes.blood_pressure,
        random_blood_sugar: data.attributes.random_blood_sugar,
        patient_status: data.attributes.patient_status,
        patient_id: data.attributes.patient_id,
        clinic_division: data.attributes.clinic_division,
        created_By: data.attributes.created_By.data.id,
        division: data.attributes.division,
        height: data.attributes.height,
        follow_up_date: data.attributes.follow_up_date,
        check_in_date: data.attributes.check_in_date,
        follow_up_status: data.attributes.follow_up_status,
        prescription: data.attributes.prescription,
        hospital_name: data.attributes.hospital_name,
        hospital_location: data.attributes.hospital_location,
        doctor_prescription: data.attributes.doctor_prescription,
        admitted_date: data.attributes.admitted_date,
        discharged_date: data.attributes.discharged_date,
        sent_via_ambulance: data.attributes.sent_via_ambulance,
        refer_to_another_hospital: data.attributes.refer_to_another_hospital,
        since_complaint: data.attributes.since_complaint,
        recommended_duration: data.attributes.recommended_duration,
        lift_usage_required: data.attributes.lift_usage_required,
        medicine_status: data.attributes.medicine_status,
        clinical_suite: data.id,
        medical_prescriptions: medicalPrescriptionId,
        medicine_details: medicalDetailsId,
        business_unit: data.attributes.business_unit.data.id,
        refer_patient: data.attributes.refer_patient,
        refer_to_home: data.attributes.refer_to_home,
        category: data.attributes.category,
        health_issue_type: data.attributes.health_issue_type

      }
    });
  }
  public remove_data_clinical_suite(data: any) {

    return this.http.put(AppService.base_url + AppService.clinical_suite + '/' + data.id, {
      data: {
        // check_in: null,
        disease: null,
        category: null,
        health_issue_type: null,
        severity_level: null,
        treatment: null,
        follow_up_date: null,
        check_in_date: null,
        follow_up_status: false,
        doctor_prescription: null,
        hospital_name: null,
        hospital_location: null,
        admitted_date: null,
        discharged_date: null,
        sent_via_ambulance: false,
        refer_to_another_hospital: false,
        since_complaint: null,
        recommended_duration: null,
        lift_usage_required: false,
        medical_prescriptions: null,
        medicine_details: null,
        patient_status: "Reconsultation",
        medicine_status: "Pending",
        check_out_date: null,
        check_in: null,
        check_out: null,
        refer_patient: false,
        refer_to_home: false

      }
    });
  }

  public update_symptom(data: any, user: any) {
    return this.http.put(AppService.base_url + AppService.symptoms + '/' + data.id, {
      data: {
        name: data.symptom,
        created_user: user,
      }
    })
  }
  public get_symptom_details(id: any) {
    return this.http.get(AppService.base_url + AppService.symptoms + "/" + id)
  }
  public delete_symptom(id: any) {
    return this.http.delete(AppService.base_url + AppService.symptoms + '/' + id)
  }

  public update_patient_record(data: any) {
    return this.http.put(AppService.base_url + AppService.clinical_suite + '/' + data.id, {
      data: {
        check_in: data.check_in,
        department: data.department,
        designation: data.designation,
        employee_id: data.employee_id,
        employee_name: data.employee_name,
        gender: data.gender,
        age: data.age,
        sub_department: data.sub_department,
        work_status: data.work_status,
        service_period: data.service_period,
        disease: data.disease,
        severity_level: data.severity_level,
        symptom: data.symptoms,
        treatment: data.treatment,
        consulting_doctor: data.doctor_name,
        body_temperature: data.body_temperature,
        weight: data.weight,
        blood_pressure: data.blood_pressure,
        random_blood_sugar: data.random_blood_sugar,
        patient_status: data.status,
        patient_id: data.patient_id,
        clinic_division: data.clinic_division,
        created_By: data.reporter,
        division: data.employee_division,
        height: data.height,
        business_unit: data.business_unit,
        follow_up_date: data.follow_up_date,
        check_in_date: data.check_in_date,

      },
    });
  }
  public create_prescription(data: any, id: any) {
    return this.http.post(
      AppService.base_url + AppService.medical_prescription,
      {
        data: {
          medicine_name: data.medicine_name,
          dosage: data.dosage,
          days: data.days,
          usage: data.usage,
          status: data.issue_status,
          clinical_suite: id,
          medicine_uuid: data.medicine_uuid,
          outside_medicine: data.outside_medicine
        },
      }
    );
  }
  public create_non_consultaion_prescription(data: any, id: any) {
    return this.http.post(
      AppService.base_url + AppService.medical_prescription,
      {
        data: {
          medicine_name: data.medicine_name,
          dosage: data.dosage,
          days: data.days,
          usage: data.usage,
          status: data.issue_status,
          medicine_uuid: data.medicine_uuid,
          outside_medicine: data.outside_medicine,
          clinical_suite: id,
        },
      }
    );
  }

  public get_medical_prescription(id: any) {
    return this.http.get(
      AppService.base_url +
      AppService.medical_prescription
      + "/" + id
    );
  }
  public create_medical_details(data: any, id: any) {
    return this.http.post(
      AppService.base_url + AppService.medical_prescription,
      {
        data: {
          medicine_name: data.medicine_name,
          dosage: data.dosage,
          days: data.days,
          usage: data.usage,
          status: data.issue_status,
          clinical_suite_medicine_details: id,
          medicine_uuid: data.medicine_uuid,
          outside_medicine: data.outside_medicine
        },
      }
    );
  }

  public update_medical_stock(id: any, quantity: any, balance: any) {
    return this.http.put(
      AppService.base_url + AppService.medicine_stock + '/' + id,
      {
        data: {
          received: quantity,
          // issued: quantity,
          balance: balance,
          last_updated: new Date(),
        },
      }
    );
  }

  public update_issued_medical_stock(id: any, issued: any, balance: any) {
    return this.http.put(
      AppService.base_url + AppService.medicine_stock + '/' + id,
      {
        data: {
          issued: issued,
          balance: balance,
        },
      }
    );
  }

  public update_prescription_status(status: any, id: any, quantity: any) {
    return this.http.put(
      AppService.base_url + AppService.medical_prescription + '/' + id,
      {
        data: {
          status: status,
          issued_quantity: quantity
        },
      }
    );
  }

  public mark_check_out(id: any, data: any) {
    return this.http.put(
      AppService.base_url + AppService.clinical_suite + '/' + id,
      {
        data: {
          check_out: new Date(data.check_out),
          check_out_date: new Date(data.check_out_date),
          medicine_status: 'Completed',
        },
      }
    );
  }

  public create_medical_stock(
    quantity: any,
    medicine: any,
    medicine_uuid: any,
    division: any,
    business_unit: any
  ) {
    return this.http.post(AppService.base_url + AppService.medicine_stock, {
      data: {
        medicine_name: medicine,
        received: quantity,
        issued: 0,
        balance: quantity,
        division: division,
        last_updated: new Date(),
        medicine_uuid: medicine_uuid,
        business_unit: business_unit
      },
    });
  }
  public update_clinical_suite(data: any) {
    return this.http.put(
      AppService.base_url + AppService.clinical_suite + '/' + data.id,
      {
        data: {
          severity_level: data.severity_level,
          disease: data.disease,
          treatment: data.treatment,
          follow_up_status: data.follow_up_status,
          follow_up_date: data.follow_up_date,
          prescription: data.prescription,
          patient_status: data.status,
          hospital_name: data.hospital_name,
          hospital_location: data.hospital_location,
          doctor_prescription: data.doctor_prescription,
          admitted_date: data.admitted_date,
          discharged_date: data.discharged_date,
          sent_via_ambulance: data.sent_via_ambulance,
          refer_to_another_hospital: data.refer_another_hospital_status,
          since_complaint: data.since_complaint,
          recommended_duration: data.recommended_duration,
          lift_usage_required: data.lift_usage_required,
          refer_patient: data.refer_patient,
          refer_to_home: data.refer_to_home,
          leave_days: data.leave_days,
          category: data.category,
          health_issue_type: data.health_issue_type,
          check_out: data.check_out,
          check_out_date: data.check_out_date
        },
      }
    );
  }
  public update_clinical_suite_field_remove(data: any) {
    return this.http.put(
      AppService.base_url + AppService.clinical_suite + '/' + data.id,
      {
        data: {
          severity_level: data.severity_level,
          disease: data.disease,
          treatment: data.treatment,
          follow_up_status: data.follow_up_status,
          follow_up_date: data.follow_up_date,
          prescription: data.prescription,
          patient_status: data.status,
          hospital_name: null,
          hospital_location: null,
          doctor_prescription: null,
          admitted_date: null,
          discharged_date: null,
          sent_via_ambulance: false,
          refer_to_another_hospital: data.refer_another_hospital_status,
          since_complaint: data.since_complaint,
          recommended_duration: data.recommended_duration,
          lift_usage_required: data.lift_usage_required,
          refer_patient: data.refer_patient,
          refer_to_home: data.refer_to_home,
          leave_days: data.leave_days,
          category: data.category,
          health_issue_type: data.health_issue_type
        },
      }
    );
  }



  public update_clinical_suite_reconsultation(data: any) {
    return this.http.put(
      AppService.base_url + AppService.clinical_suite + '/' + data.id,
      {
        data: {
          // severity_level: data.severity_level,
          // disease: data.disease,
          // treatment: data.treatment,
          // follow_up_status: data.follow_up_status,
          // follow_up_date: data.follow_up_date,
          // prescription: data.prescription,
          // patient_status: data.status,
          // hospital_name: data.hospital_name,
          // hospital_location: data.hospital_location,
          // doctor_prescription: data.doctor_prescription,
          // admitted_date: data.admitted_date,
          // discharged_date: data.discharged_date,
          // sent_via_ambulance: data.sent_via_ambulance,
          // refer_to_another_hospital: data.refer_another_hospital_status,
          // since_complaint: data.since_complaint,
          // recommended_duration: data.recommended_duration,
          // lift_usage_required: data.lift_usage_required,

          random_blood_sugar: data.random_blood_sugar,
          body_temperature: data.body_temperature,
          weight: data.weight,
          height: data.height,
          check_in: data.check_in,
          check_in_date: data.check_in_date,
          blood_pressure: data.blood_pressure,
          work_status: data.work_status,
          consulting_doctor: data.consulting_doctor,
          patient_status: data.status,
          symptom: data.symptoms,
          check_out: data.check_out,
          check_out_date: data.check_out_date




        },
      }
    );
  }
  public update_clinical_suite_field_remove_reconsultation(data: any) {
    // console.log(data, 'this sis data')
    return this.http.put(
      AppService.base_url + AppService.clinical_suite + '/' + data.id,
      {
        data: {
          // severity_level: data.severity_level,
          // disease: data.disease,
          // treatment: data.treatment,
          // follow_up_status: data.follow_up_status,
          // follow_up_date: data.follow_up_date,
          // prescription: data.prescription,
          // patient_status: data.status,
          // hospital_name: null,
          // hospital_location: null,
          // doctor_prescription: null,
          // admitted_date: null,
          // discharged_date: null,
          // sent_via_ambulance: false,
          // refer_to_another_hospital: data.refer_another_hospital_status,
          // since_complaint: data.since_complaint,
          // recommended_duration: data.recommended_duration,
          // lift_usage_required: data.lift_usage_required,


          random_blood_sugar: data.random_blood_sugar,
          body_temperature: data.body_temperature,
          weight: data.weight,
          height: data.height,
          check_in: data.check_in,
          blood_pressure: data.blood_pressure,
          consulting_doctor: data.consulting_doctor,


        },
      }
    );
  }



  public delete_prescription(id: any) {
    return this.http.delete(
      AppService.base_url + AppService.medical_prescription + '/' + id
    );
  }

  public check_medicine(uuid: any, division: any) {
    return this.http.get(
      AppService.base_url +
      AppService.medicine_stock +
      '?filters[medicine_uuid]=' +
      uuid +
      '&filters[division]=' +
      division
    );
  }

  //register reports
  public patient_register_report_pdf(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_patient_register_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_register_report_excel(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_patient_register_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_register_report_pdf_2(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_patient_register_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_register_report_excel_2(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/sattva_patient_register_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_report(id: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/individual_patient_report_1.pdf?Patient_ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public lift_usage_report_pdf(id: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/lift_usage_report_pdf.pdf?Patient_ID=' + id + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_referral_register_report_pdf(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/patient_referral_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_referral_register_report_excel(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/patient_referral_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&division=' + data.division + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_referral_register_report_pdf_2(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/patient_referral_register_report_pdf.pdf?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }

  public patient_referral_register_report_excel_2(data: any): any {
    return this.http.get(AppService.report + 'reports/reports/' + environment.report_location + '/patient_referral_register_report_excel.xlsx?start_date=' + data.check_start_date + '&end_date=' + data.check_end_date + '&company_name=' + data?.company_name + '&reporting_person=' + data.reporting_person + '&reporting_email=' + data.reporting_email + '&j_username=' + environment.j_username + '&j_password=' + environment.j_password, { responseType: 'blob', headers: { skip: "true" } })
  }


  public update_feedback(data: any, id: any) {

    return this.http.put(AppService.base_url + AppService.clinical_suite + '/' + id, {
      data: {
        rating: data.rating,
        feedback: data.feedback,

      },
    });
  }
}
