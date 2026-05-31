import { createChapterPage } from "@brinnaebent/workbook";
import { getUnit, getChapter, units } from "@/content";

export function generateStaticParams() {
  return units.flatMap((u) =>
    u.chapters.map((c) => ({ unitId: u.id, chapterId: c.id }))
  );
}

export default createChapterPage(getUnit, getChapter);
