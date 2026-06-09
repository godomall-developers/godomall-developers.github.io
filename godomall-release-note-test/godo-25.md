# GODO 25

{% updates format="full" %}

{% update date="2026-06-01" tags="기능 추가" %}
## 기능 추가

- 이미지 URL SSRF 관련 조치
- SQL Injection 관련 조치
- Reflected XSS 관련 조치
{% endupdate %}

{% update date="2026-05-27" tags="기능 추가" %}
## 기능 추가

- 장바구니 웹훅 추가
- 플러스리뷰 외부리뷰 등록시 naver ep에서 네이버 리뷰 카운트 제거
- captcha 예외처리
- 이용약관 생성 시 '표준 약관 사용'으로 생성 가능하도록 개선
- 회원등급 null 입력 기본값 처리
- SQL Injection - BuyerInform.php
{% endupdate %}

{% update date="2026-05-27" tags="버그 수정" %}
## 버그 수정

- 기업회원 가입시, 휴대폰 본인인증 후 회원가입 되지 않는 문제 수정
- eval() 함수 사용으로 인한 보안 취약점 관련 개선
- 해외몰 홈아이콘 관리 이슈
- OBS 이미지 확인 HTTP GET → HEAD 전환
- 중복 클레임 접수 가능한 현상 개선
- 주문 엑셀 다운로드 '배송번호' 컬럼 화면과 불일치 수정
- 메타 피드 TSV 마지막 컬럼 trailing 탭 제거
- AwsStorage::upload 임시파일 로컬 unlink 누락 개선
- 우체국 배송추적 에러
- 고객 클레임 신청 건의 관리자 클레임 처리 방식 개선
- 현금영수증 인증번호값이 배열 값으로 적용되어 발행실패되는 현상 개선
- 보안 Stored XSS — 게시판 제목/작성자 이스케이프
- 대표도메인 설정된 경우 PG 중앙화 페이코 신규 세팅이 불가한 현상 개선
- 게시판 업로드파일 최대크기보다 높은 용량의 파일이 업로드 되지 않도록 개선
- obsConvertFl 처리 로직 단순화 및 중복 'n' 마킹 제거
{% endupdate %}

{% update date="2026-05-27" tags="기능 변경" %}
## 기능 변경

- GodomallSDK 상품상세 조회 내 카테고리 응답
- 네이버페이 고객센터 번호 변경
{% endupdate %}

{% update date="2026-05-27" tags="제거" %}
## 제거

- 플러스샵 문구 삭제
{% endupdate %}

{% update date="2026-04-29" tags="기능 추가" %}
## 기능 추가

- SQL Injection — 정수형 컬럼 intval 미적용
- 보안 - Reflected XSS — returnUrl
- 보안 - XSS (반사형) — OAuth 파라미터
- 주문 생성/ 완료 웹훅 응답값 추가
- 상품 노출/ 판매 수정시 상품 웹훅 전달
- 마일리지 변경 웹훅 응답값에 원본 sno 추가
- B2B: 구매했던 상품 재구매 바로담기
- 개발소스관리 2.0 개편
{% endupdate %}

{% update date="2026-04-29" tags="버그 수정" %}
## 버그 수정

- 단위가격의 단위수량(unitQuantity), 기준수량(unitBaseQuantity)에 불필요한 소수점이 노출되는 이슈 수정
- PG 미설정 상점에서 토스페이 간편 결제 수단 주문서 페이지에 노출되지 않는 현상 개선 요청
- 이지페이 에스크로(계좌이체, 가상계좌) PG 환불 불가 개선의 건
- Faq 보안 취약점 대응
- 자동취소 스케줄러 예외발생 시 중단되는 오류 개선 요청
- 주문 엑셀 다운로드시 추가 상품 정렬 순서가 변경되는 현상 개선
- 이니시스 배송처리 에스크로 관련 API 로 전환
- 게시글 내용 저장 시 보안 검증으로 인한 내용 소실 개선
- Facebook AOS > 커스텀 탭 미동작 이슈 개선
- 애널리틱스 페이지 이중 스크롤 개선
- 자동상태변경 스케줄러에서 PG 처리 관련 값이 미정의 상태로 호출되는 현상 개선
- Content-Type 잘못된 값으로 인한 ModSecurity 탐지 발생 및 서버 OOM 발생
- PG 결제 승인 중복 요청 방지 SESSION 처리
{% endupdate %}

{% update date="2026-04-29" tags="기능 변경" %}
## 기능 변경

- META 마케팅 API v22→v25 마이그레이션
- 반응형 스킨 설치 가능 상점 제한
- 정기결제 튜토리얼 배너 추가에 따른 사이즈 변경
{% endupdate %}

{% update date="2026-04-29" tags="제거" %}
## 제거

- 부가서비스 IFDO 페이드아웃
{% endupdate %}

{% endupdates %}
