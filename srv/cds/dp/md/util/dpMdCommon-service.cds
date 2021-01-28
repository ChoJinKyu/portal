namespace dp.util;
using { cm as codeMst } from '../../../../../db/cds/cm/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model'; 
using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';




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
    ; 


}