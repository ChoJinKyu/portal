
using {User} from '@sap/cds/common';
using from './CM_FILE_MST-model';

namespace cm;

entity File_Dtl {
    key tenant_id           : String(5) not null                            @title: '테넌트ID';
    key file_group_id       : UUID not null                                 @title: '파일그룹ID';
    key file_id             : String(50) not null                           @title: '파일ID(SAP DOCUMENT ID)';
        sort_number         : Integer default 0                             @title: '정렬순서';
        original_file_name  : String(400) not null                          @title: '원본파일명';
        save_file_name      : String(400)                                   @title: '저장파일명';
        file_size           : Integer64 not null                            @title: '파일크기';
        mime_type_name      : String(100) not null                          @title: 'MIME유형명';
        confirm_flag        : Boolean default false                         @title: '확정여부';

        parent              : Association to cm.File_Mst
                                 on  parent.tenant_id = tenant_id
                                 and parent.file_group_id = file_group_id;
                                 
        local_create_dtm    : DateTime not null @cds.on.insert: $localNow   @title: '로컬등록시간';
        create_user_id      : User not null     @cds.on.insert: $user       @title: '등록사용자ID';
        system_create_dtm   : DateTime not null @cds.on.insert: $now        @title: '시스템등록시간';
}
