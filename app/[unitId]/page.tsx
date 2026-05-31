import { createUnitPage } from "@brinnaebent/workbook";
import { getUnit, units } from "@/content";

export function generateStaticParams() {
  return units.map((u) => ({ unitId: u.id }));
}

export default createUnitPage(getUnit);
