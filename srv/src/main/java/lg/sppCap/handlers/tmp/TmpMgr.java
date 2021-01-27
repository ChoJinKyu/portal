package lg.sppCap.handlers.tmp;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.tmp.tmpmgrservice.*;
import lg.sppCap.solutionized.bizrule.BizRuleExecutor;
import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

@Component
@ServiceName("tmp.TmpMgrService")
public class TmpMgr implements EventHandler {

    @Autowired
    private PersistenceService db;

    @Autowired
    BizRuleExecutor bizRuleExecutor;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SampleLogicTransitionContext.CDS_NAME)
    public void onSampleLogicTransition(SampleLogicTransitionContext context) {
        System.out.println("주 업무 로직 수행");
        SampleType sampleType = SampleType.create();
        String templatePath = "";

        String tenantId = (String) context.getTenantId();
        String templateId = (String) context.getTemplateId();

        if ("tmp0001".equals(templateId)) {
            templatePath = "MidObjectDetailSpecPress_Show";
        } else if ("tmp0003".equals(templateId)) {
            templatePath = "MidObjectDetailSpecPress_Edit";
        } else if ("tmp0002".equals(templateId)) {
            templatePath = "MidObjectDetailSpecMold_Show";
        } else if ("tmp0004".equals(templateId)) {
            templatePath = "MidObjectDetailSpecMold_Edit";
        }

        System.out.println("주 업무 로직 수행");
        //writeFile();
        // 비지니스 코드 구현시 업무규칙 호출이 필요한 시점
        // tenantId는 하드코드가 아니라 세션등에서 가져와야 함
        // String tenantId = "TEN001";
        String bizRuleId = "BIZRULE_ECHO_EXAMPLE";
        String altFlag = "DEFAULT";

        // 업무규칙에 넘길 파라메터를 구성한다.
        Map<String, Object> inData = new HashMap<String, Object>();
        inData.put("Name", "Hong Gil Dong");
        inData.put("Phone", "010-1234-5678");
        inData.put("Gender", "Male");
        inData.put("Email", "gdhong@lgcns.com");

        // BizRuleExecutor를 통해 업무규칙을 호출한다.
        //  Map<String, Object> outData = bizRuleExecutor.excuteBizRule(tenantId,
        //  bizRuleId, altFlag, inData);


        BizRuleInfo info = new BizRuleInfo();
      info.setTenantId("a");
      info.setBizRuleId("a");
      info.setAltFlag("a");

        
       CqnSelect infoSelect = Select
         .from(BizruleInfo_.class)
         .columns("TENANT_ID","BIZRULE_ID","ALT_FLAG","CALL_TYPE","CALL_HOST","CALL_INFO")
         .where(
           b->b.get("TENANT_ID").eq(info.getTenantId())
           .and(b.get("BIZRULE_ID").eq(info.getBizRuleId()))
           .and(b.get("ALT_FLAG").eq(info.getAltFlag()))
         );

        Result result = db.run(infoSelect);

       info.setTenantId((String)result.first().get().get("TENANT_ID"));
       info.setBizRuleId((String)result.first().get().get("BIZRULE_ID"));
       info.setAltFlag((String)result.first().get().get("ALT_FLAG"));
       info.setCallType((String)result.first().get().get("CALL_TYPE"));
       info.setCallHost((String)result.first().get().get("CALL_HOST"));
       info.setCallInfo((String)result.first().get().get("CALL_INFO"));

        sampleType.setTemplatePath(templatePath);
        context.setResult(sampleType);
        context.setCompleted();
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event = CreateTemplateSampleContext.CDS_NAME)
    public void onCreateTemplateSample(CreateTemplateSampleContext context){
        String tenantId = context.getTenantId();
        //TO-DO : 템플릿 생성 조건 변경 필요. (ex. 파일 생성 기록이 없는 템플릿 일괄 생성)
        CqnSelect viewSelect = Select.from(TmpCcConfigView_.class).where(
            b->b.get("TENANT_ID").eq(tenantId)
            .and(b.get("SCR_TMPL_ID").eq("SCTM002"))
            .and(b.get("FORM_TYPE").eq("G"))
        );

        Result result = db.run(viewSelect);
        List row = result.list();
        writeFile(row, tenantId,"");

        //TO-DO : 템플릿 생성 후 파일 생성 일자 입력 로직 필요

        context.setResult("OK");
        context.setCompleted();
    }
    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = RetrieveTemplateSampleContext.CDS_NAME)
    public void onRetrieveTemplateSample(RetrieveTemplateSampleContext context) {
        SampleType sampleType = SampleType.create();
        String templatePath = "";

        String tenantId = (String) context.getTenantId();
        String templateId = (String) context.getTemplateId();

        CqnSelect templateSelect = Select.from(TmpCcConfig001_.class)
        .columns("FORM_FILE_PATH")
        .where(
            b->b.get("SCR_TMPL_ID").eq(templateId)
        );

        Result result = db.run(templateSelect);
        templatePath = tenantId + "_" + result.first().get().get("FORM_FILE_PATH").toString();
        sampleType.setTemplatePath(templatePath);

        context.setResult(sampleType);
        context.setCompleted();
    }

    private void writeFile(List<Row> result, String tenantId, String templateId) {
        // path 변경 필요. 전달 받거나 템플릿 전용 디렉토리 지정
        String path = "/home/user/projects/sppcap/app/tmp/detailSpecEntry/webapp/view/";
        //String content = "<core:FragmentDefinitionxmlns=\"sap.m\"xmlns:l=\"sap.ui.layout\"xmlns:form=\"sap.ui.layout.form\"xmlns:core=\"sap.ui.core\"xmlns:uxap=\"sap.uxap\" ><VBox class=\"sapUiSmallMargin\"><form:SimpleForm editable=\"false\" layout=\"ResponsiveGridLayout\" content=\"{";
        String content ="<core:FragmentDefinition xmlns=\"sap.m\"  xmlns:l=\"sap.ui.layout\" xmlns:form=\"sap.ui.layout.form\" xmlns:core=\"sap.ui.core\" xmlns:uxap=\"sap.uxap\" >";
        BufferedInputStream bis = new BufferedInputStream(new ByteArrayInputStream(content.getBytes()));
        
        content += writeGrid(result, tenantId);
        content += "\n</core:FragmentDefinition>";

        //TO-DO: 파일명 규칙 구현 필요
        File file = new File(path + tenantId + "_test_grid.fragment.xml");
        try {
            FileWriter writer = new FileWriter(file);
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        
    }

    private String writeForm(List<Row> result, String tenantId){
        String content ="\n<VBox class=\"sapUiSmallMargin\">\n<form:SimpleForm editable=\"false\" layout=\"ResponsiveGridLayout\">\n<form:content>";

        for(Row row : result){
            content += "\n\t<VBox height=\"3.5rem\"><Label text=\"" + row.get("COL_ID").toString().replaceAll("_", " ") + "\"" + ("Y".equals(row.get("SCR_COL_REQUIRE_YN")) ? " required=\"true\"" : "") + "/>";
            switch((String)row.get("SCR_COL_DP_TYPE")){
                case "IB":
                    content += "\n\t\t<Input value=\"{" + JdbcUtils.convertUnderscoreNameToPropertyName((String) row.get("OWNER_TABLE_ID")) + ">/" + ((String)row.get("COL_ID")).toLowerCase() + "}\"" + ("Y".equals(row.get("SCR_COL_REQUIRE_YN")) ? " required=\"true\"" : "") + "/>";
                    break;
                case "RB":
                    content += "\n\t\t<Switch state=\"{" + JdbcUtils.convertUnderscoreNameToPropertyName((String) row.get("OWNER_TABLE_ID")) + ">/" + ((String)row.get("COL_ID")).toLowerCase() + "}\" customTextOn=\"Yes\" customTextOff=\"No\" enabled=\"false\" />";
                    break;
                case "CB":
                    content += "\n\t\t<Select   width=\"100%\" forceSelection=\"false\""
                                +"\t\t\tselectedKey=\"{" + JdbcUtils.convertUnderscoreNameToPropertyName((String) row.get("OWNER_TABLE_ID")) + ">/" + ((String)row.get("COL_ID")).toLowerCase() + "}\""
                                +"\n\t\t\titems=\"{"
                                +"\n\t\t\t\t\t\tpath : 'util>/Code',"
                                +"\n\t\t\t\t\t\tfilters : ["
                                +"\n\t\t\t\t\t\t\t{path : 'tenant_id', operator : 'EQ', value1 : '" + tenantId + "'},"
                                +"\n\t\t\t\t\t\t\t{path : 'group_code', operator : 'EQ', value1 : '" + (String)row.get("COMMON_GROUP_CODE")  + "'}"
                                +"\n\t\t\t\t\t\t]"
                                +"\n\t\t\t\t\t}\""
                                +"\n\t\t\teditable=\"true\">"
                                +"\n\t\t\t<core:Item key=\"{util>code}\" text=\"{util>code_name}\" />"
                                +"\n\t\t</Select>";
                    break;
            }
            content += "\n\t\t<layoutData>\n\t\t\t<l:GridData span=\"XL4 L4 M4 S6\" />\n\t\t</layoutData>\n\t</VBox>";

        }
        content += "\n</form:content>\n</form:SimpleForm>\n</VBox>";

        return content;
    }
    private String writeGrid(List<Row> result, String tenantId){
        //FORM_TYPE
        String content = "\n\t<VBox>";
        content += "\n\t\t<Table id=\"mainTable\" ";
        content += "\n\t\t\tsticky=\"HeaderToolbar,ColumnHeaders\" ";
        content += "\n\t\t\tinset=\"false\" ";
        content += "\n\t\t\tgrowing=\"true\"";
        content += "\n\t\t\tmode=\"SingleSelectMaster\"";
        content += "\n\t\t\tgrowingThreshold=\"10\"";
        content += "\n\t\t\tclass=\"sapFDynamicPageAlignContent\" ";
        content += "\n\t\t\tupdateFinished=\".onMainTableUpdateFinished\"";
        content += "\n\t\t\titemPress=\"onItemPress\"";
        content += "\n\t\t\titems=\"{list>/MoldMasterSpec}\"";
        content += "\n\t\t\twidth=\"auto\">";
        content += "\n\t\t\t<headerToolbar>";
        content += "\n\t\t\t\t<OverflowToolbar>";
        content += "\n\t\t\t\t\t<Title text=\"{I18N>/LIST} ({= ${list>/MoldMasterSpec}.length || 0})\" level=\"H2\"/>";
        content += "\n\t\t\t\t\t<ToolbarSpacer/>";
        content += "\n\t\t\t\t\t<Button icon=\"sap-icon://action-settings\" press=\".onMainTablePersoButtonPressed\" >";
        content += "\n\t\t\t\t\t\t<layoutData>";
        content += "\n\t\t\t\t\t\t\t<OverflowToolbarLayoutData priority=\"NeverOverflow\" />";
        content += "\n\t\t\t\t\t\t</layoutData>";
        content += "\n\t\t\t\t\t</Button>";
        content += "\n\t\t\t\t</OverflowToolbar>";
        content += "\n\t\t\t</headerToolbar>";

        String columns = "\n\t\t<columns>";
        String cells = "\n\t\t<items>\n\t\t\t<ColumnListItem type=\"Navigation\">\n\t\t\t\t<cells>";
        for(Row row : result){
            columns += "\n\t\t\t<Column>";
            columns += "\n\t\t\t\t<Text text=\"" + row.get("COL_ID").toString().replaceAll("_", " ") + "\" />";
            columns += "\n\t\t\t</Column>";
            cells += "\n\t\t\t\t\t<ObjectIdentifier text=\"{" + JdbcUtils.convertUnderscoreNameToPropertyName((String) row.get("OWNER_TABLE_ID")) + "G>/" + ((String)row.get("COL_ID")).toLowerCase() + "}\" />";
            if("DATE".equalsIgnoreCase((String) row.get("DATA_TYPE"))) {
                cells += "\n\t\t\t\t\t<DatePicker valueFormat=\"yyyyMMdd\" displayFormat=\"yyyy-MM-dd\" placeholder=\"YYYY-MM-DD\" editable=\"false\" class=\"readonlyField\"";
                cells += " value=\"{"+ JdbcUtils.convertUnderscoreNameToPropertyName((String) row.get("OWNER_TABLE_ID")) + ">/" + ((String)row.get("COL_ID")).toLowerCase() +"} \"/>";
            }
        }
        columns += "\n\t\t</columns>";
        cells += "\n\t\t\t\t</cells>\n\t\t\t</ColumnListItem>\n\t\t</items>";
        content += columns + cells;
        content += "\n\t\t</Table>\n\t</VBox>";

        return content;

    }
}