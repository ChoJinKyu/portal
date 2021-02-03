package lg.sppCap.handlers.xx;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;

import cds.gen.xx.examplev4service.ExampleV4Service_;
import cds.gen.xx.examplev4service.GetLocalizedMessageContext;
import cds.gen.xx.examplev4service.GetPivotDataContext;
import cds.gen.xx.examplev4service.LocalizedMessage;
import cds.gen.xx.examplev4service.MessageDefine;
import cds.gen.xx.examplev4service.PivotCell;
import cds.gen.xx.examplev4service.PivotColumn;
import cds.gen.xx.examplev4service.PivotData;
import cds.gen.xx.examplev4service.PivotRecord;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName(ExampleV4Service_.CDS_NAME)
public class ExampleV4Service extends BaseEventHandler {

    @On(event = GetPivotDataContext.CDS_NAME)
    public void onGetPivotData(GetPivotDataContext context) {
        PivotData data = PivotData.create();
        
        int minColumn = 7;
        int maxColumn = 25;
        int columnCount = new Random().nextInt((maxColumn - minColumn) + 1) + minColumn;

        List<PivotColumn> columns = new ArrayList<>();
        for(int i = 0; i < columnCount; i++){
            PivotColumn column = PivotColumn.create();
            if(i == 0){
                column.setLabel("Seq.");
                column.setColumnId("seq");
                column.setType("number");
            }else if(i == 1){
                column.setLabel("Name");
                column.setColumnId("name");
                column.setType("string");
            }else{
                column.setLabel("Dynamic C" + (i-3));
                column.setColumnId("C001" + (i-3));
                if(i % 3 == 1) column.setType("string");
                else if(i % 3 == 2) column.setType("number");
                else if(i % 3 == 0) column.setType("boolean");
            }
            columns.add(column);
        }
        data.setColumns(columns);

        List<PivotRecord> records = new ArrayList<>();
        for(int r = 0; r < 6; r++){
            List<PivotCell> cells = new ArrayList<>();
            for(int i = 0; i < columnCount; i++){
                PivotCell cell = PivotCell.create();
                if(i == 0){
                    cell.setColumnId("seq");
                    cell.setNumberValue(r);
                }else if(i == 1){
                    cell.setColumnId("name");
                    cell.setStringValue("Henly " + r + "th junior");
                }else{
                    cell.setColumnId("C001" + (i-3));
                    if(i % 3 == 1) cell.setStringValue("string value" + (i-3));
                    else if(i % 3 == 2) cell.setNumberValue((i-3) * 1024 * r);
                    else if(i % 3 == 0) cell.setBooleanValue((i * r) % 2 == 1);
                }
                cells.add(cell);
            }
            PivotRecord record = PivotRecord.create();
            record.setCells(cells);
            records.add(record);
        }
        data.setRecords(records);

        context.setResult(data);
        context.setCompleted();
    }


    @On(event = GetLocalizedMessageContext.CDS_NAME)
    public void onGetPivotData(GetLocalizedMessageContext context) {

        String tenantId = "L2100";
        String languageCode = context.getLanguageCode();

        LocalizedMessage result = LocalizedMessage.create();
        MessageDefine define;

        List<MessageDefine> buttons = new ArrayList<>();

        define = MessageDefine.create();
        define.setCode("TEMP_SAVE");
        define.setText(super.getMessage("TEMP_SAVE", context));
        buttons.add(define);

        define = MessageDefine.create();
        define.setCode("TEMP_SAVE");
        define.setText(super.getMessage("TEMP_SAVE", tenantId, languageCode));
        buttons.add(define);

        define = MessageDefine.create();
        define.setCode("REJECT");
        define.setText(super.getMessage("REJECT", context));
        buttons.add(define);

        define = MessageDefine.create();
        define.setCode("REJECT");
        define.setText(super.getMessage("REJECT", tenantId, languageCode));
        buttons.add(define);

        result.setButtons(buttons);



        List<MessageDefine> labels = new ArrayList<>();

        define = MessageDefine.create();
        define.setCode("ACCOUNT_CODE");
        define.setText(super.getMessage("ACCOUNT_CODE", context));
        labels.add(define);

        define = MessageDefine.create();
        define.setCode("ACCOUNT_CODE");
        define.setText(super.getMessage("ACCOUNT_CODE", tenantId, languageCode));
        labels.add(define);

        define = MessageDefine.create();
        define.setCode("ACQ_DEPARTMENT_CODE");
        define.setText(super.getMessage("ACQ_DEPARTMENT_CODE", context));
        labels.add(define);

        define = MessageDefine.create();
        define.setCode("ACQ_DEPARTMENT_CODE");
        define.setText(super.getMessage("ACQ_DEPARTMENT_CODE", tenantId, languageCode));
        labels.add(define);

        result.setLabels(labels);


        List<MessageDefine> messages = new ArrayList<>();

        define = MessageDefine.create();
        define.setCode("NCM00501");
        define.setText(super.getMessage("NCM00501", context, 2, "Save"));
        messages.add(define);

        define = MessageDefine.create();
        define.setCode("NCM00501");
        define.setText(super.getMessage("NCM00501", tenantId, languageCode, 2, "Save"));
        messages.add(define);

        define = MessageDefine.create();
        define.setCode("ECM01502");
        define.setText(super.getMessage("ECM01502", context, "Reject"));
        messages.add(define);

        define = MessageDefine.create();
        define.setCode("ECM01502");
        define.setText(super.getMessage("ECM01502", tenantId, languageCode, "Reject"));
        messages.add(define);

        result.setMessages(messages);
        
        context.setResult(result);
        context.setCompleted();
    }

}