/**
 * 버전 관리 시스템
 * 
 * 버전 구조:
 * - 배포 버전: V{Major}.{Minor}.{Patch}_{YYMMDD}
 * - 개발 버전: V{Major}.{Minor}.{Patch}_{YYMMDD}_REV{순차번호}
 */

export interface Version {
  major: number;
  minor: number;
  patch: number;
  date: string;
  revision?: number;
  isProduction: boolean;
}

export class VersionManager {
  private version: Version;

  constructor(version: Version) {
    this.version = version;
  }

  /**
   * 현재 버전 문자열 반환
   */
  toString(): string {
    const baseVersion = `V${this.version.major}.${this.version.minor}.${this.version.patch}_${this.version.date}`;
    
    if (!this.version.isProduction && this.version.revision !== undefined) {
      return `${baseVersion}_REV${String(this.version.revision).padStart(3, '0')}`;
    }
    
    return baseVersion;
  }

  /**
   * 버그 수정 (Patch 증가)
   */
  bumpPatch(): void {
    this.version.patch++;
    this.updateDate();
    this.resetRevision();
  }

  /**
   * 기능 추가 (Minor 증가, Patch 초기화)
   */
  bumpMinor(): void {
    this.version.minor++;
    this.version.patch = 0;
    this.updateDate();
    this.resetRevision();
  }

  /**
   * 리팩토링 (Major 증가, Minor/Patch 초기화)
   */
  bumpMajor(): void {
    this.version.major++;
    this.version.minor = 0;
    this.version.patch = 0;
    this.updateDate();
    this.resetRevision();
  }

  /**
   * 개발 리비전 증가
   */
  bumpRevision(): void {
    if (this.version.revision === undefined) {
      this.version.revision = 1;
    } else {
      this.version.revision++;
    }
    this.version.isProduction = false;
  }

  /**
   * 프로덕션 배포 (리비전 초기화)
   */
  release(): void {
    this.version.isProduction = true;
    this.version.revision = undefined;
    this.updateDate();
  }

  /**
   * 배포 후 개발 시작 (리비전 001부터 시작)
   */
  startDevelopment(): void {
    this.version.isProduction = false;
    this.version.revision = 1;
  }

  /**
   * 날짜 업데이트 (YYMMDD 형식)
   */
  private updateDate(): void {
    const now = new Date();
    const year = String(now.getFullYear()).slice(2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.version.date = `${year}${month}${day}`;
  }

  /**
   * 리비전 초기화
   */
  private resetRevision(): void {
    this.version.revision = 1;
    this.version.isProduction = false;
  }

  /**
   * 현재 버전 정보 반환
   */
  getVersion(): Version {
    return { ...this.version };
  }
}

// 현재 버전 정보
export const CURRENT_VERSION = new VersionManager({
  major: 1,
  minor: 0,
  patch: 0,
  date: '241225',
  revision: 1,
  isProduction: false
});

// 버전 정보 내보내기
export const VERSION_STRING = CURRENT_VERSION.toString();