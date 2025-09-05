const { chromium } = require('playwright');

async function testProjectRouting() {
  console.log('🔍 프로젝트 라우팅 시스템 테스트 시작...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 기본 프로젝트 페이지 접속
    console.log('1️⃣ 기본 프로젝트 페이지 접속 (http://localhost:3002/projects)');
    await page.goto('http://localhost:3002/projects');
    await page.waitForLoadState('networkidle');
    
    const initialURL = page.url();
    console.log(`   초기 URL: ${initialURL}`);
    
    // URL 파라미터 확인
    const urlParams = new URL(initialURL).searchParams;
    console.log(`   URL 파라미터: view=${urlParams.get('view')}, selected=${urlParams.get('selected')}`);
    
    await page.screenshot({ path: 'test-initial-page.png' });
    
    // 2. ViewModeSwitch 버튼들 확인
    console.log('\n2️⃣ ViewModeSwitch 버튼 상태 확인');
    
    // List View 버튼 확인
    const listViewButton = await page.locator('[data-testid="list-view-button"]').first();
    const listViewActive = await listViewButton.getAttribute('data-active');
    console.log(`   List View 버튼 활성 상태: ${listViewActive}`);
    
    // Detail View 버튼 확인  
    const detailViewButton = await page.locator('[data-testid="detail-view-button"]').first();
    const detailViewActive = await detailViewButton.getAttribute('data-active');
    console.log(`   Detail View 버튼 활성 상태: ${detailViewActive}`);
    
    // 3. List View → Detail View 전환 테스트
    console.log('\n3️⃣ List View → Detail View 전환 테스트');
    await detailViewButton.click();
    await page.waitForTimeout(500);
    
    const detailViewURL = page.url();
    console.log(`   Detail View 전환 후 URL: ${detailViewURL}`);
    
    const detailUrlParams = new URL(detailViewURL).searchParams;
    console.log(`   URL 파라미터: view=${detailUrlParams.get('view')}, selected=${detailUrlParams.get('selected')}`);
    
    await page.screenshot({ path: 'test-detail-view.png' });
    
    // 4. Detail View → List View 전환 테스트
    console.log('\n4️⃣ Detail View → List View 전환 테스트');
    await listViewButton.click();
    await page.waitForTimeout(500);
    
    const listViewURL = page.url();
    console.log(`   List View 전환 후 URL: ${listViewURL}`);
    
    const listUrlParams = new URL(listViewURL).searchParams;
    console.log(`   URL 파라미터: view=${listUrlParams.get('view')}, selected=${listUrlParams.get('selected')}`);
    
    // 5. 프로젝트 선택 테스트 (첫 번째 프로젝트 클릭)
    console.log('\n5️⃣ 프로젝트 선택 테스트');
    
    // 프로젝트 테이블에서 첫 번째 행 클릭
    const firstProject = await page.locator('table tbody tr').first();
    if (await firstProject.count() > 0) {
      await firstProject.click();
      await page.waitForTimeout(500);
      
      const selectedURL = page.url();
      console.log(`   프로젝트 선택 후 URL: ${selectedURL}`);
      
      const selectedUrlParams = new URL(selectedURL).searchParams;
      console.log(`   URL 파라미터: view=${selectedUrlParams.get('view')}, selected=${selectedUrlParams.get('selected')}`);
    }
    
    // 6. 직접 URL 접속 테스트: /projects/WEAVE_001
    console.log('\n6️⃣ 직접 URL 접속 테스트: http://localhost:3002/projects/WEAVE_001');
    await page.goto('http://localhost:3002/projects/WEAVE_001');
    await page.waitForTimeout(2000);
    
    const directURL = page.url();
    console.log(`   리다이렉트 후 URL: ${directURL}`);
    
    const directUrlParams = new URL(directURL).searchParams;
    console.log(`   URL 파라미터: view=${directUrlParams.get('view')}, selected=${directUrlParams.get('selected')}`);
    
    await page.screenshot({ path: 'test-direct-url.png' });
    
    // 7. 특정 파라미터 URL 직접 접속 테스트
    console.log('\n7️⃣ 특정 파라미터 URL 직접 접속: view=fullpage&selected=WEAVE_001');
    await page.goto('http://localhost:3002/projects?view=fullpage&selected=WEAVE_001');
    await page.waitForTimeout(2000);
    
    const paramURL = page.url();
    console.log(`   파라미터 URL 접속 후: ${paramURL}`);
    
    const paramUrlParams = new URL(paramURL).searchParams;
    console.log(`   URL 파라미터: view=${paramUrlParams.get('view')}, selected=${paramUrlParams.get('selected')}`);
    
    // 버튼 상태 확인
    const finalDetailActive = await page.locator('[data-testid="detail-view-button"]').first().getAttribute('data-active');
    console.log(`   Detail View 버튼 활성 상태: ${finalDetailActive}`);
    
    await page.screenshot({ path: 'test-param-url.png' });
    
    // 8. 연속 전환 테스트 (빠른 클릭으로 racing condition 확인)
    console.log('\n8️⃣ 연속 전환 테스트 (Racing Condition 확인)');
    
    const listBtn = page.locator('[data-testid="list-view-button"]').first();
    const detailBtn = page.locator('[data-testid="detail-view-button"]').first();
    
    // 빠른 연속 클릭
    await listBtn.click();
    await detailBtn.click();
    await listBtn.click();
    await detailBtn.click();
    
    await page.waitForTimeout(1000);
    
    const racingURL = page.url();
    console.log(`   연속 클릭 후 최종 URL: ${racingURL}`);
    
    const racingUrlParams = new URL(racingURL).searchParams;
    console.log(`   최종 URL 파라미터: view=${racingUrlParams.get('view')}, selected=${racingUrlParams.get('selected')}`);
    
    const finalListActive = await listBtn.getAttribute('data-active');
    const finalDetailActive2 = await detailBtn.getAttribute('data-active');
    console.log(`   최종 버튼 상태 - List: ${finalListActive}, Detail: ${finalDetailActive2}`);
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
    console.log('\n✅ 테스트 완료');
  }
}

// 실행
testProjectRouting();