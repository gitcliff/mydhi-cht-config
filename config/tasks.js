const {
  MAX_DAYS_IN_PREGNANCY,
  DAYS_IN_PNC,
  MS_IN_DAY,
  isFormFromArraySubmittedInWindow,
  //  isFormArraySubmittedInWindow,
  isCoveredByUseCase,
  getNewestPregnancyTimestamp,
  getNewestDeliveryTimestamp,
  isHighRiskPregnancy,
  deliveryForms,
  antenatalForms,
  postnatalForms,
  isHomeBirth,
  immunizationMonths,
  immunizationForms,
  // addDays,
  getField

} = require('./nools-extras');

module.exports = [
  {
    name: 'appointment-reminder-task',
    title: 'Appointment Reminder',
    icon: 'assessment',
    appliesTo: 'reports',
    appliesToType: ['appointment'],
    appliesIf: function(c, r){
      return r.fields.appoint.type_appoint === 'clinical appointment' || r.fields.appoint.type_appoint === 'internal referral' ||
      r.fields.appoint.type_appoint === 'external referral' || r.fields.appoint.type_appoint === 'adherence counselor appointment' ||
      r.fields.appoint.type_appoint === 'psychologist appointment' ||  r.fields.appoint.type_appoint === 'pharmacy' ||
      r.fields.appoint.type_appoint === 'social worker appointment' 
      || r.fields.appoint.type_appoint === 'case manager appointment ';
    },
    actions: [{ form: 'appointment_reminder', 
    modifyContent: function (content, contact, report) {
      content.field_app_type = getField(report, 'appoint.type_appoint');
      content['inputs'] = {

        field_blood_draw_type: getField(report, 'appoint.lab_test'),
        field_date_of_appointment: getField(report, 'appoint.date_appoint'),
        field_notes: getField(report, 'appoint.welcome'),
        person_comp: getField(report, 'appoint.complete'),
        field_date_task_appears: getField(report, 'appoint.reminder'),

        };
      }
   }],
    events: [{
      id:'appointment-seven',
      start: 7,
      end: 0,
      dueDate: function (event, contact, r) {

        return Utils.addDate(new Date(getField(r, 'appoint.date_appoint')), 0);
      }
    },
    {
      id: 'appointment-three',
      start: 3,
      end: 0,
      dueDate: function (event, contact, r) {

        return Utils.addDate(new Date(getField(r, 'appoint.date_appoint')), 0);
      }
    }
  ],
    resolvedIf: function(c) {
      // Find the matching reminder report
      const reminderReport = c.reports.find(report => {
        return report.form === 'appointment_reminder';
      });

      // Clear task only if 'soon_noted' was selected
      return reminderReport && reminderReport.fields.appointment_reminder.upcoming === 'soon_noted';
    },
  },

  {
    name: 'blood-appointment-reminder-task',
    title: 'Blood draw Appointment Reminder',
    icon: 'assessment',
    appliesTo: 'reports',
    appliesToType: ['appointment'],
    appliesIf: function(c, r){
      return r.fields.appoint.type_appoint === 'blood draw appointment';
      
    },
    actions: [{ form: 'blood_draw_appointment_reminder', 
  
    modifyContent: function (content, contact, report) {
      content.field_app_type = getField(report, 'appoint.type_appoint');

      content['inputs'] = {

        field_blood_draw_type: getField(report, 'appoint.lab_test'),
        field_date_of_appointment: getField(report, 'appoint.date_appoint'),
        field_notes: getField(report, 'appoint.welcome'),
        person_comp: getField(report, 'appoint.complete')

        };
      }
   }],
    events: [{
      id:'appointment-seven',
      start: 7,
      end: 1,
      dueDate: function (event, contact, r) {
      
        return Utils.addDate(new Date(getField(r, 'appoint.date_appoint1')), 0);
      }
    },
    {
      id:'appointment-three',
      start: 3,
      end: 1,
      dueDate: function (event, contact, r) {
      
        return Utils.addDate(new Date(getField(r, 'appoint.date_appoint1')), 0);
      }
    }
  ],
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there is a reminder received in time window
      return isFormFromArraySubmittedInWindow(c.reports, 'reminder',
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },
  
  {
    name: 'reminder-follow-up-task',
    title: 'Task Reminder',
    icon: 'assessment',
    appliesTo: 'reports',
    appliesToType: ['create'],
    actions: [{ form: 'reminder', 
    modifyContent: function (content, contact, report) {
      content.my_field_title = getField(report, 'create.title');
      content['inputs'] = {

         my_field_note: getField(report, 'create.notes'),
         my_field_when: getField(report, 'create.reminder'),
        };
      }
   }],
    events: [{
      start: 20,
      end: 1,
      dueDate: function (event, contact, r) {
        return Utils.addDate(new Date(getField(r, 'create.reminder')), 0);
      }
    }],
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there is a reminder received in time window
      return isFormFromArraySubmittedInWindow(c.reports, 'reminder',
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },
  {
    name: 'very_bad',
    title: 'Patient is feeling bad',
    icon: 'assessment',
    appliesTo: 'reports',
    appliesToType: ['lab'],
    appliesIf: function(c, r){
      return r.fields.appoint.this === 'snooze2';
    },
    actions: [{ form: 'situation', }],
    events: [{
      start: 1,
      days: 1,
      end: 1,
    }],
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there is cd4 lab appointment received in time window
      return isFormFromArraySubmittedInWindow(c.reports, 'situation',
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },
  // {
  //   name: 'schedule-cd4-task2',
  //   title: 'Schedule CD4 Task',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['lab'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.this === 'snooze2';
  //   },
  //   actions: [{ form: 'count', }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function(c, r, event, dueDate) {
  //     // Resolved if there is cd4 lab appointment received in time window
  //     return isFormFromArraySubmittedInWindow(c.reports, 'count',
  //                Utils.addDate(dueDate, -event.start).getTime(),
  //                Utils.addDate(dueDate,  event.end+1).getTime());
  //   },
  // },

  // {
  //   name: 'viral-load-test-task',
  //   title: 'Viral Load Lab Test Result Task',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['appointment'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.lab_test === 'viral load';
  //   },
  //   actions: [{ form: 'load', 
  //   modifyContent: function (content, contact, report) {
  //     content.my_field_load = getField(report, 'appoint.lab_test');
  //     content['inputs'] = {
  //        load_field_date: getField(report, 'appoint.date_appoint'),
  //       };
  //     }
  //  }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'load' && r.fields.load.result3 === 'okay' && r.form === 'load' && r.fields.load.result === 'yes' 
  //       || r.form === 'load' && r.fields.load.result === 'un'; 
  //   });
  // }},
  // {
  //   name: 'cd4-lab-test-task',
  //   title: 'CD4 Lab Test Results Task',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['appointment'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.lab_test === 'cd4 count';
  //   },
  //   actions: [{ form: 'lab', 

  //   modifyContent: function (content, contact, report) {
  //     content.my_field_lab = getField(report, 'appoint.lab_test');
  //     content['inputs'] = {
  //        lab_field_date: getField(report, 'appoint.date_appoint'),
  //       };
  //     }
  //   }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
    
  //   resolvedIf: function(c){
  //       return c.reports.some(function(r){
  //         return r.form === 'lab' && r.fields.appoint.result === 'yes' || r.form === 'lab' && r.fields.appoint.result === 'un' ||
  //         r.form === 'lab' && r.fields.appoint.this === 'snooze1';
  //     });
  //   }
  // },
  // {
  //   name: 'appointment-follow-up-task',
  //   title: 'Appointment Follow-up Task',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['appointment'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.type_appoint === 'clinical appointment' || r.fields.appoint.type_appoint === 'social worker appointment' 
  //     || r.fields.appoint.type_appoint === 'case manager appointment ';
  //   },
  //   actions: [{ form: 'viral', 
  //   modifyContent: function (content, contact, report) {
  //     content.my_field_viral = getField(report, 'appoint.type_appoint');
  //     content['inputs'] = {

  //        viral_field_notes: getField(report, 'appoint.notes'),
  //        viral_field_date: getField(report, 'appoint.date_appoint'),
  //       };
  //     }
  //   }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'viral' && r.fields.appoint.has === 'noted';
  //   });
  //   }

  // },
  // {
  //   name: 'referral-follow-up-task',
  //   title: 'Referral Follow-up Task',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['appointment'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.type_appoint === 'internal referral' || r.fields.appoint.type_appoint === 'external referral';
  //   },
  //   actions: [{ form: 'referral', 
  //   modifyContent: function (content, contact, report) {
  //     content.my_field_referral = getField(report, 'appoint.type_appoint');
  //     content['inputs'] = {

  //        my_field_notes: getField(report, 'appoint.notes'),
  //        my_field_date: getField(report, 'appoint.date_appoint'),
  //       };
  //     }
  //  }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'referral' && r.fields.reminder.patient === 'comp';
  //   });
  //   }
  // },
  // {
  //   name: 'new-appointment-task-cd4b',
  //   title: 'New Appointment CD4',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['lab'],
  //   appliesIf: function(c, r){
  //     return r.fields.appoint.result === 'un' || r.fields.appoint.this === 'snooze1';
  //   },
  //   actions: [{ form: 'appointment1', }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function (contact, report, event, dueDate) {
  //     const startTime = Math.max(addDays(dueDate, -event.start).getTime(), contact.contact.reported_date);
  //     const endTime = addDays(dueDate, event.end).getTime();
  //     return isFormArraySubmittedInWindow(contact.reports, ['appointment1'], startTime, endTime);
  //   },
  // },

  // {
  //   name: 'new-appointment-task-viral1',
  //   title: 'New Appointment Viral Load',
  //   icon: 'assessment',
  //   appliesTo: 'reports',
  //   appliesToType: ['load'],
  //   appliesIf: function(c, r){
  //     return r.fields.load.result === 'un' || r.fields.load.result3 === 'okay';
  //   },
  //   actions: [{ form: 'appointment1', }],
  //   events: [{
  //     start: 1,
  //     days: 1,
  //     end: 1,
  //   }],
  //   resolvedIf: function (contact, report, event, dueDate) {
  //     const startTime = Math.max(addDays(dueDate, -event.start).getTime(), contact.contact.reported_date);
  //     const endTime = addDays(dueDate, event.end).getTime();
  //     return isFormArraySubmittedInWindow(contact.reports, ['appointment1'], startTime, endTime);
  //   },
  // },
  // {
  //   name: 'care-assessment-task',
  //   title: 'Level of care assessment task',
  //   icon: 'immunization',
  //   appliesTo: 'contacts',
  //   appliesToType: ['person'],
  //   appliesIf: c =>  c.contact.role ==='patient' && !c.contact.date_of_death && !c.contact.muted,
  //   actions: [{ form: 'care', }],
  //   events: [{
  //     start: 0,
  //     days: 0,
  //     end: 5,
  //   }],
  //   priority: {
  //     level: 'high',
  //     label: 'task.warning.high_risk',
  //   },
  //   resolvedIf: function(c, r, event, dueDate) {
  //     // Resolved if there is care received in time window
  //     return isFormFromArraySubmittedInWindow(c.reports, 'care',
  //                Utils.addDate(dueDate, -event.start).getTime(),
  //                Utils.addDate(dueDate,  event.end+1).getTime());
  //   },
  // },
 
  {
    name: 'pregnancy_danger_sign',
    icon: 'mother-child',
    title: 'task.pregnancy_danger_sign.title',
    appliesTo: 'reports',
    appliesToType: ['P', 'pregnancy'],
    appliesIf: function(c, r) {
      // ANC TASK if a F flag during pregnancy
      return Utils.isFormSubmittedInWindow(
        c.reports,
        'F',
        r.reported_date,
        Utils.addDate(
          new Date(r.reported_date),
          MAX_DAYS_IN_PREGNANCY
        ).getTime()
      );
    },
    actions: [{ form: 'pregnancy_visit' }],
    events: [
      {
        id: 'pregnancy-danger-sign',
        start: 0,
        end: 6,
        dueDate: function(event, c) {
          return new Date(
              Utils.getMostRecentTimestamp(c.reports, 'F')
          );
        },
      },
    ],
    priority: {
      level: 'high',
      label: 'task.warning.danger_sign',
    },
    resolvedIf: function(c, r, event, dueDate) {
      return (
        r.reported_date < getNewestDeliveryTimestamp(c) ||
        r.reported_date < getNewestPregnancyTimestamp(c) ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          'pregnancy_visit',
          Utils.addDate(dueDate, -event.start).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // Attach the missing birth schedule to the last scheduled SMS
  {
    name: 'pregnancy_missing_birth',
    icon: 'mother-child',
    title: 'task.pregnancy_missing_birth.title',
    appliesTo: 'reports',
    appliesToType: ['P', 'pregnancy'],
    appliesIf: function(c, r) {
      return r.scheduled_tasks;
    },
    actions: [{ form: 'delivery' }],
    events: [
      {
        id: 'pregnancy-missing-birth',
        start: 1,
        end: 13,
        dueDate: function(event, c, r) {
          return Utils.addDate(
            new Date(r.scheduled_tasks[r.scheduled_tasks.length - 1].due),
            7
          );
        },
      },
    ],
    priority: function(c, r) {
      if (isHighRiskPregnancy(c, r)) {
        return {
          level: 'high',
          label: 'task.warning.high_risk',
        };
      }
    },
    resolvedIf: function(c, r) {
      // Missing Birth Report
      // Resolved if the scheduled SMS that generated the task is cleared
      //          or if a birth report was submitted
      return (
        r.scheduled_tasks[r.scheduled_tasks.length - 1].state === 'cleared' ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          deliveryForms,
          r.reported_date,
          r.reported_date + (MAX_DAYS_IN_PREGNANCY + DAYS_IN_PNC) * MS_IN_DAY
        )
      );
    },
  },

  // Assign a missing visit schedule to last SMS of each group
  //
  // Associate tasks to the last message of each group, except the last one which needs a Missing Birth Report task.
  // The group needing Birth Report task is now in a separate schedule, which could have the same group number... so check the type as well.
  // Be mindful of overflow when peaking ahead!
  {
    name: 'pregnancy_missing_visit',
    icon: 'pregnancy-1',
    title: 'task.pregnancy_missing_visit.title',
    appliesTo: 'scheduled_tasks',
    appliesToType: ['P', 'pregnancy'],
    appliesIf: function(c, r, i) {
      return (
        i + 1 < r.scheduled_tasks.length &&
        (r.scheduled_tasks[i].group !== r.scheduled_tasks[i + 1].group ||
          r.scheduled_tasks[i].type !== r.scheduled_tasks[i + 1].type)
      );
    },
    actions: [{ form: 'pregnancy_visit' }],
    events: [
      {
        id: 'pregnancy-missing-visit',
        days: 7,
        start: 0,
        end: 6,
      },
    ],
    priority: function(c, r) {
      if (isHighRiskPregnancy(c, r)) {
        return {
          level: 'high',
          label: 'task.warning.high_risk',
        };
      }
    },
    resolvedIf: function(c, r, event, dueDate) {
      return (
        r.reported_date < getNewestPregnancyTimestamp(c) ||
        r.reported_date < getNewestDeliveryTimestamp(c) ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          antenatalForms,
          Utils.addDate(dueDate, -event.start).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // PNC TASK 1: If a home delivery, needs clinic tasks
  {
    name: 'postnatal_home_birth',
    icon: 'mother-child',
    title: 'task.postnatal_home_birth.title',
    appliesTo: 'reports',
    appliesToType: ['D', 'delivery'],
    appliesIf: function(c, r) {
      return (
        isCoveredByUseCase(c.contact, 'pnc') &&
        r.fields &&
        r.fields.delivery_code &&
        r.fields.delivery_code.toUpperCase() !== 'F'
      );
    },
    actions: [{ form: 'postnatal_visit' }],
    events: [
      {
        id: 'postnatal-home-birth',
        days: 0,
        start: 0,
        end: 4,
      },
    ],
    priority: {
      level: 'high',
      label: 'task.warning.home_birth',
    },
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there a visit report received in time window or a newer pregnancy
      return (
        r.reported_date < getNewestDeliveryTimestamp(c) ||
        r.reported_date < getNewestPregnancyTimestamp(c) ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          postnatalForms,
          Utils.addDate(dueDate, -event.start).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // PNC TASK 2: if a F flag sent in 42 days since delivery needs clinic task
  {
    name: 'postnatal_danger_sign',
    icon: 'mother-child',
    title: 'task.postnatal_danger_sign.title',
    appliesTo: 'reports',
    appliesToType: ['D', 'delivery'],
    appliesIf: function(c, r) {
      return (
        isCoveredByUseCase(c.contact, 'pnc') &&
        Utils.isFormSubmittedInWindow(
          c.reports,
          'F',
          r.reported_date,
          Utils.addDate(new Date(r.reported_date), DAYS_IN_PNC).getTime()
        )
      );
    },
    actions: [{ form: 'postnatal_visit' }],
    events: [
      {
        id: 'postnatal-danger-sign',
        start: 0,
        end: 6,
        dueDate: function(event, c) {
          return new Date(Utils.getMostRecentTimestamp(c.reports, 'F'));
        },
      },
    ],
    priority: {
      level: 'high',
      label: 'task.warning.danger_sign',
    },
    resolvedIf: function(c, r, event, dueDate) {
      // Only resolved with PNC report received from nurse in time window or a newer pregnancy
      return (
        r.reported_date < getNewestDeliveryTimestamp(c) ||
        r.reported_date < getNewestPregnancyTimestamp(c) ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          'postnatal_visit',
          Utils.addDate(dueDate, -event.start).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // PNC TASK 3: Assign a missing visit schedule to last SMS of each group
  // Associate tasks to the last message of each group. Be mindful of overflow when peaking ahead!
  {
    name: 'postnatal_missing_visit',
    icon: 'mother-child',
    title: 'task.postnatal_missing_visit.title',
    appliesTo: 'scheduled_tasks',
    appliesToType: ['D', 'delivery'],
    appliesIf: function(c, r, i) {
      return (
        isCoveredByUseCase(c.contact, 'pnc') &&
        (i + 1 >= r.scheduled_tasks.length ||
         r.scheduled_tasks[i].group !== r.scheduled_tasks[i + 1].group)
      );
    },
    priority: function(c, r) {
      if (isHomeBirth(r)) {
        return {
          level: 'high',
          label: 'task.warning.home_birth',
        };
      }
    },
    actions: [{ form: 'postnatal_visit' }],
    events: [
      {
        id: 'postnatal-missing-visit',
        days: 1,
        start: 0,
        end: 3,
      },
    ],
    resolvedIf: function(c, r, event, dueDate, i) {
      // Resolved if the scheduled SMS that generated the task is cleared,
      //          if there a visit report received in time window or a newer pregnancy
      return (
        r.scheduled_tasks[i].state === 'cleared' ||
        r.reported_date < getNewestDeliveryTimestamp(c) ||
        r.reported_date < getNewestPregnancyTimestamp(c) ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          postnatalForms,
          Utils.addDate(dueDate, -event.start).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // IMM Task based on Child Health monthly SMS
  // Assign task to specific age in months corresponding to the group number
  {
    name: 'immunization_missing_visit',
    icon: 'immunization',
    title: 'task.immunization_missing_visit.title',
    appliesTo: 'scheduled_tasks',
    appliesToType: ['C', 'CW', 'child_health_registration'],
    appliesIf: function(c, r, i) {
      return (
        isCoveredByUseCase(c.contact, 'imm') &&
        immunizationMonths.indexOf(r.scheduled_tasks[i].group) !== -1
      );
    },
    actions: [{ form: 'immunization_visit' }],
    events: [
      {
        id: 'immunization-missing-visit',
        days: 21,
        start: 7,
        end: 13,
      },
    ],
    resolvedIf: function(c, r, event, dueDate, i) {
      // Resolved if the scheduled SMS that generated the task is cleared,
      //          if an immunization report has been received in time window starting at SMS send date
      return (
        r.scheduled_tasks[i].state === 'cleared' ||
        isFormFromArraySubmittedInWindow(
          c.reports,
          immunizationForms,
          Utils.addDate(dueDate, -event.days).getTime(),
          Utils.addDate(dueDate, event.end + 1).getTime()
        )
      );
    },
  },

  // followup tasks as per nutrition program schedule (OTP, SFP, or SC)
  // {
  //   name: 'nutrition_followup',
  //   icon: 'child',
  //   title: 'task.nutrition_followup.title',
  //   appliesTo: 'scheduled_tasks',
  //   appliesToType: ['nutrition_screening'],
  //   appliesIf: function(c, r) {
  //     return (
  //       isCoveredByUseCase(c.contact, 'gmp') &&
  //       r.fields.treatment.program &&
  //       (r.fields.treatment.program === 'OTP' || r.fields.treatment.program === 'SFP' || r.fields.treatment.program === 'SC')
  //     );

  //   },
  //   actions: [{ form: 'nutrition_followup' }],
  //   events: [
  //     {
  //       id: 'nutrition-followup-missing-visit',
  //       days: 0,
  //       start: 0,
  //       end: 3,
  //     }
  //   ],
  //   resolvedIf: function(c, r, e, dueDate, i) {
  //     return (
  //       r.scheduled_tasks[i].state === 'cleared' ||
  //       isFormFromArraySubmittedInWindow(
  //         c.reports,
  //         ['nutrition_followup', 'CF'],
  //         Utils.addDate(dueDate, 0).getTime(),
  //         Utils.addDate(dueDate, e.end + 1).getTime()
  //       )
  //     );
  //   }
  // },

  // // create nutrition screening task if degree of severity is moderate or severe
  // {
  //   name: 'nutrition_screening',
  //   icon: 'child',
  //   title: 'task.nutrition_screening.title',
  //   appliesTo: 'reports',
  //   appliesToType: ['G'],
  //   appliesIf: function(c, r){
  //     var severity = r.fields.severity.toString();
  //     return severity === '3' || severity === '2';
  //   },
  //   actions: [{form: 'nutrition_screening'}],
  //   events: [
  //     {
  //     id: 'nutrition_screening',
  //     days: 2,
  //     start: 2,
  //     end: 0
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'nutrition_screening';
  //     });
  //   }
  // },

  // // create nutrition screening task if degree of severity is severe (3)
  // {
  //   name: 'nutrition_screening_missing.severe',
  //   icon: 'child',
  //   title: 'task.nutrition_screening_missing.title',
  //   appliesTo: 'reports',
  //   appliesToType: ['G'],
  //   appliesIf: function(c, r){
  //     return r.fields.severity.toString() === '3';
  //   },
  //   actions: [{form: 'nutrition_screening'}],
  //   events: [
  //     {
  //     id: 'nutrition_screening',
  //     days: 7,
  //     start: 0,
  //     end: 7
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'nutrition_screening';
  //     });
  //   }
  // },

  // // create nutrition screening task if degree of severity is moderate
  // {
  //   name: 'nutrition_screening_missing.moderate',
  //   icon: 'child',
  //   title: 'task.nutrition_screening_missing.title',
  //   appliesTo: 'reports',
  //   appliesToType: ['G'],
  //   appliesIf: function(c, r){
  //     return r.fields.severity.toString() === '2';
  //   },
  //   actions: [{form: 'nutrition_screening'}],
  //   events: [{
  //     id: 'nutrition_screening',
  //     days: 21,
  //     start: 0,
  //     end: 7
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'nutrition_screening';
  //     });
  //   }
  // },

  // Create death confirmation task
  {
    name: 'death_confirmation',
    icon: 'icon-death-general',
    title: 'task.death_confirmation.title',
    appliesTo: 'reports',
    appliesToType: ['DR', 'nutrition_exit'],
    appliesIf: function(c, r){
      return (
        r.form === 'DR' ||
        (r.form === 'nutrition_exit' && r.fields.exit.outcome === 'dead')
      );
    },
    actions: [{form: 'death_confirmation'}],
    events: [{
      id: 'death-confirmation',
      days: 2,
      start: 2,
      end: 7
    }],
    resolvedIf: function(c){
      return c.reports.some(function(r){
        return r.form === 'death_confirmation' && r.fields.death_report.death === 'yes';
      });
    }
  },

  // Exit child from nutrition program
  // {
  //   name: 'nutrition_exit',
  //   icon: 'child',
  //   title: 'task.nutrition_exit.title',
  //   appliesTo: 'reports',
  //   appliesToType: ['nutrition_followup'],
  //   appliesIf: function(c, r){
  //     return r.fields.measurements.exit === 'yes';
  //   },
  //   actions: [{form: 'nutrition_exit'}],
  //   events: [{
  //     id: 'nutrition-exit',
  //     days: 2,
  //     start: 2,
  //     end: 7
  //   }],
  //   resolvedIf: function(c){
  //     return c.reports.some(function(r){
  //       return r.form === 'nutrition_exit';
  //     });
  //   }
  // },
];
