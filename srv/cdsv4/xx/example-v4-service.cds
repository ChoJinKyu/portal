namespace xx;

@path : '/xx.ExampleV4Service'
service ExampleV4Service {

    // UI5 Example - PivotTable Backend CDS
    type PivotColumn {
      label: String;
      columnId: String;
      type: String;
    };
    type PivotRecord {
        columnIds: many String;
        stringValues: many String null;
        numberValues: many Integer null;
        booleanValues: many Boolean null;
        DateValues: many Timestamp null;
    };
    type PivotData {
      columns: many PivotColumn;
      records: many PivotRecord;
    };
    action GetPivotData() returns PivotData;


    // UI5 Example - Get Multilingual messages
    type MessageDefine {
      code: String;
      text: String;
    };
    type LocalizedMessage {
      labels: many MessageDefine;
      buttons: many MessageDefine;
      messages: many MessageDefine;
    };
    action GetLocalizedMessage(language_code: String) returns LocalizedMessage;

}
