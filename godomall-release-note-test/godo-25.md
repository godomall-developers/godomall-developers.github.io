# GODO 25

## 2026년 6월 9일

{% updates format="full" %}
{% update date="2026-06-09" tags="." %}
##

* HIGH-09 이미지 URL SSRF - MyappApi.php
* SQL Injection — moveBdId (게시판)
* SQL Injection — LIKE/BETWEEN/IN 직접 연결 (ArticleListAdmin, MemoAdmin)
* SQL Injection — UPDATE/DELETE 직접 연결 GoodsAdmin.php
* Reflected XSS — bdId 파라미터 JS 탈출 (ArticleViewController)
* SQL Injection — 동적 테이블명 삽입 (BoardReport.php)
* SQL Injection — replyStatus (게시판)
* SQL Injection — getCount 미이스케이프 (ExternalOrder.php)
{% endupdate %}

{% update date="2026-06-09" tags=".1" %}
##

* GODO26 에서, 디버깅 스택트레이스 띄워지지 않는 문제 수정
* 기업회원 가입시, 휴대폰 본인인증 후 회원가입 되지 않는 문제 수정
* eval() 함수 사용으로 인한 보안 취약점 관련 개선
* 디자인 스킨리스트 > 버튼 상단 여백 수정
* 해외몰 홈아이콘 관리 이슈
* 게시글 팝업 모드 스크롤 작동 오류
* ios date picker 미노출 오류 수정
* OBS 이미지 확인 HTTP GET → HEAD 전환
* 중복 클레임 접수 가능한 현상 개선
* 주문 엑셀 다운로드 '배송번호' 컬럼 화면과 불일치 수정
* \[디자인에디터] 영문 전용 폰트 적용 시 한글 명조체 노출 이슈 수정
* 메타 피드 TSV 마지막 컬럼 trailing 탭 제거
* AwsStorage::upload 임시파일 로컬 unlink 누락 개선
* 우체국 배송추적 에러
* 고객 클레임 신청 건의 관리자 클레임 처리 방식 개선
* 현금영수증 인증번호값이 배열 값으로 적용되어 발행실패되는 현상 개선
* 보안 Stored XSS — 게시판 제목/작성자 이스케이프
* 대표도메인 설정된 경우 PG 중앙화 페이코 신규 세팅이 불가한 현상 개선
* 게시판 업로드파일 최대크기보다 높은 용량의 파일이 업로드 되지 않도록 개선
* obsConvertFl 처리 로직 단순화 및 중복 'n' 마킹 제거


{% endupdate %}
{% endupdates %}

###
