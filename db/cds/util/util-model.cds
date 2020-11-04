namespace util;

using { User } from '@sap/cds/common';

/*
 * Aspect to capture changes by user and name.
 */
aspect Managed {
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}

annotate managed with {
  system_create_dtm  @UI.HiddenFilter;
  create_user_id  @UI.HiddenFilter;
  system_update_dtm @UI.HiddenFilter;
  update_user_id @UI.HiddenFilter;
}

annotate managed with {
  system_create_dtm  @Core.Immutable;
  create_user_id  @Core.Immutable;
}

annotate managed with {
  system_update_dtm @readonly  @odata.on.update : #now;
  system_create_dtm  @readonly  @odata.on.insert : #now;
  create_user_id  @readonly  @odata.on.insert : #user;
  update_user_id @readonly  @odata.on.update : #user;
}