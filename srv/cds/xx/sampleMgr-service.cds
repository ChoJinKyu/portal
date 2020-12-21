using {xx as Header} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_HEADER-model';
using {xx as Detail} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_DETAIL-model';
using {xx as MgrView} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_MGR_VIEW-model';
using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';
using { dp as uom } from    '../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using { dp as uomLng } from '../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
namespace xx;
@path : '/xx.SampleMgrService'
service SampleMgrService {
    
    entity SampleHeaders as projection on Header.Sample_Header;
    entity SampleDetails as projection on Detail.Sample_Detail;

/*
    entity SampleHeadersRestrict @(restrict: [
        { grant: 'READ', where: 'cd = $user.header_cd' }
    ]) as  projection on Header.Sample_Header;

    view SampleViewRestrict  @(restrict: [
        { grant: 'READ', where: 'header_cd = $user.header_cd' }
    ])as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header.Sample_Header as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    ;


    view SampleViewRestrict2 as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from SampleHeadersRestrict as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    ;
*/    
/*
    // Header만 Multi
    entity SampleHeaderForMulti {
        key header_id : Integer64;
        multi_key : String;
        cd : String;
        name: String;
    }

    entity SampleMultiHeaderProc {
        key multi_key : String;
        headers: Association to many SampleHeaderForMulti on headers.multi_key = multi_key;
    }
    // Header만 Multi



    entity SampleDetailProc {
        key detail_id : Integer64;
        header_id : Integer64;
        cd : String;
        name: String;
    }

    entity SampleHeaderProc {
        key header_id : Integer64;
        cd : String;
        name: String;
        details: Association to many SampleDetailProc on details.header_id = header_id;
    }
*/
    /*
    entity SampleDetailProc {
        key detail_id : Integer64;
        header_id : Integer64;
        cd : String;
        name: String;
    }

    entity SampleHeaderProc {
        key header_id : Integer64;
        row_key : String;
        cd : String;
        name: String;
        details: Association to many SampleDetailProc on details.header_id = header_id;
    }

    entity SampleHeaderDetailProc {
        key row_key : String;
        headers: Association to many SampleHeaderProc on headers.row_key = row_key;
    }
    */

    // Procedure 호출해서 header 저장
    // Header Multi Row
    // Test 데이터
    /*********************************
    {
        "sampleHeaders" : [
            {"header_id" : 106, "cd": "eeee11", "name": "eeee11"},
            {"header_id" : 107, "cd": "eeee12", "name": "eeee12"}
        ]
    }
    *********************************/
    //action SaveSampleHeaderMultiProc (sampleHeaders : array of SampleHeaders) returns array of SampleHeaders;


    // Procedure 호출해서 header/Detail 저장
    // Header, Detail 둘다 multi
    // Test 데이터
    /*********************************
    {
        "inputData" : {
            "savedHeaders" : [
                {"header_id" : 108, "cd": "eeee1122222", "name": "eeee11"},
                {"header_id" : 109, "cd": "eeee1222222", "name": "eeee12"}
            ],
            "savedDetails" : [
                {"detail_id": 1008, "header_id" : 108, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1009, "header_id" : 108, "cd": "eeee122222", "name": "eeee12"},
                {"detail_id": 1010, "header_id" : 109, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1011, "header_id" : 109, "cd": "eeee122222", "name": "eeee12"}
            ]
        }
    }
    *********************************/
    /*
    type saveReturnType {
        savedHeaders : array of {
            header_id : Integer64;
            cd : String;
            name: String;
        };
        savedDetails : array of {
            detail_id : Integer64;
            header_id : Integer64;
            cd : String;
            name: String;
        };
    }
    

    action SaveSampleMultiEnitylProc (inputData : saveReturnType) returns saveReturnType;
    */

    // (단일 Header에 multi Detail) 가 multi
    // Test 데이터
    /*********************************
    {
        "inputData": [
            {
                "header_id" : 103,
                "cd" : "CD103",
                "name": "NAME103",
                "details": [
                    {"detail_id" : 1003, "header_id" : 103, "cd" : "CD1003", "name": "NAME1003"},
                    {"detail_id" : 1004, "header_id" : 103, "cd" : "CD1004", "name": "NAME1004"}
                ]
            },
            {
                "header_id" : 104,
                "cd" : "CD104",
                "name": "NAME104",
                "details": [
                    {"detail_id" : 1005, "header_id" : 104, "cd" : "CD1003", "name": "NAME1005"},
                    {"detail_id" : 1006, "header_id" : 104, "cd" : "CD1004", "name": "NAME1006"}
                ]
            }
        ]
    }
    *********************************/
    
    /*
    type hdSaveType {
        header_id : Integer64;
        cd : String;
        name: String;
        details:  array of {
            detail_id : Integer64;
            header_id : Integer64;
            cd : String;
            name: String;
        };
    }
    */

/*
    entity dSaveType {
        detail_id : Integer64;
        header_id : Integer64;
        cd : String;
        name: String;
    };

    entity hdSaveType {
        header_id : Integer64;
        cd : String;
        name: String;
        details : Association to many dSaveType on details.header_id = header_id; 
    }

    
    action SaveSampleHeaderDetailProc (inputData : array of hdSaveType) returns array of hdSaveType;
*/    


/*
    type Genre : String enum {
        Mystery; Fiction; Drama;
    }

    type testEntity {
        id : String;
        cd : String;
    };

    action testEntityAction (cd : String) returns testEntity;
    action testEntityActionEntityInputEnum (inputData : Genre) returns testEntity;
    //action testEntityActionEntityInput (inputData : testEntity) returns testEntity;
    //-> java.lang.IllegalArgumentException: No enum constant org.apache.olingo.odata2.api.edm.EdmSimpleTypeKind.testEntity

    type testType {
        id :String;
        cd : String;
    };
    action testTypeAction (cd : String) returns testType;
    //action testTypeActionTypeInput (inputData : testType) returns testType;
    //-> java.lang.IllegalArgumentException: No enum constant org.apache.olingo.odata2.api.edm.EdmSimpleTypeKind.testEntity

    entity viewModel as projection on MgrView.Sample_Mgr_View;
    action testModelAction (cd : String) returns viewModel;
    //action testModelActionInput (inputData : viewModel) returns viewModel;
*/




    // DB Object로 생성된 View를 조회 하는 경우 (model-cds가 존재해야함)
    view SampleMgrView as select from MgrView.Sample_Mgr_View;

    // model-cds의 entity를 join 하여 간단한 view 생성
    view SampleView as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header.Sample_Header as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    ;

    entity SampleViewCud as 
    select key h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header.Sample_Header as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    ;

/*
    //parameter를 필수로 받는 view
    view SampleViewCondition (header_cd: String, detail_cd: String) as 
    select h.header_id
          ,h.cd as header_cd
          ,h.name as header_name
          ,key d.detail_id
          ,d.cd as detail_cd
          ,d.name as detail_name
    from Header.Sample_Header as h 
    left join Detail.Sample_Detail as d on h.header_id = d.header_id
    where h.cd = :header_cd
    and   d.cd = :detail_cd
    ;

    entity MasterFunc(CD : String) as select from MasterF.Sample_Master_Func(CD: :CD);
*/
}
