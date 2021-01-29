
using util from './util/util-model';
using {User} from '@sap/cds/common';
using from './CM_FILE_MST-model';

namespace cm;

entity File_Dtl {
    key tenant_id           : String(5) not null                        @title: '테넌트ID';
    key file_group_id       : UUID not null                             @title: '파일그룹ID';
    key file_id             : String(50)                                @title: 'SAP DOCUMENT ID';
        sort_number         : Integer default 0                         @title: '정렬 순서';
        origin_name         : String(400) not null                      @title: '원본 파일명';
        saved_name          : String(400)                               @title: '저장된 파일명';
        file_size           : Integer64 not null                        @title: '파일 크기';
        mime_type           : String(100) not null                      @title: '파일 마임 유형';
        confirm_flag        : Boolean default false                     @title: '확정여부';

        parent              : Association to cm.File_Mst
                                 on  parent.tenant_id = tenant_id
                                 and parent.file_group_id = file_group_id;
                                 
        local_create_dtm    : DateTime not null                         @title: '로컬등록시간';
        create_user_id      : User not null     @cds.on.insert: $user   @title: '등록사용자ID';
        system_create_dtm   : DateTime not null @cds.on.insert: $now    @title: '시스템등록시간';
}

