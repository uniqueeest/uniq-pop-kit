# uniq-overlay-kit

React 애플리케이션에서 오버레이를 쉽게 관리할 수 있는 라이브러리입니다.

## 주요 기능

- Promise 기반의 간단한 오버레이 제어
- 여러 개의 오버레이 스택 관리
- 커스텀 오버레이 컴포넌트 지원
- 자동 닫힘 타이머 지원
- 중복 오버레이 키 감지

## 설치

```bash
npm install uniq-overlay-kit
# or
yarn add uniq-overlay-kit
# or
pnpm add uniq-overlay-kit
```

## 사용 방법

### 1. 애플리케이션에 OverlayContext 추가

```tsx
import { OverlayContext } from 'uniq-overlay-kit';

function App() {
  return (
    <OverlayContext>
      <YourApp />
    </OverlayContext>
  );
}
```

### 2. 오버레이 컴포넌트 생성

```tsx
import { OverlayProps } from 'uniq-overlay-kit';

const BasicOverlay = ({ resolve }: OverlayProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white">
        <h1>오버레이</h1>
        <div className="flex gap-3">
          <button onClick={() => resolve?.('확인')}>확인</button>
          <button onClick={() => resolve?.('취소')}>취소</button>
        </div>
      </div>
    </div>
  );
};
```

### 3. 오버레이 사용하기

```tsx
import { overlay } from 'uniq-overlay-kit';

function YourComponent() {
  const handleOpenOverlay = async () => {
    const result = await overlay.open(<BasicOverlay overlayKey="unique-key" />);

    if (result === '확인') {
      console.log('사용자가 확인을 선택했습니다');
    }
  };

  return <button onClick={handleOpenOverlay}>오버레이 열기</button>;
}
```

## API

### overlay.open(component, options?)

오버레이를 열고 Promise를 반환합니다.

```tsx
const result = await overlay.open(<YourOverlay overlayKey="unique-key" />, {
  duration: 3000, // 3초 후 자동으로 닫힘 (선택사항)
  dismissOnInteraction: true, // 외부 클릭이나 ESC 키로 닫기 (선택사항, 기본값: false)
});
```

### overlay.close(overlayKey)

특정 오버레이를 닫습니다.

```tsx
overlay.close('unique-key');
```

### overlay.closeAll()

모든 오버레이를 닫습니다.

```tsx
overlay.closeAll();
```

### useOverlay Hook

현재 표시된 오버레이 목록을 가져옵니다.

```tsx
const overlays = useOverlay();
```

## Props

`OverlayProps` 타입은 다음 속성들을 포함합니다:

- `overlayKey` (필수): 오버레이의 고유 식별자
- `resolve`: 오버레이 결과값을 반환하고 닫는 함수
- `duration`: 자동으로 닫히는 시간 (ms)
- `dismissOnInteraction`: 사용자 상호작용(외부 클릭/터치 또는 ESC 키)으로 오버레이를 닫을지 여부

## 주의사항

- 각 오버레이는 고유한 `overlayKey`를 가져야 합니다.
- `OverlayContext`는 애플리케이션의 최상위 레벨에 위치해야 합니다.
- 오버레이 컴포넌트는 반드시 `resolve` 함수를 처리해야 합니다.

## 요구사항

- React 18 이상
- React DOM 18 이상
