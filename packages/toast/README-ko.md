# uniq-toast-kit

React 애플리케이션에서 토스트 메시지를 쉽게 관리할 수 있는 라이브러리입니다.

## 주요 기능

- 컴포넌트 내부에서 직접 토스트 호출
- API를 통한 외부 토스트 호출
- 자동 삭제 타이머 지원
- 커스텀 지속 시간 설정
- 다중 토스트 스택 관리

## 설치

```bash
npm install uniq-toast-kit
# or
yarn add uniq-toast-kit
# or
pnpm add uniq-toast-kit
```

## 사용 방법

### 1. 애플리케이션에 ToastProvider 추가

```tsx
import { ToastProvider, ToastInitializer } from 'uniq-toast-kit';

function App() {
  return (
    <ToastProvider>
      <ToastInitializer />
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. Toast 컴포넌트 구현하기

이 라이브러리는 토스트 상태 관리 로직만 제공하며, UI 컴포넌트는 직접 구현해야 합니다:

```tsx
import { useToast } from 'uniq-toast-kit';

export const Toast = () => {
  const { overlayList, hideToast } = useToast();

  return (
    <section className="fixed top-4 right-4 z-50 flex flex-col gap-4">
      {overlayList.map((overlay) => {
        const { id, title, description } = overlay;

        return (
          <div key={id} className="bg-white rounded-lg shadow p-4 flex items-center" role="alert">
            {/* 아이콘 영역 */}
            <div className={`w-8 h-8 rounded-lg ${title === '오류' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {/* 아이콘 내용 */}
            </div>

            {/* 텍스트 영역 */}
            <div className="ml-3">
              <h3 className="text-[16px]">{title}</h3>
              <p className="text-[14px]">{description}</p>
            </div>

            {/* 닫기 버튼 */}
            <button type="button" className="ml-auto p-1.5" onClick={() => hideToast(id)}>
              {/* 닫기 아이콘 */}
            </button>
          </div>
        );
      })}
    </section>
  );
};
```

구현한 Toast 컴포넌트를 애플리케이션에 추가합니다:

```tsx
import { ToastProvider, ToastInitializer } from 'uniq-toast-kit';
import { Toast } from './Toast';

function App() {
  return (
    <ToastProvider>
      <ToastInitializer />
      <Toast />
      <YourApp />
    </ToastProvider>
  );
}
```

### 3. 컴포넌트 내부에서 사용하기

```tsx
import { useToast } from 'uniq-toast-kit';

function YourComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      title: '성공',
      description: '작업이 완료되었습니다',
      duration: 3000, // 선택사항, 기본값 3000ms
    });
  };

  return <button onClick={handleClick}>토스트 보여주기</button>;
}
```

### 4. API를 통해 외부에서 사용하기

```tsx
import { toastApi } from 'uniq-toast-kit';

// API 호출 함수 내부 등에서 사용
const saveData = async (data: any) => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toastApi.create({
        title: '성공',
        description: '데이터가 저장되었습니다',
      });
      return true;
    }
  } catch (error) {
    toastApi.create({
      title: '오류',
      description: '저장 중 문제가 발생했습니다',
    });
    return false;
  }
};
```

## API

### useToast Hook

```tsx
const { showToast, hideToast, overlayList } = useToast();
```

#### showToast(options)

토스트를 표시합니다.

```tsx
showToast({
  title: string,       // 토스트 제목
  description: string, // 토스트 내용
  duration?: number    // 표시 시간 (ms, 기본값: 3000)
});
```

#### hideToast(id)

특정 토스트를 숨깁니다.

```tsx
hideToast('toast-id');
```

#### overlayList

현재 표시된 토스트 목록을 반환합니다. 각 토스트 객체는 다음 속성을 가집니다:

```tsx
{
  id: string,       // 토스트 고유 ID
  title: string,    // 토스트 제목
  description: string, // 토스트 내용
}
```

### toastApi

컴포넌트 외부에서 토스트를 표시할 수 있는 API를 제공합니다.

```tsx
toastApi.create({
  title: string, // 토스트 제목
  description: string, // 토스트 내용
});
```

## 주의사항

- `ToastProvider`는 애플리케이션의 최상위 레벨에 위치해야 합니다.
- `ToastInitializer`는 반드시 `ToastProvider` 내부에 있어야 합니다.
- 외부 API 사용을 위해서는 `ToastInitializer`가 필요합니다.
- 이 라이브러리는 토스트 UI를 제공하지 않으므로, 직접 UI 컴포넌트를 구현해야 합니다.

## 요구사항

- React 18 이상
- React DOM 18 이상

## 예제

```tsx
function Demo() {
  const { showToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            title: '알림',
            description: '새로운 메시지가 있습니다',
            duration: 5000,
          })
        }
      >
        알림 보내기
      </button>
    </div>
  );
}
```
