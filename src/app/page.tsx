import { HomeContentSection } from '@/components/home/HomeContentSection';
import HomeLayout from '@/components/layout/HomeLayout';
import { mockHomeContent } from '@/lib/data/mockHomeContent';

export default function Home() {
  return (
    <HomeLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-txt-primary mb-4">
              흩어진 당신의 업무를 하나로 엮다
            </h1>
            <p className="text-lg text-txt-secondary max-w-2xl mx-auto">
              프리랜서를 위한 개인화 AI 기반 ERP. 계약부터 세무까지, 모든 업무를 한 곳에서 관리하세요.
            </p>
          </div>

          {/* 홈 콘텐츠 섹션 */}
          <HomeContentSection content={mockHomeContent} />
        </div>
      </div>
    </HomeLayout>
  );
}
