using sp.Sf_Funding_Notify from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_NOTIFY-model';           //자금지원 공고
using sp.Sf_Funding_Application from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_APPLICATION-model'; //자금지원 신청서

namespace sp;
@path : '/sp.FundingNotifyService'
service FundingNotifyService {
    entity SfFundingNotify as projection on sp.Sf_Funding_Notify;

    //---------------------자금지원공고 목록 조회 뷰
    view SfFundingNotifyView as 
        select 
             key fnd.tenant_id                  //테넌트id
            ,key fnd.funding_notify_number      //자금지원 공고번호
                ,fnd.funding_notify_title       //제목
                ,fnd.funding_notify_start_date  //공고 시작일자
                ,fnd.funding_notify_end_date    //공고 종료일자
                ,fnd.funding_appl_closing_date  //신청 마감일자
                ,fnd.funding_notify_contents    //내용
                ,fnd.attch_group_number         //첨부파일 그룹 번호
                ,fnd.create_user_id             //작성자id
                ,fnd.update_user_id
                ,fnd.local_create_dtm           
                ,fnd.local_update_dtm
                ,fnd.system_create_dtm
                ,fnd.system_update_dtm
                /*
                ,(select user_local_name
                from cm_hr_employee
                where tenant_id = fnd.tenant_id
                and employee_number = fnd.create_user_id
                ) as create_user_name : String
                */
                ,'홍길동' as create_user_name : String  //작성자 명
                ,case when CURRENT_DATE between fnd.funding_notify_start_date and fnd.funding_notify_end_date then 'Y'
                    else 'N'
                end writable_yn : String(1)     //작성가능 여부: 오늘 날짜가 공고기간 안에 포함되어 있으면 작성 가능
                /*
                ,(select count(*) as appl_cnt
                from sp.Sf_Funding_Application
                where funding_notify_number = fnd.funding_notify_number
                and supplier_code = 'KR01817100'
                ) as appl_cnt : Integer         //업체가 작성한 신청서가 있는지 건수 조회: V4에서 가능
                */

        from sp.Sf_Funding_Notify fnd
        ;
}
