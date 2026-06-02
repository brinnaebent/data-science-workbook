import type { Unit } from "@brinnaebent/workbook";
import dataStorytelling from "./data-storytelling";
import statistics from "./statistics";
import engineering from "./engineering";

export const units: Unit[] = [dataStorytelling, statistics, engineering];

export function getUnit(id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function getChapter(unitId: string, chapterId: string) {
  return getUnit(unitId)?.chapters.find((c) => c.id === chapterId);
}

export function getSection(unitId: string, chapterId: string, sectionId: string) {
  return getChapter(unitId, chapterId)?.sections.find((s) => s.id === sectionId);
}

export function getAdjacentSections(unitId: string, chapterId: string, sectionId: string) {
  const unit = getUnit(unitId);
  if (!unit) return { prev: null, next: null };

  const allSections: { unit: Unit; chapter: Unit["chapters"][0]; section: Unit["chapters"][0]["sections"][0] }[] = [];
  for (const chapter of unit.chapters) {
    for (const section of chapter.sections) {
      allSections.push({ unit, chapter, section });
    }
  }

  const idx = allSections.findIndex(
    (s) => s.chapter.id === chapterId && s.section.id === sectionId
  );

  const prev = idx > 0 ? allSections[idx - 1] : null;
  const next = idx < allSections.length - 1 ? allSections[idx + 1] : null;

  return {
    prev: prev
      ? { unit: { id: prev.unit.id }, chapter: { id: prev.chapter.id, title: prev.chapter.title }, section: { id: prev.section.id, title: prev.section.title } }
      : null,
    next: next
      ? { unit: { id: next.unit.id }, chapter: { id: next.chapter.id, title: next.chapter.title }, section: { id: next.section.id, title: next.section.title } }
      : null,
  };
}
