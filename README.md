안녕하세요 박범수 사전과제 입니다.

## 실행방법

1. git clone
2. yarn install or npm install
3. yarn run build or npm run build
4. yarn run start or npm run start
5. localhost:3000 접속

## 기술 스택 선택 근거

### main

- framework: next.js 14.2.2 (React 18v)(TS)
  Next.js 16버전까지 나온 상황이지만 현재 시중에 가장 많이 사용 되는 14버전 App router 사용하여 개발했습니다. 채택 이유는 다음과 같습니다.
  1. AppRouter환경에서는 api/router를 활용한 api 설계가 한층 편합니다.
  2. Next.js 16버전까지 나온 상황이지만 현재 시중에 가장 많이 사용 되는버전입니다.
  3. 가장많이 사용되는 버전답게 다른 개발자가 접근해도 유지보수성이 높습니다.
  4. middleWare/캐시등 15버전이후 강점요소들에 대한 처리과정이 적습니다.
  5. 실제 프로젝트 가정할 떄 terboPack채용 및 4번의 강점요소들이 필요해도 큰 시간소요없이 마이그레이션 가능한 버전입니다.
  6. 14.2.1 버전 까지 있던 일부 window관련 문제들이 수정된버전으로 과제 테스트 환경을 모르기에 14.2.2를 최소버전으로 생각하여 채택했습니다.
- css: scss
  아래와 같은 이유로 scss채택했으며 이 외 css라이브러리를 사용하지 않았습니다.
  1. tailwind가 현 대세를 이끌지만 아직까지 css/scss에 익숙한 개발자들이 많은 점을 감안하여 친숙한 scss를 사용했습니다.
  2. emotion/styledcomponent 는 사용 방식이 react에 최적화 되어있지만 1번과 같은 이유로 채용하지 않았습니다.
  3. mui/sharcd등 라이브러리 활용이 가능하지만 css-in-js / tailwind 최적화 이기에 최대한 scss선에서 마무리했습니다.

### libary

- state-management: jotai
  jotai는 recoil 팀에서 만든 개선작이며 recoil은 2023년 이후 업데이트가 끊겼기에 앞으로의 시장에 대한 대응이 안될 수 있어서 jotai를 채택했습니다.
  아래는 추가 사유입니다.
  1. 설계 과정에서 상태관리 요소가 "가벼운 전역상태관리 소량" 이라고 판단했습니다.
  2. 요소가 적기에 store 개념의 justand보단 atom 개념의 recoil/jotai 쪽으로 채용 방향을 정했습니다.
- chart: highcharts
  1. js, react 생태계 에서 가장 대중적인 차트 라이브러리중 하나입니다.
  2. 대안으로 echart가 존재하지만 custom측면에서 highchart가 편하며 더욱 다양한 종류를 가지고 있습니다.
- dateRange: react-day-picker
  1. react 생태계에서 가장 많이쓰는 라이브러리를 채택했습니다.
  2. 사용량이 많기에 예시도 많으며, 그에따라 다른 개발자가 유지 보수를 해야할 경우 처음 접하더라도 유지보수하기 용이합니다.
- icon: react-icons
  1. 다양한 아이콘이 담긴 라이브러리로 간단한 방법으로 많은 양의 다양한 제작자의 icon을 사용할 수 있어 채택했습니다.

## 폴더 구조 및 아키텍쳐

기본 next.js src 기반 구조를 채용했으며 각 파일의 가진 성격에 따라 아래 폴더 형태로 나눴습니다.

### 폴더구조

```
public/
src/

  app/              // next.js 기본 app입니다.
    api/            // api/router를 통해 api 로직을 작성합니다.
    dashboard/      // 화면구성의 주 파일인 page.tsx가 위치합니다.
  data/             // db.json 위치이며 public윽 외부접근이 가능하기에 src내부에 위치시켰습니다.
  hooks/            // customhook 을 모아놨습니다.
  modules/          // 컴포넌트 + 상태관리및 api호출을 관리합니다.
    components/     // 개발에 사용된 모든 컴포넌트가 용도에 따라 분류된 폴더입니다.
      common/       // 전역적으로 사용될 수 있는 컴포넌트입니다. (ex. 글로벌필터, 테이블)
      layout/       // 레이아웃 구성요소 컴포넌트 들을 모아놓은 폴더입니다.
      modal/        // 모달형태 컴포넌트를 모아놓은 폴더입니다.
      pages/        // 페이지를 구성하는 main컴포넌트+ 페이지 내부에서만 사용하는 컴포넌트 들이 위치합니다.
    lib/            // 전역 상태관리를 담당하는 jotai의 atom 변수 + api 호출 함수를 정의 한 폴더입니다.
  types/            // 다양한곳에 사용되며 import가 필요한 type
```

### 파일 분류의 기준 (데이터 관점)

저는 제공된 스키마에 의거해 크게 campaign / dailyStat 개념으로 데이터 기초 구조를 생각했으며,

이후 화면 구성기획 단계에서 platform이 실무였다면 관리가 필요한 데이터라고 판단하여 platform까지 분류를 하였습니다.

이 생각을 기반으로 현재 db에 campaign / dailyStat / platform 테이블이 존재한다. 라는 가정을 하며 파일을 분류했습니다.

해당 가정을 기반으로 공용type 및 api/ 내부 파일을 세부적으로 나누었습니다.

### 파일 분류의 기준 (클라이언트 통신 관점)

코드를 보면 api기능인 route.ts파일을 작성후 lib 내부에 api 호출 함수를 따로 정의했습니다.

이는 단순 json호출시엔 필요없지만 실제 서버 통신시 cors를 대비한 우회 목적및 serverside 에서의 호출 목적으로 나누어진 것입니다.

serverside 환경에서의 api 호출이 필요한 경우 해당 경로에 있는 api 호출함수를 사용하면 되며,

clientside 'use client' 환경에서 호출은 table별로 분류된 customHook을 통해 쉽게 호출할 수 있도록 하였습니다.

또한 데이터가 저장될 atom 폴더와 server 호출 api 함수를 lib 폴더에 같이 묶어 개발자의 접근성을 높였습니다.

## 컴포넌트 설계

컴포넌트 관련으로는 모달과 테이블 컴포넌트 쪽이 있는것 같습니다.

우선 모달은 미리 레이어를 따놓고 children을 받을 수 있어 해당부분은 재사용성을 고려했습니다.

테이블은 테이블 컴포넌트 본체를 기본으로 상단 툴바영역을 커스텀 할 수 있는 방향성으로 사용했습니다.

번외로 클라이언트 단 api통신쪽을 customhook을 활용해 어디서든 편하게 호출 수 있도록 하였으며,

공용타입 요소들은 따로 root/type 경로에서 파일분류 기준에 맞춰 관리합니다.
