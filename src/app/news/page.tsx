import DashboardLayout from '@/components/DashboardLayout'
import NewsOverview from '@/components/NewsOverview'
import { NewsAPIArticle } from '@/types'

async function getNewsData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/news?q=news&page=1&pageSize=10&type=all`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()
    return data.articles || []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function NewsPage() {
  const initialArticles = await getNewsData()

  return (
    <DashboardLayout>
      <div className="p-6">
        <NewsOverview initialArticles={initialArticles} />
      </div>
    </DashboardLayout>
  )
} 