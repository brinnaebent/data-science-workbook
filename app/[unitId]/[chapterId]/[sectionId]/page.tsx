import { createSectionPage } from "@brinnaebent/workbook";
import { getUnit, getChapter, getSection, getAdjacentSections, units } from "@/content";
import config from "../../../../workbook.config";

export function generateStaticParams() {
  return units.flatMap((u) =>
    u.chapters.flatMap((c) =>
      c.sections.map((s) => ({ unitId: u.id, chapterId: c.id, sectionId: s.id }))
    )
  );
}

export default createSectionPage({ getUnit, getChapter, getSection, getAdjacentSections, componentMap: config.components });
