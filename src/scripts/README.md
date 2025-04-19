# TTS 변환 스크립트 사용 설명서

이 스크립트는 텍스트를 음성으로 변환하는 기능을 제공합니다.

## 구조

- **스크립트 위치**: `src/scripts/minimax_tts.py`
- **입력 파일**: `src/data/input/input.txt`
- **출력 파일**: `src/data/output/[timestamp]/output_*.mp3`

## 실행 방법

스크립트는 다음과 같이 실행합니다:

```bash
python src/scripts/minimax_tts.py [언어]
```

언어 파라미터는 다음과 같습니다:

- `korean`: 한국어
- `spanish`: 스페인어
- 생략시 기본값은 `default`입니다.

## 의존성 설치

필요한 패키지는 다음 명령어로 설치할 수 있습니다:

```bash
pip install -r src/scripts/requirements.txt
```

## 사용 예시

API 엔드포인트 `/api/tts`를 통해 TTS 변환을 요청할 수 있습니다:

```javascript
const response = await fetch("/api/tts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ id: textId }),
});

if (response.ok) {
  const result = await response.json();
  console.log("출력 폴더:", result.outputDir);
}
```
