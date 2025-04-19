import requests
import json
import os
import os.path
import sys
import datetime
from dotenv import load_dotenv
import base64
import time
import logging
import argparse
from pathlib import Path

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # 표준 출력(콘솔)에 로그 출력
    ]
)
logger = logging.getLogger('minimax_tts')

def load_config():
    """환경 변수 및 설정을 로드하는 함수"""
    # .env 파일에서 환경 변수 로드
    load_dotenv()
    
    # 환경 변수에서 API 키와 그룹 ID 가져오기
    group_id = os.getenv("MINIMAX_GROUP_ID")
    api_key = os.getenv("MINIMAX_API_KEY")
    
    # 필수 환경 변수 확인
    if not group_id or not api_key:
        print("오류: 환경 변수 MINIMAX_GROUP_ID와 MINIMAX_API_KEY가 설정되지 않았습니다.")
        print("TTS 변환을 위해 이 값들이 필요합니다.")
        print("로컬 개발 환경에서는 .env 파일을 사용하고, Vercel에서는 환경 변수를 설정하세요.")
        sys.exit(1)
    
    config = {
        "group_id": group_id,
        "api_key": api_key,
        "url": f"https://api.minimaxi.chat/v1/t2a_v2?GroupId=",  # URL은 나중에 group_id와 함께 완성
        "voice_options": {
            "spanish": "moss_audio_800686e0-1cf0-11f0-8444-ae62a3be7263",
            "korean": "moss_audio_b96469dd-1c64-11f0-8444-ae62a3be7263",
            "default": "moss_audio_800686e0-1cf0-11f0-8444-ae62a3be7263"
        }
    }
    
    # URL 완성
    config["url"] = f"{config['url']}{config['group_id']}"
    
    return config

def setup_directories():
    """디렉토리 설정 및 생성하는 함수"""
    try:
        # 프로젝트 루트 디렉토리 가져오기
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        logger.info(f"프로젝트 루트 디렉토리: {root_dir}")
        
        # 현재 시간을 기반으로 타임스탬프 폴더 생성
        current_time = datetime.datetime.now()
        timestamp = current_time.strftime("%Y-%m-%d_%H-%M-%S")
        logger.info(f"생성할 타임스탬프 폴더: {timestamp}")
        
        # 디렉토리 구조 설정
        dirs = {
            "root": root_dir,
            "current_time": current_time,
            "timestamp": timestamp,
            "output_base": os.path.join(root_dir, "data", "output"),
            "input_file": os.path.join(root_dir, "data", "input", "input.txt")
        }
        
        # 출력 디렉토리에 타임스탬프 폴더 추가
        dirs["output"] = os.path.join(dirs["output_base"], timestamp)
        
        # data 디렉토리 확인 및 생성
        data_dir = os.path.join(root_dir, "data")
        if not os.path.exists(data_dir):
            logger.info(f"data 디렉토리 생성: {data_dir}")
            os.makedirs(data_dir, exist_ok=True)
        
        # 출력 디렉토리 생성
        if not os.path.exists(dirs["output_base"]):
            logger.info(f"출력 베이스 디렉토리 생성: {dirs['output_base']}")
            os.makedirs(dirs["output_base"], exist_ok=True)
            
        logger.info(f"타임스탬프 출력 디렉토리 생성: {dirs['output']}")
        os.makedirs(dirs["output"], exist_ok=True)
        
        # 출력 디렉토리 생성 확인
        if not os.path.exists(dirs["output"]):
            raise ValueError(f"출력 디렉토리를 생성할 수 없습니다: {dirs['output']}")
        
        # input 디렉토리 생성
        input_dir = os.path.dirname(dirs["input_file"])
        if not os.path.exists(input_dir):
            logger.info(f"입력 디렉토리 생성: {input_dir}")
            os.makedirs(input_dir, exist_ok=True)
            
        # 입력 디렉토리 생성 확인
        if not os.path.exists(input_dir):
            raise ValueError(f"입력 디렉토리를 생성할 수 없습니다: {input_dir}")
        
        # 디렉토리 권한 확인
        try:
            # 테스트 파일 생성 시도
            test_file_path = os.path.join(dirs["output"], ".test")
            with open(test_file_path, 'w') as f:
                f.write("test")
            
            # 테스트 파일 삭제
            if os.path.exists(test_file_path):
                os.remove(test_file_path)
                logger.info("출력 디렉토리 쓰기 권한 확인 완료")
            else:
                logger.warning("테스트 파일이 생성되지 않았습니다")
                
        except Exception as e:
            logger.error(f"디렉토리 쓰기 권한 테스트 실패: {e}")
            
        # 디렉토리 구조 로깅
        logger.info(f"프로젝트 루트: {dirs['root']}")
        logger.info(f"출력 기본 경로: {dirs['output_base']}")
        logger.info(f"출력 폴더: {dirs['output']}")
        logger.info(f"입력 파일 경로: {dirs['input_file']}")
        
        # 스크립트가 출력 디렉토리를 찾을 수 있도록 명시적으로 출력
        print(f"출력 폴더: {dirs['output']}")
        print(f"OUTPUT_DIR={dirs['output']}")
        
        return dirs
    except Exception as e:
        logger.error(f"디렉토리 설정 중 오류 발생: {e}")
        raise

def read_input_file(input_file_path):
    """입력 파일에서 텍스트를 읽어오는 함수"""
    try:
        logger.info(f"입력 파일 읽기 시도: {input_file_path}")
        # 파일 존재 여부 확인
        if not os.path.exists(input_file_path):
            logger.error(f"오류: {input_file_path} 파일이 존재하지 않습니다.")
            print("빈 파일을 생성합니다. 이 파일에 변환할 텍스트를 입력한 후 다시 실행하세요.")
            with open(input_file_path, 'w', encoding='utf-8') as f:
                pass  # 빈 파일 생성
            return None
        
        # 파일 읽기
        with open(input_file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # 빈 줄 제거 및 공백 정리
        lines = [line.strip() for line in lines if line.strip()]
        
        if not lines:
            logger.error(f"오류: {input_file_path} 파일이 비어있습니다.")
            print("파일에 변환할 텍스트를 입력한 후 다시 실행하세요.")
            return None
        
        logger.info(f"입력 파일 읽기 성공: {len(lines)} 줄")
        return lines
    
    except Exception as e:
        logger.error(f"파일 읽기 오류: {e}")
        return None

def process_text(text, index, total, max_length=5000):
    """텍스트 전처리 함수"""
    if len(text) > max_length:
        logger.warning(f"텍스트가 너무 깁니다({len(text)}자). {max_length}자로 자릅니다.")
        text = text[:max_length]
    
    logger.info(f"텍스트 처리 중 {index+1}/{total} (길이: {len(text)})")
    return text

def create_tts_payload(text, voice_id):
    """TTS API 요청 페이로드 생성 함수"""
    # 백업 코드와 동일한 간단한 페이로드 구조 사용
    return {
        "model": "speech-02-turbo",
        "text": text,
        "stream": False,
        "voice_setting": {
            "voice_id": voice_id,
            "speed": 1,
            "vol": 1,
            "pitch": 0
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        }
    }

def send_tts_request(url, payload, headers):
    """TTS API 요청 전송 함수"""
    try:
        logger.info("API 요청 보내는 중...")
        logger.info(f"요청 URL: {url}")
        logger.info(f"요청 페이로드: {json.dumps(payload, ensure_ascii=False, indent=2)}")
        
        response = requests.post(url, json=payload, headers=headers)
        
        # 응답 상태 코드 로깅
        logger.info(f"응답 상태 코드: {response.status_code}")
        
        # 오류 상태 코드 처리
        if response.status_code != 200:
            logger.error(f"API 오류: 상태 코드 {response.status_code}")
            logger.error(f"오류 내용: {response.text[:500]}...")
            handle_error_response(response)
            return None
            
        # 응답이 JSON인지 확인
        if 'application/json' in response.headers.get('Content-Type', ''):
            try:
                response_json = response.json()
                logger.info("API 응답 성공 (JSON)")
                return response_json
            except json.JSONDecodeError as e:
                logger.error(f"JSON 파싱 오류: {e}")
                logger.error(f"응답 내용: {response.text[:500]}...")
                return None
        else:
            logger.error(f"예상치 못한 응답 형식: {response.headers.get('Content-Type')}")
            logger.error(f"응답 내용: {response.text[:500]}...")
            return None
    except requests.exceptions.ConnectionError as err:
        logger.error(f"연결 오류: {err}")
        return None
    except requests.exceptions.Timeout as err:
        logger.error(f"타임아웃 오류: {err}")
        return None
    except requests.exceptions.RequestException as err:
        logger.error(f"요청 오류: {err}")
        return None

def handle_error_response(response):
    """오류 응답 처리 함수"""
    logger.error(f"API 오류: 상태 코드 {response.status_code}")
    logger.error(f"오류 내용: {response.text}")
    
    # 응답을 JSON으로 파싱 시도
    try:
        error_json = response.json()
        logger.error(f"오류 세부 정보: {json.dumps(error_json, ensure_ascii=False, indent=2)}")
        
        # base_resp 필드가 있는지 확인
        if 'base_resp' in error_json:
            base_resp = error_json['base_resp']
            logger.error(f"상태 코드: {base_resp.get('status_code')}")
            logger.error(f"상태 메시지: {base_resp.get('status_msg')}")
    except json.JSONDecodeError:
        logger.error("응답을 JSON으로 파싱할 수 없습니다.")
    
    if response.status_code == 401:
        logger.error("인증 오류: API 키가 유효하지 않거나 만료되었습니다.")
        sys.exit(1)
    elif response.status_code == 403:
        logger.error("접근 권한 오류: 해당 API에 대한 접근 권한이 없습니다.")
    elif response.status_code == 429:
        logger.error("사용량 제한 오류: API 호출 한도 또는 크레딧이 소진되었습니다.")
        sys.exit(1)
    elif response.status_code == 400:
        logger.error("잘못된 요청: 요청 형식이 올바르지 않습니다. 텍스트와 매개변수를 확인하세요.")
        logger.error("특수 문자나 지원되지 않는 기호가 포함되어 있을 수 있습니다.")

def process_response(response, output_path, index):
    """API 응답 처리 및 오디오 파일 저장 함수"""
    try:
        # 응답 확인 및 로깅
        logger.info(f"응답 구조 키: {list(response.keys())}")
        
        # 데이터 확인
        if "data" not in response:
            logger.error("응답에 'data' 필드가 없습니다.")
            logger.error(f"전체 응답: {json.dumps(response, indent=2)}")
            return False
            
        data = response["data"]
        logger.info(f"데이터 필드 키: {list(data.keys())}")
        
        # 오디오 데이터 확인
        if "audio" not in data:
            logger.error("응답의 data 필드에 'audio' 필드가 없습니다.")
            logger.error(f"데이터 필드: {json.dumps(data, indent=2)}")
            return False
            
        # 16진수 문자열을 바이트로 변환 (base64가 아닌 hex 형식 사용)
        try:
            audio_data = bytes.fromhex(data["audio"])
            logger.info(f"오디오 데이터 변환 성공 (hex → bytes): {len(audio_data)} 바이트")
        except ValueError as e:
            logger.error(f"16진수 변환 오류: {e}")
            logger.error(f"오디오 데이터 일부: {data['audio'][:100]}")
            return False
        
        # 파일 저장
        output_filename = f'output_{index}.mp3'
        output_filepath = os.path.join(output_path, output_filename)
        with open(output_filepath, 'wb') as f:
            f.write(audio_data)
        logger.info(f"오디오 파일 저장됨: {output_filepath}")
        
        # 추가 정보 출력
        if 'extra_info' in response:
            extra = response['extra_info']
            logger.info("오디오 정보:")
            logger.info(f"- 길이: {extra.get('audio_length', 'N/A')} ms")
            logger.info(f"- 샘플 레이트: {extra.get('audio_sample_rate', 'N/A')} Hz")
            logger.info(f"- 파일 크기: {extra.get('audio_size', 'N/A')} 바이트")
        
        return True
    except Exception as e:
        logger.error(f"응답 처리 오류: {str(e)}")
        return False

def save_summary(output_dir, lines, processed_files, current_time, language, voice_id):
    """처리 결과 요약 정보 저장 함수"""
    summary_filepath = os.path.join(output_dir, "summary.txt")
    
    with open(summary_filepath, 'w', encoding='utf-8') as f:
        f.write(f"처리 시간: {current_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"처리된 문장 수: {len(processed_files)}/{len(lines)}\n")
        f.write(f"사용된 언어: {language}\n")
        f.write(f"사용된 음성 ID: {voice_id}\n")
        f.write("\n--- 처리된 문장 목록 ---\n")
        
        for i, line in enumerate(lines, 1):
            status = "성공" if i in processed_files else "실패"
            f.write(f"{i}. [{status}] {line[:100]}{'...' if len(line) > 100 else ''}\n")
    
    logger.info(f"처리 결과 요약이 '{summary_filepath}'에 저장되었습니다.")
    return summary_filepath

def print_program_header(output_dir):
    """프로그램 헤더 출력 함수"""
    logger.info("\n===== MiniMax TTS 서비스 =====")
    logger.info("data/input/input.txt 파일에서 텍스트를 읽어 음성으로 변환합니다.")
    logger.info("각 줄은 별도의 오디오 파일로 생성됩니다.")
    logger.info(f"출력 폴더: {output_dir}")

def main():
    """메인 함수"""
    logger.info("TTS 변환 시작")
    
    # 설정 로드
    config = load_config()
    
    # 디렉토리 설정
    dirs = setup_directories()
    
    # 프로그램 헤더 출력
    print_program_header(dirs["output"])
    
    # 언어 파라미터 받기 (명령줄 인수로 전달됨)
    language = "default"
    if len(sys.argv) > 1:
        language = sys.argv[1].lower()
        logger.info(f"입력된 언어: {language}")
    
    # voice_id 선택
    voice_id = config["voice_options"].get(language, config["voice_options"]["default"])
    logger.info(f"선택된 음성 ID: {voice_id}")
    
    # 입력 파일 읽기
    lines = read_input_file(dirs["input_file"])
    if lines is None:
        logger.info("프로그램을 종료합니다.")
        sys.exit(1)
    
    # API 요청 준비
    headers = {
        'Authorization': f'Bearer {config["api_key"]}',
        'Content-Type': 'application/json'
    }
    
    logger.info("\nMiniMax TTS API 요청 준비 중...")
    # API 키 처음과 끝 일부만 출력하여 보안 강화
    api_key_masked = f"{config['api_key'][:5]}...{config['api_key'][-5:]}" if len(config['api_key']) > 10 else "***"
    logger.info(f"API 키 (마스킹됨): {api_key_masked}")
    logger.info(f"API 키 길이: {len(config['api_key'])}")
    
    # 성공적으로 처리된 파일 추적
    processed_files = {}
    
    # 각 텍스트 처리
    for i, text in enumerate(lines, 1):
        logger.info(f"텍스트 {i}/{len(lines)} 처리 중")
        
        # 텍스트 전처리
        processed_text = process_text(text, i, len(lines))
        
        # API 요청 페이로드 생성
        payload = create_tts_payload(processed_text, voice_id)
        
        # API 요청 전송
        response = send_tts_request(config["url"], payload, headers)
        if response is None:
            logger.info(f"문장 {i}을(를) 처리하지 못했습니다. 다음 문장으로 넘어갑니다.")
            continue
        
        # 응답 처리
        if process_response(response, dirs["output"], i):
            processed_files[i] = response
    
    # 처리 결과 요약 정보 저장
    summary_file = save_summary(
        dirs["output"], 
        lines, 
        processed_files, 
        dirs["current_time"], 
        language, 
        voice_id
    )
    
    # 프로그램 종료 메시지
    logger.info("\n모든 처리가 완료되었습니다.")
    logger.info(f"성공적으로 처리된 문장: {len(processed_files)}/{len(lines)}")
    logger.info(f"출력 폴더: {dirs['output']}")
    logger.info(f"요약 파일: {summary_file}")
    
    # 출력 디렉토리 경로를 두 가지 형식으로 출력
    print(f"출력 폴더: {dirs['output']}")  # 이전 형식
    print(f"OUTPUT_DIR={dirs['output']}")  # 새 형식
    
    # 출력 디렉토리 경로를 반환하여 다른 프로그램에서 활용할 수 있도록 함
    return dirs["output"]

if __name__ == "__main__":
    try:
        output_directory = main()
        logger.info(f"OUTPUT_DIR={output_directory}")  # 로그에 기록
        # 표준 출력에도 출력
        print(f"OUTPUT_DIR={output_directory}")
    except KeyboardInterrupt:
        logger.info("\n사용자에 의해 프로그램이 중단되었습니다.")
        sys.exit(2)
    except Exception as e:
        logger.error(f"프로그램 실행 중 오류가 발생했습니다: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
