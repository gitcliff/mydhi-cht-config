const {
  // now,
  // MS_IN_DAY,
  // DAYS_IN_PNC,
  // IMMUNIZATION_LIST,
  isCoveredByUseCaseInLineage,
  getTreatmentProgram,
  
    getMostRecentReport,
  getTreatmentEnrollmentDate,
  // pregnancyForms,
  // antenatalForms,
  // postnatalForms,
  // immunizationForms,
  // getField
} = require('./contact-summary-extras');


/* eslint-disable no-global-assign */
//contact, reports, lineage are globally available for contact-summary
// const thisContact = contact;
// const thisLineage = lineage;
 const allReports = reports;
// var careReport = getMostRecentReport(allReports, 'care');
var context = {
  fstname: contact.name,
  // lstname: contact.name1,
  patient_date_of_birth: contact.date_of_birth,
  patient_aka: contact.aka,
  patient_tsis: contact.tsis,
  patient_at: contact.at,
  patient_genda: contact.genda,
  patient_docket: contact.docket,
  patient_phone: contact.phone,
  cur_address: contact.address,
  use_cases: {
    anc: isCoveredByUseCaseInLineage(lineage, 'anc'),
    pnc: isCoveredByUseCaseInLineage(lineage, 'pnc'),
    imm: isCoveredByUseCaseInLineage(lineage, 'imm'),
    gmp: isCoveredByUseCaseInLineage(lineage, 'gmp'),
  },
  treatment_program: getTreatmentProgram(),
  enrollment_date: getTreatmentEnrollmentDate(),
};

var fields = [
  // { appliesToType:'person',  label:'patient_id', value:contact.patient_id, width: 3 },
  { appliesToType:'person',  label:'Also Know As', value:contact.aka, width: 3, filter: 'phone' },
  { appliesToType:'person',  label:'First name', value:contact.name_f, width: 3, filter: '' },
  { appliesToType:'person',  label:'Last name', value:contact.name1, width: 3, filter: '' },
  { appliesToType:'person',  label:'TSIS', value:contact.tsis, width: 3, filter: 'phone' },
  { appliesToType:'person',  label:'Docket Number', value:contact.docket, width: 3, filter: '' },
  // { appliesToType:'person',  label:'Date Registered into HealthJam', value:contact.date_reg, width: 3, filter: '' },
  { appliesToType:'person',  label:'contact.age', value:contact.date_of_birth, width: 3, filter: 'age' },
  { appliesToType:'person',  label:'Date of birth', value:contact.date_of_birth, width: 3, filter: '' },
  { appliesToType:'person',  label:'Gender Identity', value:contact.genda, width: 3, filter: 'phone' },
  { appliesToType:'person',  label:'Current address', value:contact.address, width: 3, filter: '' },
  { appliesToType:'person',  label:'Phone', value:contact.phone, width: 3, filter: 'phone' },
  // { appliesToType:'person',  label:'Sex at birth', value:contact.at, width: 3, filter: 'phone' },
  { appliesToType:'person',  label:'contact.parent', value:lineage, filter: 'lineage' },
  { appliesToType:'!person', appliesIf:function() { return contact.parent && lineage[0]; }, label:'contact.parent', value:lineage, filter:'lineage' },
];

var cards = [
  {
    label: 'Risk Category (digital)',
    appliesToType: 'report',
    appliesIf: function(r){
      return r.form === 'care' && contact.type === 'person' 
      && r === getMostRecentReport(allReports, 'care');
    },
    fields: [
      {
        // label: 'task.risk.category',
        label: 'Risk Category',

        value: function(r) {
          var risk = r.fields.care.category;
          return risk;
        },
        width: 6
      },
      // {
      //   label: 'task.risk.category',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       return r.fields.care ? r.fields.care.category : 'Unknown';
      //     } 
      //     // else if (r.form === 'care_test') {
      //     //   return r.fields.photo_test ? r.fields.photo_test.category : 'Unknown'; // Adjust this field based on the form structure
      //     // }
      //     return 'Unknown';
      //   },
      //   width: 4
      // },
      {
        label: 'task.risk.score',
        value: function(r) {
          var risk = r.fields.care.score;

          return risk;
        },
        width: 3
      },
      //   // value: function(r) {
      //   //   if (r.form === 'care') {
      //   //     console.log(r.fields.care.score);

      //   //     return r.fields.care.score;
      //   //   } else if (r.form === 'care_test') {
      //   //     console.log(r.fields.photo_test.score);
      //   //     return r.fields.photo_test.score;
      //   //   }
      //   //   return null; 
      //   // },
      //   width: 3
      // },
      // {
      //   label: 'task.risk.score',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       // Ensure r.fields.care and r.fields.care.score exist before accessing
      //       return r.fields.care ? r.fields.care.score || 'Unknown' : 'Unknown';
      //     } else if (r.form === 'care_test') {
      //       // Ensure r.fields.photo_test and r.fields.photo_test.score exist before accessing
      //       return r.fields.photo_test ? r.fields.photo_test.score || 'Unknown' : 'Unknown';
      //     }
      //     return 'Unknown';
      //   },
      //   width: 3
      // },
      // {
      //   label: 'task.risk.score2',
      //   value: function(r) {
      //     var risk = r.fields.photo_test.score;
      //     return risk;
      //   },
      //   width: 3
      // },
      {
        label: 'task.risk.date',
        value: function(r) {
          var risk = r.fields.care.date_care_form;
          return risk;
        },
        width: 3
      },
      // {
      //   label: 'task.risk.date',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       // Check if r.fields.care and r.fields.care.date_care_form exist
      //       return r.fields.care ? r.fields.care.date_care_form || 'Unknown' : 'Unknown';
      //     } 
      //     // else if (r.form === 'care_test') {
      //     //   // If care_test has a different field, adjust here
      //     //   return r.fields.photo_test ? r.fields.photo_test.date_care_form || 'Unknown' : 'Unknown';
      //     // }
      //     return 'Unknown';
      //   },
      //   width: 4
      // }
      
    ] 
  },



  {
    label: 'Risk Category(summary)',
    appliesToType: 'report',
    appliesIf: function(r){
      return r.form === 'care_test' && contact.type === 'person' 
      && r === getMostRecentReport(allReports, 'care_test');
    },
    fields: [
      {
        label: 'task.risk.category',
        value: function(r) {
          var risk = r.fields.photo_test.photo_refer;
          return risk;
        },
        width: 6
      },
      // {
      //   label: 'task.risk.category',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       return r.fields.care ? r.fields.care.category : 'Unknown';
      //     } 
      //     // else if (r.form === 'care_test') {
      //     //   return r.fields.photo_test ? r.fields.photo_test.category : 'Unknown'; // Adjust this field based on the form structure
      //     // }
      //     return 'Unknown';
      //   },
      //   width: 4
      // },
      {
        label: 'task.risk.score1',
        value: function(r) {
          var risk = r.fields.photo_test.score;

          return risk;
        },
        width: 3
      },
      //   // value: function(r) {
      //   //   if (r.form === 'care') {
      //   //     console.log(r.fields.care.score);

      //   //     return r.fields.care.score;
      //   //   } else if (r.form === 'care_test') {
      //   //     console.log(r.fields.photo_test.score);
      //   //     return r.fields.photo_test.score;
      //   //   }
      //   //   return null; 
      //   // },
      //   width: 3
      // },
      // {
      //   label: 'task.risk.score1',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       // Ensure r.fields.care and r.fields.care.score exist before accessing
      //       return r.fields.care ? r.fields.care.score || 'Unknown' : 'Unknown';
      //     } else if (r.form === 'care_test') {
      //       // Ensure r.fields.photo_test and r.fields.photo_test.score exist before accessing
      //       return r.fields.photo_test ? r.fields.photo_test.score || 'Unknown' : 'Unknown';
      //     }
      //     return 'Unknown';
      //   },
      //   width: 3
      // },
      // {
      //   label: 'task.risk.score2',
      //   value: function(r) {
      //     var risk = r.fields.photo_test.score;
      //     return risk;
      //   },
      //   width: 3
      // },
      {
        label: 'task.risk.date',
        value: function(r) {
          var risk = r.fields.photo_test.date_care;
          return risk;
        },
        width: 3
      },
      // {
      //   label: 'task.risk.date',
      //   value: function(r) {
      //     if (r.form === 'care') {
      //       // Check if r.fields.care and r.fields.care.date_care_form exist
      //       return r.fields.care ? r.fields.care.date_care_form || 'Unknown' : 'Unknown';
      //     } 
      //     // else if (r.form === 'care_test') {
      //     //   // If care_test has a different field, adjust here
      //     //   return r.fields.photo_test ? r.fields.photo_test.date_care_form || 'Unknown' : 'Unknown';
      //     // }
      //     return 'Unknown';
      //   },
      //   width: 4
      // }
      
    ] 
  },
 
];

// Added to ensure CHW info is pulled into forms accessed via tasks
if(lineage[0] && lineage[0].contact) {
  context.chw_name = lineage[0].contact.name;
  context.chw_phone = lineage[0].contact.phone;
}

module.exports = {
  context,
  cards,
  fields,
};
