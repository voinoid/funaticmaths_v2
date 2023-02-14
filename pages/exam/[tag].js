import { TagSEO } from '@/components/SEO'
import ExamListLayout from '@/layouts/ExamListLayout'
import { getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'

const root = process.cwd()
const FOLDER = 'exam'

export async function getStaticPaths() {
  const tags = await getAllTags(FOLDER)

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allItems = await getAllFilesFrontMatter(FOLDER)
  const filteredItems = allItems.filter((item) =>
    item.tags.map((t) => kebabCase(t)).includes(params.tag)
  )
  //Sort Alphabetically
  filteredItems.sort(function (a, b) {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  })

  //Get all the item Data with the front matter.
  const itemPromise = filteredItems.map(async (frontMatter) => {
    const { slug } = frontMatter
    const itemData = await getFileBySlug(FOLDER, slug)
    return itemData
  })
  const allItemData = await Promise.all(itemPromise)

  return { props: { items: allItemData, tag: params.tag } }
}

export default function Tag({ items, tag }) {
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO title={`${tag}`} description={`${tag} tags`} />
      <ExamListLayout items={items} title={title} />
    </>
  )
}
