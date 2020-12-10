namespace sp;

using util from '../../cm/util/util-model';
// using {sp as fundingNotify} from '../standardCommon/SP_FS_FUNDING_NOTIFY-model';

entity Fs_Funding_Notify {
    key tenant_id                 : String(5) not null   @title : '테넌트ID';
    key funding_notify_number     : String(8) not null   @title : '자금지원공고번호';
        funding_notify_title      : String(100) not null @title : '자금지원공고제목';
        funding_notify_start_date : Date not null        @title : '자금지원공고시작일자';
        funding_notify_end_date   : Date not null        @title : '자금지원공고종료일자';
        funding_appl_closing_date : Date                 @title : '자금지원신청마감일자';
        funding_notify_contents   : LargeString          @title : '자금지원공고내용';
        attch_group_number        : String(100)          @title : '첨부파일그룹번호';
}

extend Fs_Funding_Notify with util.Managed;
