#### 1.1. 개발배경 및 필요성
> 프로젝트를 실행하게 된 배경 및 필요성을 작성하세요.

#### 1.2. 개발 목표 및 주요 내용
> 프로젝트의 목표 및 주요 내용을 작성하세요.

#### 1.3. 세부내용
> 위 내용을 작성하세요.

#### 1.4. 기존 서비스 대비 차별성
> 위 내용을 작성하세요.

#### 1.5. 사회적가치 도입 계획
> 위 내용을 작성하세요.


### 2. 상세설계
#### 2.1. 시스템 구성도
<img width="656" alt="시스템구성도" src="https://github.com/user-attachments/assets/d0d108be-96ad-405c-ba89-01cec4856617">

#### 2.1. 사용 기술
| 기술       | 버전       |
|------------|------------|
| HTML       | html5      |
| CSS        | css3       |
| Node.js    | v20.15.0   |
| npm        | 10.7.0     |
| jQuery     | 1.11.1     |
| Nginx      | 1.24.0     |
| MySQL      | 8.0.39     |
| Bootstrap  | 5.3.3      |
| Express.js | 4.19.2     |

### 3. 개발결과
#### 3.1. 전체시스템 흐름도
- IA (information architecture)   
  <img width="800" alt="IA" src="https://github.com/user-attachments/assets/98d31b78-52bb-44c4-b0ae-b563e74b0a8b">

- 컴포넌트   
  <img width="479" alt="컴포넌트_형식" src="https://github.com/user-attachments/assets/8d9caa10-826e-4084-a76b-1213d59d3066">

- 마이페이지   
  <img width="695" alt="마이페이지" src="https://github.com/user-attachments/assets/8d13d214-d613-4090-89c8-0d039a66f51c">

- 회원가입/로그인   
  <img width="674" alt="회원가입-로그인" src="https://github.com/user-attachments/assets/e49a411f-6bc5-4816-bb5b-57db3e384a52">

- 게시판   
  <img width="514" alt="게시판" src="https://github.com/user-attachments/assets/3c9be36a-9f6c-44eb-90d1-21f26e8591e2">

- 채팅   
  <img width="389" alt="채팅" src="https://github.com/user-attachments/assets/36f5771d-abc3-4f05-9179-d1b165163519">

#### 3.2. 기능설명
> 각 페이지 마다 사용자의 입력의 종류와 입력에 따른 결과 설명 및 시연 영상.
> 
> ex. 로그인 페이지:
> 
> - 이메일 주소와 비밀번호를 입력하면 입력창에서 유효성 검사가 진행됩니다.
> 
> - 요효성 검사를 통과하지 못한 경우, 각 경고 문구가 입력창 하단에 표시됩니다.
>   
> - 유효성 검사를 통과한 경우, 로그인 버튼이 활성화 됩니다.
>   
> - 로그인 버튼을 클릭 시, 입력한 이메일 주소와 비밀번호에 대한 계정이 있는지 확인합니다.
>   
> - 계정이 없는 경우, 경고문구가 나타납니다.
>
> (영상)

#### 3.3. 기능명세서
- 회원가입   
  <img width="700" alt="기능명세서-회원가입" src="https://github.com/user-attachments/assets/21d587fe-9fec-40c3-b8a7-d8a45468a255">

- 로그인   
  <img width="700" alt="기능명세서-로그인" src="https://github.com/user-attachments/assets/0d8599bc-0975-4986-abc5-c0fce4e234a4">

- 홈, 상하단바   
  <img width="700" alt="기능명세서-홈상하단바" src="https://github.com/user-attachments/assets/9c116cf2-51b1-480c-8f06-394797566a5d">

- 마이페이지   
  <img width="700" alt="기능명세서-마이페이지" src="https://github.com/user-attachments/assets/834ac611-1220-4f01-9111-93c3a32b75c8">

- 게시판   
  <img width="700" alt="기능명세서-게시판" src="https://github.com/user-attachments/assets/3946a5aa-6275-4fa6-a9d9-a38be0818462">

- 채팅   
  <img width="700" alt="기능명세서-채팅" src="https://github.com/user-attachments/assets/11005c42-f86a-488d-9c56-cde66d506876">

- 룸메이트 매칭   
  <img width="700" alt="기능명세서-룸메매칭" src="https://github.com/user-attachments/assets/9213f6bf-ffbc-4b38-9ae5-41f132797562">

- 지도   
  <img width="700" alt="기능명세서-지도" src="https://github.com/user-attachments/assets/e9dd3eb2-b2fb-4a34-9095-2cc118f1d9c5">


#### 3.4. 디렉토리 구조
```
P-bud
   ├─ board 
   │  ├─ detail.html     # 상세 게시글 
   │  ├─ edit.html       # 게시글 수정
   │  ├─ index.html      # 게시판 
   │  ├─ post.html       # 게시글 등록
   │  └─ matching
   │     ├─ index.html   # 매칭 게시판
   ├─ bootstrap-5.3.3-dist # Bootstrap 라이브러리
   ├─ chat    # 대화방 목록 
   │  ├─ index.html
   │  ├─ room            # 1:1 채팅방
   │  │  ├─ index.html
   │  └─ timematching    # 시간 정하기
   │     ├─ index.html
   ├─ config             # 환경 설정 및 설정 관련 파일들
   │  ├─ chat.js
   │  ├─ database.js
   │  ├─ email.js
   │  ├─ session.js
   │  ├─ sessiondb.js
   │  └─ timetable.js
   ├─ findIDPW           # ID/PW 찾기
   │  ├─ index.html
   ├─ home               # 메인 페이지
   │  ├─ home.html
   │  └─ profile              # 내 프로필
   │     ├─ profile.html
   │     ├─ purchaseHistory   # 판매내역
   │     │  ├─ purchase.html
   │     ├─ salesHistory      # 구매내역
   │     │  ├─ sales.html
   │     ├─ wishlist          # 관심목록
   │     │  ├─ wishlist.html
   │     ├─ faq               # FAQ
   │     │  ├─ faq.html
   │     └─ timetable    # 내 시간표 저장
   │        ├─ timetable.html
   ├─ js                 # JavaScript 유틸리티 스크립트 
   ├─ json               # JSON 데이터 파일들
   │  ├─ deptData.json
   │  ├─ slang.json
   ├─ login              # 로그인 페이지
   │  ├─ index.html
   ├─ map                # 맛집 지도
   │  ├─ index.html
   │  ├─ lottery.html    # 식사 메뉴 추천 룰렛
   │  └─ navigation      # 사용자 위치 추적
   │     ├─ navigation.html
   │     └─ nodelist.json
   ├─ notification       # 알림
   │  ├─ index.html
   ├─ pict               # 사진 및 이미지 파일들
   │  ├─ bar
   │  ├─ category
   │  ├─ chkbox
   │  ├─ icons
   │  ├─ map
   │  └─ profile
   ├─ pwa                # PWA 변환 관련 파일
   │  ├─ cache.json
   │  └─ manifest.json
   ├─ register           # 회원가입
   │  ├─ index.html
   │  ├─ status.html     # 이메일 인증 상태
   │  └─ verify_email    # 이메일 인증
   │     ├─ index.html
   ├─ rmt_checklist      # 룸메이트 체크리스트
   │  ├─ index.html
   ├─ rmt_matching       # 룸메이트 매칭 게시판
   │  ├─ index.html
   ├─ router             # 라우팅 관련 스크립트 (이 디렉토리 전체 제거)
   ├─ slang.csv          # 슬랭 단어 데이터
   ├─ uploads            # 업로드한 사진 파일
   ├─ package.json       # Node.js 패키지 설정 파일
   ├─ package-lock.json  # Node.js 패키지 잠금 파일
   ├─ node_modules       # 설치된 Node.js 모듈들
   └─ service_worker.js  # PWA 서비스 워커 파일
```

### 4. 설치 및 사용 방법

> **IOS**
<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/a8038c69-ab61-473d-9474-fb835893ff0c" alt="Iphone_process" width="400">
    </td>
    <td>
      1. https://p-bud.duckdns.org 링크로 접속하기<br>
      2. 하단에 있는 공유 버튼 클릭하기<br>
      3. "홈 화면에 추가" 선택<br>
      4. 다운로드 완료 !<br>
      <img src="https://github.com/user-attachments/assets/61ecf333-63ec-45c2-b844-424ebe4d4776" width=200>
    </td>
  </tr>
</table>
<br>

> **Android**
<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/4f33a8a3-3e70-4fc7-b00b-35bb3d322371" alt="Android_process" width="400">
    </td>
    <td>
      1. https://p-bud.duckdns.org 링크로 접속하기<br>
      2. 오른쪽 상단 더보기 버튼 클릭하기<br>
      3. "홈 화면에 추가" 선택<br>
      4. 다운로드 완료 !<br>
      <img src="https://github.com/user-attachments/assets/bc55a4c1-e2d4-4b7b-b2a1-8bd6e8666fc4" width=200>
    </td>
  </tr>
</table>

### 5. 소개 및 시연 영상
> 프로젝트에 대한 소개와 시연 영상을 넣으세요.
> 프로젝트 소개 동영상을 교육원 메일(swedu@pusan.ac.kr)로 제출 이후 센터에서 부여받은 youtube URL주소를 넣으세요.

### 6. 팀 소개
| 김진목 | 박혜린 | 여채언 | 이유민 | 이유진 |
|:-------:|:-------:|:-------:|:-------:|:-------:|
|<img width="100px" alt="안성수" src="https://avatars.githubusercontent.com/u/67642811?v=4" /> | <img width="100px" alt="홍태근" src="https://avatars.githubusercontent.com/u/79072462?v=4" /> | <img width="100px" alt="정솔빈" src="https://avatars.githubusercontent.com/u/108869351?v=4" /> | <img width="100px" alt="임정근" src="https://avatars.githubusercontent.com/u/102662177?v=4" /> | <img width="100px" alt="김상준" src="https://avatars.githubusercontent.com/u/133668870?v=4" /> |
| truetree@pusan.ac.kr | hyerin010140@pusan.ac.kr | codjs2659@pusan.ac.kr | wint123@pusan.ac.kr | pustraw0454@naver.com |
| 정보컴퓨터공학과 <br/> 백엔드, 보안 | 언어정보학과 <br/> 기획, 디자인 |  정보컴퓨터공학과 <br/> 백엔드 | 정보컴퓨터공학과 <br/> 프론트엔드, 디자인 | 정보컴퓨터공학과 <br/> 벡엔드, DB | 


### 7. 해커톤 참여 후기
- 김진목
  > 작성하세요.
- 박혜린
  > 작성하세요.
- 여채언
  > 작성하세요.
- 이유민
  > 작성하세요.
- 이유진
  > 작성하세요.
