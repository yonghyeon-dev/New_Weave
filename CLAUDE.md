# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code에게 지침을 제공합니다.

# language-instructions (언어 지침)

ALWAYS communicate in Korean (한국어) when interacting with users.
Provide all explanations, instructions, and responses in Korean.

사용자와 상호작용할 때 항상 한국어로 의사소통하세요.
모든 설명, 지침, 응답을 한국어로 제공하세요.

# important-instruction-reminders (중요한 지침 알림)

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

요청된 작업만 수행하세요. 그 이상도 그 이하도 아닙니다.
목표 달성에 절대적으로 필요한 경우가 아니라면 파일을 생성하지 마세요.
항상 새 파일을 만드는 것보다 기존 파일을 편집하는 것을 우선하세요.
사용자가 명시적으로 요청하지 않는 한 문서 파일(\*.md)이나 README 파일을 먼저 생성하지 마세요.

# version-management-rules (버전 관리 규칙)

Follow these versioning rules consistently across all releases and documentation:

## Version Structure (버전 구조)

- **Production Version**: `V{Major}.{Minor}.{Patch}_{YYMMDD}`
- **Development Version**: `V{Major}.{Minor}.{Patch}_{YYMMDD}_REV{Sequential Number}`

## Version Update Rules (버전 업데이트 규칙)

- **Major (Refactoring Level)**: Large structural changes, breaking compatibility, architectural redesign
- **Minor (Feature Addition Level)**: New features, existing feature improvements
- **Patch (Bug Fix Level)**: Bug fixes, minor improvements
- **REV (Development Iteration)**: Development progress within same version
- **Post-Deployment REV Reset**: Reset REV number to 001 after deployment completion

## Version Increment Examples (버전 증가 예시)

- Bug fix: `V1.0.1` → `V1.0.2`
- Feature addition: `V1.0.2` → `V1.1.0`
- Refactoring: `V1.1.0` → `V2.0.0`
- Development progress: `REV013` → `REV014`
- **Post-deployment**: `REV016` → `REV001` (reset)

### 자동 커밋 및 릴리즈노트 워크플로우

**Claude Code는 다음 작업 완료 시 자동으로 커밋을 수행합니다:**

1. **기능 구현 완료**: 새로운 기능, 컴포넌트, API 추가 완료
2. **버그 수정 완료**: 이슈 해결 및 오류 수정 완료
3. **리팩토링 완료**: 코드 개선 및 구조 변경 완료
4. **문서화 완료**: README, 가이드, 주석 추가 완료
5. **설정 변경 완료**: 환경 설정, 빌드 구성 변경 완료

**커밋 메시지 형식:**

```bash
git commit -m "[type]: [간단한 설명]

[상세 변경 내용]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**자동 커밋 후 안내:**

```
✅ 개발 완료 및 커밋되었습니다!
```
