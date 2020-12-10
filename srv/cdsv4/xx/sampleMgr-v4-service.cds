using {xx as Header} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_HEADER-model';
using {xx as Detail} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_DETAIL-model';
using {xx as MgrView} from '../../../db/cds/xx/sampleMgr/XX_SAMPLE_MGR_VIEW-model';
using {xx as MasterF} from '../../../db/cds/xx/sampleMstMgr/XX_SAMPLE_MASTER_FUNC-model';

namespace xx;
@path : '/xx.SampleMgrV4Service'
service SampleMgrV4Service {

    entity SampleHeaders as projection on Header.Sample_Header;
    entity SampleDetails as projection on Detail.Sample_Detail;
/*
    type SampleHeaders {
        header_id : Integer64;
        cd : String;
        name: String;
    };
    type SampleDetails {
        detail_id : Integer64;
        header_id : Integer64;
        cd : String;
        name: String;
    };
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
   
    action SaveSampleHeaderDetailProc (inputData : array of hdSaveType) returns array of hdSaveType;
*/

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

}
