package lg.sppCap.handlers.xx;

import java.util.ArrayList;
import java.util.List;

import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;

import cds.gen.xx.examplev4service.GetPivotDataContext;
import cds.gen.xx.examplev4service.PivotColumn;
import cds.gen.xx.examplev4service.PivotData;
import cds.gen.xx.examplev4service.PivotRecord;
import cds.gen.xx.examplev4service.ExampleV4Service_;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName(ExampleV4Service_.CDS_NAME)
public class ExampleV4Service extends BaseEventHandler {

    @On(event = GetPivotDataContext.CDS_NAME)
    public void onGetPivotData(GetPivotDataContext context) {
        PivotData data = PivotData.create();
        
        int total = 13;

        List<PivotColumn> columns = new ArrayList<>();
        for(int i = 0; i < total; i++){
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
            List<String> columnIds = new ArrayList<>();
            List<String> stringValues = new ArrayList<>();
            List<Integer> numberValues = new ArrayList<>();
            List<Boolean> booleanValues = new ArrayList<>();
            for(int i = 0; i < total; i++){
                if(i == 0){
                    columnIds.add("seq");
                    stringValues.add("");
                    numberValues.add(r);
                    booleanValues.add(false);
                }else if(i == 1){
                    columnIds.add("name");
                    stringValues.add("Eva " + r);
                    numberValues.add(0);
                    booleanValues.add(false);
                }else{
                    columnIds.add("C001" + (i-3));
                    stringValues.add("string value" + (i-3));
                    numberValues.add((i-3) * 1024 * r);
                    booleanValues.add((i * r) % 2 == 1);
                    // if(i % 3 == 1) stringValues.add("string value" + (i-3));
                    // else if(i % 3 == 2) numberValues.add((i-3) * 1024 * i);
                    // else if(i % 3 == 0) booleanValues.add(i % 2 ==1);
                }
            }
            PivotRecord record = PivotRecord.create();
            record.setColumnIds(columnIds);
            record.setStringValues(stringValues);
            record.setNumberValues(numberValues);
            record.setBooleanValues(booleanValues);
            records.add(record);
        }
        data.setRecords(records);

        context.setResult(data);
        context.setCompleted();
    }

}