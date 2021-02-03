namespace xx;

@path : '/xx.ExampleV4Service'
service ExampleV4Service {

    // UI5 Example - PivotTable Backend CDS
    type PivotColumn {
        label     : String;
        columnId  : String not null;
        type      : String not null;
    };
    type PivotCell {
        columnId        : String not null;
        stringValue     : String null;
        numberValue     : Integer null;
        booleanValue    : Boolean null;
        dateValue       : Timestamp null;
    }
    type PivotRecord {
        cells: many PivotCell;
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
