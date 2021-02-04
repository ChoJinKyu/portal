namespace dp.util;
using { cm as codeMst } from '../../../../../db/cds/cm/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model'; 
using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

@path: '/dp.util.DpMdCommonService'
service DpMdCommonService {
   
    @readonly
    view CodeDetails as
        select
            key a.tenant_id,
            key a.group_code,
            key a.code,
            a.code_description, 
            a.parent_code,
            a.parent_group_code,
            a.sort_no,
            (select b.code_name from codeLng.Code_Lng b where a.tenant_id  = b.tenant_id 
                and a.group_code = b.group_code
                and a.code = b.code
                and b.language_cd = 'KO') as code_name: String(240)
        from
            codeDtl.Code_Dtl a
        where
            $now between a.start_date and a.end_date
    ;


    /** 각각 mold_id의 status 조회 
        - 협력사 선전 취소품의 벨리데이션 
    */
    @readonly 
    view MoldItemStatus as 
     select 
          key dtl.tenant_id 
        , key dtl.approval_number 
        , dtl.mold_id 
        , dm.mold_progress_status_code 
        , mst.approval_type_code  
        , mst.approve_status_code  
    from approvalMst.Approval_Mst mst 
    join approvalDtl.Md_Approval_Dtl dtl on mst.approval_number = dtl.approval_number and dtl.tenant_id = mst.tenant_id 
    join moldMst.Md_Mst dm on dm.mold_id = dtl.mold_id and dm.tenant_id =  dtl.tenant_id 
    where mst.approval_type_code = 'E' /* 협력사선정품의 */
    and mst.approve_status_code = 'AP' /* 승인 */
    and dm.mold_progress_status_code in ('SUP_APP','BUD_APP')  /* 다음단계 넘어가기 전까지의 몰드상태 */
    and dm.mold_id not in (
        select dtl2.mold_id 
        from approvalMst.Approval_Mst m2  
        join approvalDtl.Md_Approval_Dtl dtl2 on m2.approval_number = dtl2.approval_number 
        and m2.tenant_id = dtl2.tenant_id
        and m2.approval_type_code = 'A'  /* 이미 취소품의 진행중인거 제외 */
    )
    ; 


    /** DP05 모듈 plant_code 가져오기  */   
    view Divisions as
    select key a.tenant_id       
            ,key a.company_code  
            ,key a.org_type_code 
            ,key a.org_code         
                ,a.org_name          
                ,a.purchase_org_code 
                ,a.plant_code        
                ,a.affiliate_code    
                ,a.bizdivision_code  
                ,a.bizunit_code      
                ,a.au_code           
                ,a.hq_au_code        
                ,a.use_flag  
    from Org.Pur_Operation_Org a  
    left join orgMapping.Pur_Org_Type_Mapping b on a.tenant_id=b.tenant_id
    and a.org_type_code=b.org_type_code
    where b.process_type_code='DP05'
 

}