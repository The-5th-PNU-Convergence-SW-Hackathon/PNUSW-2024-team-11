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
> **회원가입**
1. **아이디/비밀번호 입력** 

    - 사용자가 **아이디 입력 필드**에 원하는 아이디를 입력한다.
    - 입력 후 중복 확인 버튼을 눌러 중복 여부를 확인한 후 , 중복된 아이디일 경우 경고문구가 표시된다.
    - 사용 가능한 아이디일 경우, "사용 가능한 아이디입니다."라는 확인 메시지가 표시된다.
    - 사용자가 **비밀번호 입력 필드**에 원하는 비밀번호를 입력한다.
    - 비밀번호는 일정 기준(8자이상-16자이하,영어, 숫자 및 특수문자 포함 )을 만족해야 하며 만족하지 않을 시 경고문구가 표시된다.
    - 사용자가 **비밀번호 재입력 필드**에 동일한 비밀번호를 한 번 더 입력하여, 비밀번호를 정확하게 입력했는지 확인한다.
      
2. **회원 정보 입력**

    - 이름,단과 대학, 학과, 학번, 전화번호, 닉네임, 부산대 이메일 등의 회원 정보를 입력하는 필드가 제공된다.
    - 전화번호 뒷자리나 학번이 유효한 형식(8자리숫자/9자리 숫자)으로 입력되지 않으면 경고 문자가 표시된다.
3. **제출 및 이메일 인증**

    - 제출 버튼을 누르면 이메일 인증 절차를 거친다.
    - 화면에 나온 링크를 클릭 하여 이메일 인증이 완료되면 가입 완료 메세지가 표시되며 로그인 페이지로 이동한다.

> **로그인**
  - 아이디와 비밀번호를 입력하고 로그인 버튼을 클릭 시 , 입력된 아이디와 비밀번호에 대한 계정이 있는지 확인한다.
  - 계정이 있는 경우 로그인에 성공해 메인 화면으로 넘어간다.
  - 계정이 없는 경우 경고 문구가 나타난다.

> **홈**
1. **상단바**
    - 홈 화면 좌측 상단의 **사용자 프로필 아이콘**을 클릭하면
  마이페이지에 접근한다.
    - 홈 화면 오른쪽 상단의 **채팅 아이콘**을 클릭하면 사용자가 진행 중인 채팅 목록을 확인할 수 있다.

2. **메인 화면**
    - **검색어 입력 필드**에 사용자가 검색어를 입력하고, **검색 버튼**을 클릭하면 입력된 검색어에 해당하는 물품의 목록들을 화면에 표시한다.
    - 검색창 아래의 **피벗’s PICK!** 버튼을 통해 가장 인기있는 매물들을 확인할 수 있다.
    - 검색창 아래의 **추천 도서, 의류, 전자기기** 등의 카테고리 아이콘을 클릭하면 해당 카테고리에 속하는 물품의  목록을 볼 수 있다.

3. **하단 네비게이션 바**
    - **홈 아이콘**: 사용자가 현재 보고 있는 메인 화면으로 돌아온다.
    - **룸메매칭 아이콘:** 룸메매칭 페이지로 이동하여 룸메이트 매칭 서비스를 이용할 수 있다.
    - **지도 아이콘**: 맛집 지도 페이지로 이동한다.
    - **알림 아이콘**: 사용자가 받은 알림 목록을 확인할 수 있다.

> **게시판**
1. **검색 기능**
    - **검색어 입력 필드**에 사용자가 검색어를 입력한 후, **검색 버튼**을 클릭하면 게시판 내의 게시물 중 해당 검색어와 일치하는 물품 이등을 포함하는 게시물을 검색하여 결과를 표시한다.
    - 검색 결과가 존재하는 경우, 관련 게시물 목록이 갱신되어 화면에 표시된다.
    - 검색 결과가 없을 경우, 빈 페이지가 나타난다.
2. **정렬 옵션**
    - 화면 상단에 **정렬 기준**을 선택할 수 있는 버튼들이 존재하며, 사용자는 **인기순**, **최신순**, **낮은 가격순**, **상태**를 기준으로 게시물 목록을 정렬할 수 있다.
    - **인기순**: 조회수나 찜하기가 많은 순서대로 게시물을 정렬하여 표시한다.
    - **최신순**: 게시물의 등록일 기준으로 가장 최근에 올라온 게시물을 먼저 표시한다.
    - **낮은 가격순**: 가격이 낮은 순서대로 게시물을 정렬하여 표시한다.
    - **상태**: 게시물의 상태 (예:매우 좋음, 좋음, 나쁨)에 따라 좋은 순서대로 정렬하여 표시한다
3. **게시물 목록**
    - 검색 결과나 정렬된 결과에 따라, 각 게시물이 카드 형식으로 화면에 표시된다.
    - 각 게시물 카드에는 다음과 같은 정보가 포함된다:
        - **이미지**: 게시물에 등록된 대표 이미지가 표시된다.
        - **제목**: 게시물의 제목이 표시된다.
        - **등록일**: 게시물이 게시판에 등록된 날짜가 표시된다.
        - **가격**: 판매자가 설정한 가격이 표시된다.
        - **카테고리**: 해당 게시물이 속한 카테고리가 표시된다 (예: 의류, 전자기기 등).
        - **상태**: 상품의 상태가 표시된다 (예: 매우 좋음, 보통, 나쁨 등).
        - **조회수**: 해당 게시물의 조회수가 표시된다.
4. **게시물 상세 페이지로 이동**
    - 사용자가 관심 있는 게시물 카드를 클릭하면, 해당 게시물의 상세 정보를 볼 수 있는 **게시물 상세 페이지**로 이동한다.
    - 상세 페이지에서는 판매자의 설명을 추가로 확인할 수 있으며, 찜하기 또는 채팅하기 기능도 제공된다.
5. **글쓰기 버튼**
    - 화면 하단 오른쪽에 **글쓰기 버튼**이 존재하며, 사용자가 새로운 게시물을 등록하고자 할 때 클릭할 수 있다.
    - 버튼을 클릭하면 게시물 작성 페이지로 이동하여 제목, 설명, 가격, 카테고리, 이미지를 입력하고 새로운 게시물을 등록할 수 있다.
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
      <br>
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
      <br>
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
|<img width="100px" alt="1" src="https://avatars.githubusercontent.com/u/67642811?v=4" /> | <img width="100px" alt="2" src="https://avatars.githubusercontent.com/u/79072462?v=4" /> | <img width="100px" alt="3" src="https://avatars.githubusercontent.com/u/108869351?v=4" /> | <img width="100px" alt="4" src="https://avatars.githubusercontent.com/u/102662177?v=4" /> | <img width="100px" alt="5" src="https://avatars.githubusercontent.com/u/133668870?v=4" /> |
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
